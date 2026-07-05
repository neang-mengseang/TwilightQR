import { ExportFormat } from '../types';

// Lazy-load heavy html-to-image library only when necessary
let _htmlToImage: any = null;
const loadHtmlToImage = async () => {
  if (!_htmlToImage) {
    _htmlToImage = await import('html-to-image');
  }
  return _htmlToImage;
};

// Lazy-load jsPDF for PDF export
let _jsPDF: any = null;
const loadJsPDF = async () => {
  if (!_jsPDF) {
    const mod = await import('jspdf');
    _jsPDF = mod.jsPDF || mod.default;
  }
  return _jsPDF;
};

/**
 * Export utilities for QR codes
 * Supports PNG, SVG, JPEG, and WebP formats
 */

export interface ExportResult {
  success: boolean;
  error?: string;
  dataUrl?: string;
}

// Export QR code as different formats
export const exportQRCode = async (
  element: HTMLElement,
  format: ExportFormat,
  filename: string,
  options?: {
    quality?: number;
    scale?: number;
    backgroundColor?: string;
  }
): Promise<ExportResult> => {
  try {
    const { toPng, toSvg, toJpeg, toCanvas } = await loadHtmlToImage();
    // Find the actual QR code SVG element inside the container
    const svgElement = element.querySelector('svg') || element.querySelector('canvas') || element;
    
    let dataUrl: string;
    const exportOptions: any = {
      quality: options?.quality || 0.95,
      pixelRatio: options?.scale || 2,
      width: options?.scale ? options.scale * 256 : 512,
      height: options?.scale ? options.scale * 256 : 512,
    };

    // Only set backgroundColor if not transparent
    if (options?.backgroundColor !== 'transparent') {
      exportOptions.backgroundColor = options?.backgroundColor || '#ffffff';
    }

    switch (format) {
      case 'png':
        dataUrl = await toPng(svgElement as HTMLElement, exportOptions as any);
        break;
      case 'svg':
        dataUrl = await toSvg(svgElement as HTMLElement, exportOptions as any);
        break;
      case 'jpeg':
        exportOptions.backgroundColor = options?.backgroundColor === 'transparent' ? '#ffffff' : (options?.backgroundColor || '#ffffff');
        dataUrl = await toJpeg(svgElement as HTMLElement, exportOptions as any);
        break;
      case 'webp': {
        if (options?.backgroundColor === 'transparent') {
          delete exportOptions.backgroundColor;
          const pngDataUrl = await toPng(svgElement as HTMLElement, { ...exportOptions, backgroundColor: undefined } as any);
          const img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
            img.src = pngDataUrl;
          });
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = exportOptions.width || 512;
          tempCanvas.height = exportOptions.height || 512;
          const ctx = tempCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
            dataUrl = tempCanvas.toDataURL('image/webp', options?.quality || 0.95);
          } else {
            dataUrl = tempCanvas.toDataURL('image/webp', options?.quality || 0.95);
          }
        } else {
          const canvas = await toCanvas(svgElement as HTMLElement, exportOptions as any);
          dataUrl = canvas.toDataURL('image/webp', options?.quality || 0.95);
        }
        break;
      }
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    // Trigger download
    downloadDataUrl(dataUrl, filename);

    return { success: true, dataUrl };
  } catch (error) {
    console.error('Export error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Export failed' 
    };
  }
};

