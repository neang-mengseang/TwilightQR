import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Download, Share2, Eye, Sparkles, Link, AlertTriangle, CheckCircle, Frame, QrCode } from 'lucide-react';
import { QRData, QRCodeOptions, Language, ExportFormat } from '../types';
import { generateQRString, validateQRData } from '../utils/qrGenerators';
import { exportQRCode, copyQRToClipboard, shareQRCode, generateFilename, exportQRCodePDF } from '../utils/export';
import { createShareableUrl } from '../utils/urlHash';
import { calculateScanScore } from '../utils/scannability';
import { frameTemplates } from '../utils/frameTemplates';
import { t } from '../utils/i18n';
import { ExportModal, ShareModal } from './QRModals';
import { ModernButton } from './ModernUI';

interface QRPreviewProps {
  qrData: QRData;
  qrOptions: QRCodeOptions;
  language: Language;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onSaveToHistory?: () => void;
  onUndo?: () => void;
}

const QRPreview: React.FC<QRPreviewProps> = ({
  qrData,
  qrOptions,
  language,
  onToast,
  onSaveToHistory,
  onUndo
}) => {
  const qrRef = useRef<HTMLDivElement | null>(null);
  const [qrCode, setQRCode] = useState<QRCodeStyling | null>(null);
  const [qrString, setQRString] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFrameId, setSelectedFrameId] = useState('none');

  const setQrRef = useCallback((node: HTMLDivElement | null) => {
    qrRef.current = node;
  }, []);

  // Modal states
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (exportModalOpen || shareModalOpen) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setExportModalOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !e.shiftKey) {
        e.preventDefault();
        setExportModalOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        onUndo?.();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [exportModalOpen, shareModalOpen, onUndo]);

  // Memoize QR data string to prevent unnecessary regeneration
  const qrDataString = useMemo(() => {
    const validation = validateQRData(qrData);
    if (!validation.isValid) return '';
    return generateQRString(qrData) || '';
  }, [qrData]);

  // Scannability score
  const scanScore = useMemo(() => {
    return calculateScanScore(qrOptions, qrDataString?.length ?? 0);
  }, [qrOptions, qrDataString]);

  const selectedFrame = frameTemplates.find(f => f.id === selectedFrameId) || frameTemplates[0];

  // Initialize QR Code instance
  useEffect(() => {
    if (qrCode) return;
    const instance = new QRCodeStyling({
      width: 400, // Larger base size for better quality
      height: 400,
      type: 'svg',
      data: '',
      margin: qrOptions.margin,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: qrOptions.errorCorrectionLevel
      },
      dotsOptions: {
        color: qrOptions.foregroundColor,
        type: 'rounded'
      },
      backgroundOptions: {
        color: qrOptions.transparentBackground ? 'transparent' : qrOptions.backgroundColor
      },
      cornersSquareOptions: {
        color: qrOptions.foregroundColor,
        type: 'extra-rounded'
      },
      cornersDotOptions: {
        color: qrOptions.foregroundColor,
        type: 'dot'
      }
    });
    setQRCode(instance);
  }, []);

  // Update QR data/options and re-append to DOM
  useEffect(() => {
    if (!qrCode || !qrDataString) return;

    try {
      const updateOpts: Record<string, unknown> = {
        width: 400,
        height: 400,
        data: qrDataString,
        margin: qrOptions.margin,
        qrOptions: { errorCorrectionLevel: qrOptions.errorCorrectionLevel },
        dotsOptions: {
          color: qrOptions.foregroundColor,
          type: qrOptions.dotsType || 'rounded'
        },
        backgroundOptions: {
          color: qrOptions.transparentBackground ? 'transparent' : qrOptions.backgroundColor
        },
        cornersSquareOptions: {
          color: qrOptions.foregroundColor,
          type: qrOptions.cornerSquareType || 'extra-rounded'
        },
        cornersDotOptions: {
          color: qrOptions.foregroundColor,
          type: qrOptions.cornerDotType || 'dot'
        },
      };

      if (qrOptions.logoUrl) {
        updateOpts.image = qrOptions.logoUrl;
        updateOpts.imageOptions = {
          hideBackgroundDots: true,
          imageSize: qrOptions.logoSize || 0.4,
          margin: 0,
          crossOrigin: 'anonymous'
        };
      }

      qrCode.update(updateOpts);
      setQRString(qrDataString);

      requestAnimationFrame(() => {
        if (!qrRef.current) return;
        qrRef.current.innerHTML = '';
        qrCode.append(qrRef.current);
        const svg = qrRef.current.querySelector('svg');
        if (svg) {
          svg.style.width = '100%';
          svg.style.height = '100%';
          svg.style.maxWidth = '100%';
          svg.style.maxHeight = '100%';
          svg.style.objectFit = 'contain';
          svg.style.display = 'block';
        }
      });
    } catch (e) {
      console.error('QR generation error:', e);
    }
  }, [qrCode, qrDataString, qrOptions, selectedFrameId]);

  // Export handlers
  const handleDownload = async (format: ExportFormat, size: number, transparent?: boolean) => {
    if (!qrRef.current) return;

    const filename = generateFilename(qrData.type, qrString, format);

    if (format === 'pdf') {
      const pdfFilename = filename.replace(/\.\w+$/, '.pdf');
      const result = await exportQRCodePDF(qrRef.current, pdfFilename, {
        size: 1024,
        backgroundColor: transparent ? 'transparent' : qrOptions.backgroundColor,
        bleed: 3,
      });
      if (result.success) {
        onToast('PDF downloaded (print-ready)', 'success');
        onSaveToHistory?.();
      } else {
        onToast(result.error || 'PDF export failed', 'error');
      }
      return;
    }
    // Use the explicit transparent parameter if provided, otherwise use the qrOptions setting
    const useTransparent = transparent !== undefined ? transparent : qrOptions.transparentBackground;
    const backgroundColor = useTransparent ? 'transparent' : qrOptions.backgroundColor;
    const exportSize = size;
    
    // Create a temporary container with the desired size for export
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    document.body.appendChild(tempContainer);

    try {
      // Create QR code at the desired export size
      const tempQR = new QRCodeStyling({
        width: exportSize,
        height: exportSize,
        type: 'svg',
        data: qrString,
        margin: qrOptions.margin,
        qrOptions: { errorCorrectionLevel: qrOptions.errorCorrectionLevel },
        dotsOptions: { 
          color: qrOptions.foregroundColor, 
          type: qrOptions.dotsType || 'rounded' 
        },
        backgroundOptions: { 
          color: useTransparent ? 'transparent' : qrOptions.backgroundColor 
        },
        cornersSquareOptions: { 
          color: qrOptions.foregroundColor, 
          type: qrOptions.cornerSquareType || 'extra-rounded' 
        },
        cornersDotOptions: { 
          color: qrOptions.foregroundColor, 
          type: qrOptions.cornerDotType || 'dot' 
        },
        image: qrOptions.logoUrl,
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: qrOptions.logoSize || 0.4,
          margin: 0,
          crossOrigin: 'anonymous'
        }
      });

      tempQR.append(tempContainer);
      
      // Export the temporary QR code
      const result = await exportQRCode(tempContainer, format, filename, {
        scale: 1, // Use scale 1 since we're already at desired size
        backgroundColor,
        quality: format === 'jpeg' ? 0.9 : 0.95
      });

      if (result.success) {
        onToast(`${format.toUpperCase()} downloaded (${exportSize}px)`, 'success');
        onSaveToHistory?.();
      } else {
        onToast(result.error || 'Download failed', 'error');
      }
    } catch (error) {
      console.error('Export error:', error);
      onToast('Download failed', 'error');
    } finally {
      // Clean up
      document.body.removeChild(tempContainer);
    }
  };

  const handleCopy = async (format: ExportFormat, size: number, transparent?: boolean) => {
    if (!qrRef.current) return;

    // Use the explicit transparent parameter if provided, otherwise use the qrOptions setting
    const useTransparent = transparent !== undefined ? transparent : qrOptions.transparentBackground;
    const backgroundColor = useTransparent ? 'transparent' : qrOptions.backgroundColor;
    
    // Create a temporary container with the desired settings for copy
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    document.body.appendChild(tempContainer);

    try {
      // Create QR code at the desired copy size with proper transparency
      const tempQR = new QRCodeStyling({
        width: size,
        height: size,
        type: 'svg',
        data: qrString,
        margin: qrOptions.margin,
        qrOptions: { errorCorrectionLevel: qrOptions.errorCorrectionLevel },
        dotsOptions: { 
          color: qrOptions.foregroundColor, 
          type: qrOptions.dotsType || 'rounded' 
        },
        backgroundOptions: { 
          color: useTransparent ? 'transparent' : qrOptions.backgroundColor 
        },
        cornersSquareOptions: { 
          color: qrOptions.foregroundColor, 
          type: qrOptions.cornerSquareType || 'extra-rounded' 
        },
        cornersDotOptions: { 
          color: qrOptions.foregroundColor, 
          type: qrOptions.cornerDotType || 'dot' 
        },
        image: qrOptions.logoUrl,
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: qrOptions.logoSize || 0.4,
          margin: 0,
          crossOrigin: 'anonymous'
        }
      });

      tempQR.append(tempContainer);
      
      // Small delay to ensure QR is rendered
      await new Promise(resolve => setTimeout(resolve, 100));

      const result = await copyQRToClipboard(tempContainer, format, {
        scale: 1, // Use scale 1 since we're already at desired size
        backgroundColor
      });

      if (result.success) {
        onToast(`${format.toUpperCase()} copied to clipboard (${size}px)`, 'success');
      } else {
        onToast(result.error || 'Copy failed', 'error');
      }
    } catch (error) {
      console.error('Copy error:', error);
      onToast('Copy failed', 'error');
    } finally {
      // Clean up
      document.body.removeChild(tempContainer);
    }
  };

  const handleShare = async () => {
    if (!qrRef.current) return;

    const result = await shareQRCode(
      qrRef.current,
      `QR Code - ${qrData.type}`,
      'Check out this QR code created with QR Magic!'
    );

    if (result.success) {
      onToast('QR code shared successfully', 'success');
    } else if (result.error !== 'Share cancelled') {
      onToast(result.error || 'Share failed', 'error');
    }
  };

  const handleShareUrl = async () => {
    const shareableUrl = createShareableUrl(qrData);
    
    try {
      await navigator.clipboard.writeText(shareableUrl);
      onToast('QR URL copied to clipboard', 'success');
    } catch {
      // Fallback: show the URL in a prompt
      prompt('Copy this URL to share your QR code:', shareableUrl);
    }
  };

  // Modal handlers
  const handleModalCopy = async (type: 'image' | 'data' | 'url', format?: ExportFormat, size?: number, transparent?: boolean) => {
    switch (type) {
      case 'image':
        await handleCopy(format || 'png', size || 512, transparent);
        break;
      case 'data':
        try {
          await navigator.clipboard.writeText(qrString);
          onToast('QR data copied to clipboard', 'success');
        } catch {
          onToast('Failed to copy QR data', 'error');
        }
        break;
      case 'url':
        await handleShareUrl();
        break;
    }
  };

  const handleModalShare = async (platform: string) => {
    const shareableUrl = createShareableUrl(qrData);
    const shareText = `Check out this QR code: ${shareableUrl}`;

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      instagram: shareableUrl, // Instagram doesn't support direct URL sharing
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareableUrl)}&text=${encodeURIComponent('Check out this QR code')}`,
      email: `mailto:?subject=Check out this QR code&body=${encodeURIComponent(shareText)}`,
    };

    if (platform === 'native') {
      await handleShare();
    } else if (shareUrls[platform]) {
      if (platform === 'instagram') {
        onToast('Instagram link copied - paste it in your Instagram post', 'info');
        try {
          await navigator.clipboard.writeText(shareableUrl);
        } catch {
          // Fallback handled
        }
      } else {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      }
    }
  };

  const validation = validateQRData(qrData);
  const hasValidData = validation.isValid && qrDataString;

  return (
    <div className="p-4 lg:p-6 h-full flex flex-col bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl shadow-md">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Live Preview</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Real-time QR code preview</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isGenerating && (
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-xs font-medium">Generating...</span>
            </div>
          )}
          {hasValidData && !isGenerating && (
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Display */}
      <div className="mb-4 flex-1 flex flex-col">
          <div
            className="relative rounded-xl p-4 border border-gray-200 dark:border-gray-700 flex-1 flex items-center justify-center min-h-[280px] transition-colors"
            style={{ background: qrOptions.transparentBackground ? 'transparent' : qrOptions.backgroundColor }}
          >
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-100 border-t-emerald-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Creating your QR code</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Just a moment...</p>
                </div>
              </div>
            ) : !hasValidData ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3 text-center">
                <QrCode className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                <p className="text-sm font-medium text-gray-400 dark:text-gray-500">Enter content to see preview</p>
                <p className="text-xs text-gray-400 dark:text-gray-600">Fill in the form on the left</p>
              </div>
            ) : selectedFrame.showFrame ? (
              /* Card View with Frame */
              <div
                className="flex flex-col items-center animate-scale-in"
                style={{
                  backgroundColor: selectedFrame.bgColor,
                  border: `${selectedFrame.borderWidth} solid ${selectedFrame.borderColor}`,
                  borderRadius: selectedFrame.borderRadius,
                  padding: selectedFrame.padding,
                  boxShadow: selectedFrame.shadow,
                }}
              >
                <div
                  ref={setQrRef}
                  className="w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center rounded-xl overflow-hidden"
                  style={{ background: qrOptions.transparentBackground ? 'transparent' : qrOptions.backgroundColor }}
                />
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <p className="text-base font-bold tracking-tight" style={{ color: selectedFrame.textColor }}>
                      {selectedFrame.label}
                    </p>
                    {selectedFrame.showArrow && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={selectedFrame.textColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.9 }}>
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    )}
                  </div>
                  {selectedFrame.sublabel && (
                    <p className="text-xs mt-0.5 opacity-70" style={{ color: selectedFrame.textColor }}>
                      {selectedFrame.sublabel}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Plain Card View */
              <div className="relative group w-full h-full flex items-center justify-center">
                <div
                  ref={setQrRef}
                  className="qr-draw-in transition-all duration-300 group-hover:scale-105 w-full h-full flex items-center justify-center rounded-xl"
                  style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', background: qrOptions.transparentBackground ? 'transparent' : qrOptions.backgroundColor }}
                />
              </div>
            )}
          </div>
      </div>

      {/* Scannability Score */}
      {hasValidData && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              {scanScore.score >= 70 ? (
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              )}
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Scannability</span>
            </div>
            <span className="text-xs font-bold" style={{ color: scanScore.color }}>
              {scanScore.score}/100 · {scanScore.label}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
            <div
              className="score-bar h-full rounded-full"
              style={{ width: `${scanScore.score}%`, backgroundColor: scanScore.color }}
            />
          </div>
          {scanScore.issues.length > 0 && (
            <div className="mt-2 space-y-1">
              {scanScore.issues.map((issue, i) => (
                <div key={i} className="flex items-start space-x-1.5 text-xs">
                  <span className={issue.level === 'error' ? 'text-red-500' : 'text-amber-500'}>•</span>
                  <span className="text-gray-600 dark:text-gray-400">{issue.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Frame Template Selector */}
      {hasValidData && (
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Frame className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Frame</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {frameTemplates.map((frame) => (
              <button
                key={frame.id}
                onClick={() => setSelectedFrameId(frame.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedFrameId === frame.id
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                title={frame.description}
              >
                {frame.showFrame && (
                  <span
                    className="w-3 h-3 rounded-sm border"
                    style={{ backgroundColor: frame.bgColor, borderColor: frame.borderColor }}
                  />
                )}
                {frame.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-2">
        <ModernButton
          variant="primary"
          onClick={() => setExportModalOpen(true)}
          disabled={!hasValidData}
          className="flex-1 sm:flex-none"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </ModernButton>

        <ModernButton
          variant="secondary"
          onClick={() => setShareModalOpen(true)}
          disabled={!hasValidData}
          className="flex-1 sm:flex-none"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </ModernButton>
      </div>

      {/* Shortcut hints */}
      <div className="hidden lg:flex items-center gap-3 text-[11px] text-gray-400 dark:text-gray-500 mb-6">
        <span><kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded font-mono">Ctrl+S</kbd> Export</span>
        {onUndo && <span><kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded font-mono">Ctrl+Z</kbd> Undo</span>}
      </div>

      {/* QR Data Display */}
      {hasValidData && (
          <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              QR Code Data
            </h4>
          </div>
          <div className="text-xs text-gray-700 dark:text-gray-300 font-mono break-all bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-600 max-h-32 overflow-y-auto shadow-inner">
            {qrString}
          </div>
        </div>
      )}

      {/* Modals */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onDownload={handleDownload}
        onCopy={handleModalCopy}
        defaultTransparent={qrOptions.transparentBackground}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        onShare={handleModalShare}
        qrData={qrData}
      />
    </div>
  );
};

export default QRPreview;