import React, { useCallback, useRef, useState } from 'react';
import Papa from 'papaparse';
import JSZip from 'jszip';
import QRCodeStyling from 'qr-code-styling';
import { Language, QRData, QRType } from '../types';
import { generateQRString } from '../utils/qrGenerators';
import { qrTypeConfigs } from '../utils/qrTypes';
import {
  Layers,
  Upload,
  FileText,
  Download,
  Loader,
  CheckCircle2,
  X,
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

interface BatchPageProps {
  language: Language;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

type CsvRow = Record<string, string>;

const BATCH_FIELD_MAP: Partial<Record<QRType, string[]>> = {
  url: ['url'],
  text: ['text'],
  email: ['email', 'subject', 'body'],
  phone: ['phone'],
  sms: ['phone', 'message'],
  wifi: ['ssid', 'password', 'security'],
  whatsapp: ['identifier', 'message'],
  telegram: ['identifier'],
  messenger: ['identifier'],
  instagram: ['username'],
  twitter: ['username'],
  tiktok: ['username'],
  youtube: ['username'],
  linkedin: ['username'],
  facebook: ['username'],
  snapchat: ['username'],
  skype: ['identifier'],
  spotify: ['uri'],
  paypal: ['recipient'],
  venmo: ['recipient'],
  bitcoin: ['address'],
  ethereum: ['address'],
  custom: ['data'],
};

const BATCH_TYPES = Object.keys(BATCH_FIELD_MAP) as QRType[];

const FIELD_LABELS: Record<string, string> = {
  url: 'URL',
  text: 'Text',
  email: 'Email',
  subject: 'Subject',
  body: 'Message Body',
  phone: 'Phone Number',
  message: 'Message',
  ssid: 'Network Name (SSID)',
  password: 'Password',
  security: 'Security Type',
  identifier: 'Identifier / Phone',
  username: 'Username',
  recipient: 'Recipient',
  address: 'Wallet Address',
  uri: 'Spotify URI',
  data: 'Custom Data',
};

const STEPS = [
  { n: 1, label: 'Select Type' },
  { n: 2, label: 'Upload CSV' },
  { n: 3, label: 'Map Columns' },
  { n: 4, label: 'Generate & Download' },
];

const buildQRData = (type: QRType, row: CsvRow, mapping: Record<string, string>): QRData => {
  const base: Record<string, unknown> = { type };
  const fields = BATCH_FIELD_MAP[type] || [];
  for (const field of fields) {
    const col = mapping[field];
    base[field] = col ? (row[col] ?? '').trim() : '';
  }
  if (type === 'wifi') {
    const sec = (base.security as string) || 'WPA';
    base.security = ['WPA', 'WEP', 'nopass'].includes(sec) ? sec : 'WPA';
    base.hidden = false;
  }
  return base as unknown as QRData;
};

const renderQRBlob = async (qrString: string): Promise<Blob | null> => {
  const qr = new QRCodeStyling({
    width: 512,
    height: 512,
    type: 'canvas',
    data: qrString || ' ',
    margin: 4,
    qrOptions: { errorCorrectionLevel: 'M' },
    dotsOptions: { color: '#000', type: 'rounded' },
    backgroundOptions: { color: '#ffffff' },
  });
  const temp = document.createElement('div');
  temp.style.position = 'fixed';
  temp.style.left = '-9999px';
  temp.style.top = '0';
  document.body.appendChild(temp);
  try {
    qr.append(temp);
    await new Promise((r) => setTimeout(r, 60));
    const blob = (await qr.getRawData('png')) as Blob | null;
    return blob;
  } finally {
    document.body.removeChild(temp);
  }
};

const BatchPage: React.FC<BatchPageProps> = ({ onToast }) => {
  const [qrType, setQrType] = useState<QRType>('url');
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fields = BATCH_FIELD_MAP[qrType] || [];

  const resetState = useCallback(() => {
    setRows([]);
    setColumns([]);
    setFileName('');
    setMapping({});
    setPreviews([]);
    setError('');
    setProgress(null);
  }, []);

  const handleTypeChange = (type: QRType) => {
    setQrType(type);
    resetState();
  };

  const parseCsv = (file: File) => {
    setError('');
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          setError(`CSV parse error: ${result.errors[0].message}`);
          onToast('Failed to parse CSV file', 'error');
          return;
        }
        const data = (result.data as CsvRow[]).filter((r) =>
          Object.values(r).some((v) => v && String(v).trim() !== '')
        );
        if (data.length === 0) {
          setError('The CSV file appears to be empty.');
          onToast('CSV file is empty', 'error');
          return;
        }
        const cols = result.meta.fields ? result.meta.fields.filter(Boolean) : [];
        setRows(data);
        setColumns(cols);
        setFileName(file.name);
        const newFields = BATCH_FIELD_MAP[qrType] || [];
        const initial: Record<string, string> = {};
        newFields.forEach((f, i) => {
          initial[f] = cols[i] || '';
        });
        setMapping(initial);
        setPreviews([]);
        onToast(`Loaded ${data.length} rows from ${file.name}`, 'success');
      },
      error: (err) => {
        setError(err.message);
        onToast('Failed to read CSV file', 'error');
      },
    });
  };

  const onFileSelected = (file?: File) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      onToast('Please upload a .csv file', 'error');
      return;
    }
    parseCsv(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    onFileSelected(file);
  };

  const handleMappingChange = (field: string, col: string) => {
    setMapping((prev) => ({ ...prev, [field]: col }));
  };

  const downloadTemplate = () => {
    const cols = (BATCH_FIELD_MAP[qrType] || []).map((f) => FIELD_LABELS[f] || f);
    const sample = cols.map(() => 'sample').join(',');
    const csv = `${cols.join(',')}\n${sample}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${qrType}-batch-template.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('Template downloaded', 'success');
  };

  const handleGenerate = async () => {
    if (rows.length === 0) {
      onToast('Please upload a CSV file first', 'error');
      return;
    }
    const requiredField = fields[0];
    if (requiredField && !mapping[requiredField]) {
      onToast(`Please map a column for ${FIELD_LABELS[requiredField] || requiredField}`, 'error');
      return;
    }

    setIsGenerating(true);
    setProgress({ done: 0, total: rows.length });
    setPreviews([]);
    const zip = new JSZip();
    const previewUrls: string[] = [];
    const previewLimit = 5;

    try {
      for (let i = 0; i < rows.length; i++) {
        const qrData = buildQRData(qrType, rows[i], mapping);
        const qrString = generateQRString(qrData);
        const blob = await renderQRBlob(qrString);
        if (blob) {
          const name = `qr-${String(i + 1).padStart(3, '0')}.png`;
          zip.file(name, blob);
          if (i < previewLimit) {
            previewUrls.push(URL.createObjectURL(blob));
          }
        }
        setProgress({ done: i + 1, total: rows.length });
        if (i % 5 === 4) await new Promise((r) => setTimeout(r, 0));
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${qrType}-batch-${Date.now()}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      setPreviews(previewUrls);
      onToast(`Generated ${rows.length} QR codes and downloaded ZIP`, 'success');
    } catch (err) {
      console.error(err);
      onToast('Failed to generate QR codes', 'error');
    } finally {
      setIsGenerating(false);
      setProgress(null);
    }
  };

  const previewRows = rows.slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
          <Layers className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Batch Generate</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create QR codes in bulk from a CSV file and download them as a ZIP archive.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-wrap items-center gap-2 mt-6 mb-8">
        {STEPS.map((s, idx) => (
          <React.Fragment key={s.n}>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold">
                {s.n}
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{s.label}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-600 -rotate-90" />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Type selector */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          1. Select QR Type
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="text-sm text-gray-500 dark:text-gray-400 sm:w-32">QR Type</label>
          <div className="relative flex-1">
            <select
              value={qrType}
              onChange={(e) => handleTypeChange(e.target.value as QRType)}
              disabled={isGenerating}
              className="w-full appearance-none rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
            >
              {BATCH_TYPES.map((t) => (
                <option key={t} value={t}>
                  {qrTypeConfigs[t]?.name || t}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Fields to map: {fields.map((f) => FIELD_LABELS[f] || f).join(', ')}
        </p>
      </section>

      {/* Step 2: CSV upload */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          2. Upload CSV File
        </h2>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 px-4 text-center transition-colors ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
              : 'border-gray-300 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-600'
          }`}
        >
          <div className="p-3 rounded-full bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
            <Upload className="w-7 h-7" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Drag and drop your CSV file here
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">or</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium shadow-sm disabled:opacity-60"
          >
            <FileText className="w-4 h-4" />
            Choose File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => onFileSelected(e.target.files?.[0] || undefined)}
          />
          {fileName && (
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">
              Loaded: {fileName} ({rows.length} rows)
            </p>
          )}
        </div>

        {error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <X className="w-4 h-4" /> {error}
          </p>
        )}

        {/* Preview table */}
        {rows.length > 0 && (
          <div className="mt-5">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview (first {previewRows.length} rows)
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {columns.map((c) => (
                      <th
                        key={c}
                        className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300 whitespace-nowrap"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {previewRows.map((r, i) => (
                    <tr key={i} className="bg-white dark:bg-gray-900">
                      {columns.map((c) => (
                        <td
                          key={c}
                          className="px-3 py-2 text-gray-700 dark:text-gray-300 whitespace-nowrap max-w-[200px] truncate"
                        >
                          {r[c] || ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Step 3: Column mapping */}
      {rows.length > 0 && (
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            3. Map Columns to Fields
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field} className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {FIELD_LABELS[field] || field}
                </label>
                <div className="relative">
                  <select
                    value={mapping[field] || ''}
                    onChange={(e) => handleMappingChange(field, e.target.value)}
                    disabled={isGenerating}
                    className="w-full appearance-none rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
                  >
                    <option value="">— None —</option>
                    {columns.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Step 4: Generate & Download */}
      {rows.length > 0 && (
        <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            4. Generate & Download
          </h2>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || rows.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {isGenerating ? 'Generating...' : `Generate All (${rows.length})`}
          </button>

          {progress && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>
                  Generating {progress.done}/{progress.total}...
                </span>
                <span>{Math.round((progress.done / progress.total) * 100)}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-150"
                  style={{ width: `${(progress.done / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Preview thumbnails */}
          {previews.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Preview (first {previews.length} codes)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {previews.map((url, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white p-2 flex items-center justify-center"
                  >
                    <img
                      src={url}
                      alt={`QR preview ${i + 1}`}
                      className="w-full h-auto rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Help / Template */}
      <section className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          CSV Format Help
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Your CSV should have a header row with column names. Map each column to a QR field after
          uploading. For the <strong>{qrTypeConfigs[qrType]?.name || qrType}</strong> type, include
          columns for: <strong>{fields.map((f) => FIELD_LABELS[f] || f).join(', ')}</strong>.
        </p>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 mb-4 overflow-x-auto">
          <code className="text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">
            {(BATCH_FIELD_MAP[qrType] || []).map((f) => FIELD_LABELS[f] || f).join(',')}
            <br />
            {(BATCH_FIELD_MAP[qrType] || []).map(() => 'sample').join(',')}
          </code>
        </div>
        <button
          type="button"
          onClick={downloadTemplate}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-600 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-sm font-medium disabled:opacity-60"
        >
          <Download className="w-4 h-4" />
          Download Example Template
        </button>
      </section>
    </div>
  );
};

export default BatchPage;