// Generate data URL (without downloading) for a given format and options
export const generateDataUrl = async (
  element: HTMLElement,
  format: ExportFormat,
  options?: {
    quality?: number;
    scale?: number;
    backgroundColor?: string;
  }
): Promise<ExportResult> => {
  try {
    const { toPng, toSvg, toJpeg, toCanvas } = await loadHtmlToImage();
    const exportOptions: any = {
      quality: options?.quality || 0.95,
      pixelRatio: options?.scale || 2,
    };
    if (options?.backgroundColor && options.backgroundColor !== 'transparent') {
      exportOptions.backgroundColor = options.backgroundColor;
    }

    let dataUrl: string;
    switch (format) {
      case 'png':
        dataUrl = await toPng(element, exportOptions);
        break;
      case 'svg':
        dataUrl = await toSvg(element, exportOptions);
        break;
      case 'jpeg':
        dataUrl = await toJpeg(element, exportOptions);
        break;
      case 'webp': {
        if (options?.backgroundColor === 'transparent') {
          const pngDataUrl = await toPng(element, { ...exportOptions, backgroundColor: undefined } as any);
          const img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
            img.src = pngDataUrl;
          });
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = exportOptions.pixelRatio ? 256 * exportOptions.pixelRatio : 512;
          tempCanvas.height = tempCanvas.width;
          const ctx = tempCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
            dataUrl = tempCanvas.toDataURL('image/webp', options?.quality || 0.95);
          } else {
            dataUrl = tempCanvas.toDataURL('image/webp', options?.quality || 0.95);
          }
        } else {
          const canvas = await toCanvas(element, exportOptions);
          dataUrl = canvas.toDataURL('image/webp', options?.quality || 0.95);
        }
        break;
      }
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    return { success: true, dataUrl };
  } catch (error) {
    console.error('Generate data url error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Generate failed' };
  }
};

// Download data URL as file
const downloadDataUrl = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Copy QR code to clipboard with multiple format options
export const copyQRToClipboard = async (
  element: HTMLElement,
  format: ExportFormat = 'png',
  options?: {
    scale?: number;
    backgroundColor?: string;
  }
): Promise<ExportResult> => {
  try {
    const { toPng, toSvg, toJpeg, toCanvas } = await loadHtmlToImage();
    // Find the actual QR code SVG element
    const svgElement = element.querySelector('svg') || element.querySelector('canvas') || element;
    
    const exportOptions: any = {
      pixelRatio: options?.scale || 2,
      width: options?.scale ? options.scale * 256 : 512,
      height: options?.scale ? options.scale * 256 : 512,
    };

    // Handle background color properly
    const isTransparent = options?.backgroundColor === 'transparent';
    if (!isTransparent) {
      exportOptions.backgroundColor = options?.backgroundColor || '#ffffff';
    }

    if (format === 'png') {
      // For PNG, copy as blob (supports transparency)
      const canvas = await toCanvas(svgElement as HTMLElement, exportOptions);
      
      return new Promise((resolve) => {
        canvas.toBlob(async (blob: Blob | null) => {
          if (!blob) {
            resolve({ success: false, error: 'Failed to create blob' });
            return;
          }

          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            resolve({ success: true });
          } catch (error) {
            // Fallback: copy data URL to text clipboard
            const dataUrl = canvas.toDataURL('image/png');
            await navigator.clipboard.writeText(dataUrl);
            resolve({ success: true, dataUrl });
          }
        }, 'image/png');
      });
    } else if (format === 'svg') {
      // For SVG, extract actual SVG code and copy as text
      const svgEl = svgElement as SVGElement;
      if (svgEl.tagName && svgEl.tagName.toLowerCase() === 'svg') {
        // Get the outer HTML of the SVG element
        const svgString = new XMLSerializer().serializeToString(svgEl);
        await navigator.clipboard.writeText(svgString);
        return { success: true, dataUrl: svgString };
      } else {
        // Fallback to data URL if not an SVG element
        const svgDataUrl = await toSvg(svgElement as unknown as HTMLElement, exportOptions);
        await navigator.clipboard.writeText(svgDataUrl);
        return { success: true, dataUrl: svgDataUrl };
      }
    } else if (format === 'jpeg') {
      // For JPEG, always use solid background (JPEG doesn't support transparency)
      exportOptions.backgroundColor = options?.backgroundColor === 'transparent' 
        ? '#ffffff' 
        : (options?.backgroundColor || '#ffffff');
      
      const dataUrl = await toJpeg(svgElement as HTMLElement, exportOptions);
      
      // Convert to blob and copy
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/jpeg': blob })
      ]);
      return { success: true, dataUrl };
    } else if (format === 'webp') {
      // For WebP, copy as blob (supports transparency)
      const canvas = await toCanvas(svgElement as HTMLElement, exportOptions);
      
      return new Promise((resolve) => {
        canvas.toBlob(async (blob: Blob | null) => {
          if (!blob) {
            resolve({ success: false, error: 'Failed to create blob' });
            return;
          }

          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/webp': blob })
            ]);
            resolve({ success: true });
          } catch (error) {
            // Fallback: copy data URL
            const dataUrl = canvas.toDataURL('image/webp', 0.95);
            await navigator.clipboard.writeText(dataUrl);
            resolve({ success: true, dataUrl });
          }
        }, 'image/webp', 0.95);
      });
    } else {
      // Default to PNG for other formats
      return copyQRToClipboard(element, 'png', options);
    }
  } catch (error) {
    console.error('Copy error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Copy failed' 
    };
  }
};

