import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Copy, Share2, Eye, Sparkles, Link } from 'lucide-react';
import { QRData, QRCodeOptions, Language, ExportFormat } from '../types';
import { generateQRString, validateQRData } from '../utils/qrGenerators';
import { exportQRCode, copyQRToClipboard, shareQRCode, generateFilename } from '../utils/export';
import { createShareableUrl } from '../utils/urlHash';
import { t } from '../utils/i18n';
import { DownloadDropdown, CopyDropdown, ModernButton } from './ModernUI';

interface QRPreviewProps {
  qrData: QRData;
  qrOptions: QRCodeOptions;
  language: Language;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const QRPreview: React.FC<QRPreviewProps> = ({
  qrData,
  qrOptions,
  language,
  onToast
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [qrCode, setQRCode] = useState<QRCodeStyling | null>(null);
  const [qrString, setQRString] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Memoize QR data string to prevent unnecessary regeneration
  const qrDataString = useMemo(() => {
    const validation = validateQRData(qrData);
    if (!validation.isValid) return '';
    return generateQRString(qrData);
  }, [qrData]);

  // Initialize QR Code instance
  useEffect(() => {
    if (qrCode) return;
    const instance = new QRCodeStyling({
      width: qrOptions.size,
      height: qrOptions.size,
      type: 'svg',
      data: '',
      margin: qrOptions.margin,
      qrOptions: {
        typeNumber: 0,
        mode: 'Byte',
        errorCorrectionLevel: qrOptions.errorCorrectionLevel
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 0,
        crossOrigin: 'anonymous'
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

  // Auto-update QR code when data or options change
  useEffect(() => {
    if (!qrCode) return;
    
    // Clear QR if no valid data
    if (!qrDataString) {
      if (qrRef.current) {
        qrRef.current.innerHTML = '';
      }
      setQRString('');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Use a smaller display size for better container fitting
      const displaySize = Math.min(qrOptions.size, 280);
      
      qrCode.update({
        width: displaySize,
        height: displaySize,
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
        image: qrOptions.logoUrl,
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: 0.4,
          margin: 0,
          crossOrigin: 'anonymous'
        }
      });

      if (qrRef.current) {
        qrRef.current.innerHTML = '';
        qrCode.append(qrRef.current);
      }
      
      setQRString(qrDataString);
    } catch (e) {
      console.error('QR generation error:', e);
      onToast('Error generating QR code', 'error');
    } finally {
      setIsGenerating(false);
    }
  }, [qrCode, qrDataString, qrOptions, onToast]);

  // Export handlers
  const handleDownload = async (format: ExportFormat, size: number, transparent?: boolean) => {
    if (!qrRef.current) return;
    
    const filename = generateFilename(qrData.type, qrString, format);
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
          imageSize: 0.4,
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
          imageSize: 0.4,
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

  const validation = validateQRData(qrData);
  const hasValidData = validation.isValid && qrDataString;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t('preview', language)}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Live QR code preview
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isGenerating && (
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">Generating...</span>
            </div>
          )}
          {hasValidData && !isGenerating && (
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Ready</span>
            </div>
          )}
        </div>
      </div>

      {/* QR Code Display */}
      <div className="mb-4 lg:mb-6">
        {(isGenerating || hasValidData) && (
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-4 sm:space-y-6">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200 border-t-blue-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">
                    Creating your QR code
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This will just take a moment...
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <div className="relative group w-full max-w-[280px] sm:max-w-xs md:max-w-sm aspect-square flex items-center justify-center">
                  <div 
                    ref={qrRef} 
                    className="transition-all duration-300 group-hover:scale-105"
                    style={{ 
                      width: '100%',
                      height: '100%',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                  />
                  {qrOptions.transparentBackground && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded-lg font-medium">
                      Transparent
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
        <DownloadDropdown
          onDownload={handleDownload}
          disabled={!hasValidData}
        />

        <CopyDropdown
          onCopy={handleCopy}
          disabled={!hasValidData}
        />

        <ModernButton
          variant="outline"
          onClick={handleShare}
          disabled={!hasValidData}
        >
          <Share2 className="w-4 h-4 mr-2" />
          {t('share', language)}
        </ModernButton>

        <ModernButton
          variant="secondary"
          onClick={handleShareUrl}
          disabled={!hasValidData}
        >
          <Link className="w-4 h-4 mr-2" />
          {t('shareUrl', language)}
        </ModernButton>
      </div>

      {/* QR Data Display */}
      {hasValidData && (
        <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              QR Code Data
            </h4>
          </div>
          <div className="text-xs text-gray-700 dark:text-gray-300 font-mono break-all bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-600 max-h-32 overflow-y-auto shadow-inner">
            {qrString}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRPreview;