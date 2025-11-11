import { toPng, toSvg, toJpeg, toCanvas } from 'html-to-image';
import { ExportFormat } from '../types';

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
        const canvas = await toCanvas(svgElement as HTMLElement, exportOptions as any);
        dataUrl = canvas.toDataURL('image/webp', options?.quality || 0.95);
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
        const canvas = await toCanvas(element, exportOptions);
        dataUrl = canvas.toDataURL('image/webp', options?.quality || 0.95);
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