// Share QR code using Web Share API
export const shareQRCode = async (
  element: HTMLElement,
  title: string = 'QR Code',
  text: string = 'Check out this QR code!'
): Promise<ExportResult> => {
  try {
    if (!navigator.share || !navigator.canShare) {
      throw new Error('Web Share API not supported');
    }

    // Create blob from canvas
    const { toCanvas } = await loadHtmlToImage();
    const canvas = await toCanvas(element, { pixelRatio: 2 });
    
    return new Promise((resolve) => {
      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) {
          resolve({ success: false, error: 'Failed to create blob' });
          return;
        }

        const file = new File([blob], 'qr-code.png', { type: 'image/png' });
        const shareData = {
          title,
          text,
          files: [file]
        };

        if (navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
            resolve({ success: true });
          } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
              // User cancelled sharing
              resolve({ success: false, error: 'Share cancelled' });
            } else {
              resolve({ 
                success: false, 
                error: error instanceof Error ? error.message : 'Share failed' 
              });
            }
          }
        } else {
          resolve({ success: false, error: 'Cannot share files' });
        }
      }, 'image/png', 0.95);
    });
  } catch (error) {
    console.error('Share error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Share failed' 
    };
  }
};

// Generate filename based on QR content and timestamp
export const generateFilename = (
  qrType: string,
  content: string,
  format: ExportFormat
): string => {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const cleanContent = content.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_');
  return `qr-${qrType}-${cleanContent}-${timestamp}.${format}`;
};

// Get file size from data URL
export const getDataUrlSize = (dataUrl: string): number => {
  const base64Data = dataUrl.split(',')[1];
  const decodedData = atob(base64Data);
  return decodedData.length;
};

// Format file size in human readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Check if Web Share API is supported
export const isWebShareSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

// Check if Clipboard API is supported
export const isClipboardSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'clipboard' in navigator;
};

// Export QR code as a print-ready PDF with bleed margins and high-resolution raster
export const exportQRCodePDF = async (
  element: HTMLElement,
  filename: string,
  options?: {
    size?: number;
    backgroundColor?: string;
    bleed?: number;
  }
): Promise<ExportResult> => {
  try {
    const { toPng } = await loadHtmlToImage();
    const jsPDF = await loadJsPDF();

    const svgElement = element.querySelector('svg') || element.querySelector('canvas') || element;
    const exportSize = options?.size || 1024;
    const bleed = options?.bleed ?? 3;
    const bg = options?.backgroundColor === 'transparent' ? '#ffffff' : (options?.backgroundColor || '#ffffff');

    const dataUrl = await toPng(svgElement as HTMLElement, {
      pixelRatio: exportSize / 256,
      width: exportSize,
      height: exportSize,
      backgroundColor: bg,
      quality: 0.95,
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const qrSizeMm = 80;
    const x = (pageWidth - qrSizeMm) / 2;
    const y = (pageHeight - qrSizeMm) / 2 - 10;

    if (bleed > 0) {
      pdf.setFillColor(255, 255, 255);
      pdf.rect(x - bleed, y - bleed, qrSizeMm + bleed * 2, qrSizeMm + bleed * 2, 'F');
    }

    pdf.addImage(dataUrl, 'PNG', x, y, qrSizeMm, qrSizeMm, undefined, 'FAST');

    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Scan this QR code', pageWidth / 2, y + qrSizeMm + 12, { align: 'center' });

    pdf.setFontSize(9);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Generated with QR Magic', pageWidth / 2, pageHeight - 15, { align: 'center' });

    pdf.save(filename);
    return { success: true };
  } catch (error) {
    console.error('PDF export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'PDF export failed'
    };
  }
};