import React from 'react';
import { RotateCcw, Info } from 'lucide-react';
import { QRType, QRData, Language } from '../types';
import { qrTypeConfigs } from '../utils/qrTypes';
import { t } from '../utils/i18n';
import FormField from './FormField';

interface QRFormProps {
  currentType: QRType;
  qrData: QRData;
  language: Language;
  validationErrors: string[];
  onTypeChange: (type: QRType) => void;
  onDataChange: (data: Partial<QRData>) => void;
  onValidation: (errors: string[]) => void;
  onReset: () => void;
}

const QRForm: React.FC<QRFormProps> = ({
  currentType,
  qrData,
  language,
  validationErrors,
  onTypeChange,
  onDataChange,
  onReset
}) => {
  const currentConfig = qrTypeConfigs[currentType];

  const handleFieldChange = (fieldName: string, value: any) => {
    onDataChange({ [fieldName]: value });
  };

  const tipText: Record<string, string> = {
    wifi: 'Scanning connects to Wi-Fi automatically.',
    url: 'Opens the website in the default browser.',
    email: 'Opens the email app with pre-filled content.',
    phone: 'Prompts to call the phone number.',
    sms: 'Opens messaging with pre-filled recipient and message.',
    location: 'Opens the location in maps.',
    contact: 'Creates a vCard that saves to contacts.',
    event: 'Prompts to add the event to calendar.',
    text: 'Displays the text content when scanned.',
    whatsapp: 'Opens WhatsApp with pre-filled contact.',
    telegram: 'Opens Telegram with pre-filled contact.',
    messenger: 'Opens Messenger with pre-filled contact.',
    custom: 'Enter any text or data format. Supports vCard, vEvent, and structured data.',
  };

  return (
    <div>
      {/* Type badge + reset */}
      <div className="flex items-center justify-between mb-5">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-sm font-semibold text-emerald-700 dark:text-emerald-300">
          <Info className="w-3.5 h-3.5" />
          {currentConfig.name}
        </div>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-xs font-medium"
          title={t('reset', language)}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {currentConfig.fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={(qrData as any)[field.name] || ''}
            onChange={(value: any) => handleFieldChange(field.name, value)}
            language={language}
            error={validationErrors.find(err => err.includes(field.label))}
          />
        ))}
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tip */}
      {tipText[currentType] && (
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
          {tipText[currentType]}
        </p>
      )}
    </div>
  );
};

export default QRForm;