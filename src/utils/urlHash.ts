import { QRType, QRData } from '../types';

/**
 * URL Hash utilities for sharing QR codes via direct links
 * Format: #qr-type=text&content=Hello%20World&email=test@example.com
 */

// Encode QR data to URL hash
export const encodeQRToHash = (qrData: QRData): string => {
  const params = new URLSearchParams();
  
  // Add QR type
  params.set('qr-type', qrData.type);
  
  // Add all QR data fields (except type)
  Object.entries(qrData).forEach(([key, value]) => {
    if (key !== 'type' && value !== undefined && value !== '') {
      if (typeof value === 'object') {
        // Handle nested objects (like address in contact)
        params.set(key, JSON.stringify(value));
      } else {
        params.set(key, String(value));
      }
    }
  });
  
  return params.toString();
};

// Decode URL hash to QR data
export const decodeHashToQR = (hash: string): { type: QRType; data: Partial<QRData> } | null => {
  try {
    // Remove # from hash if present
    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
    
    if (!cleanHash) return null;
    
    const params = new URLSearchParams(cleanHash);
    const qrType = params.get('qr-type') as QRType;
    
    if (!qrType) return null;
    
    const data: Partial<QRData> = { type: qrType };
    
    // Parse all parameters
    params.forEach((value, key) => {
      if (key !== 'qr-type') {
        try {
          // Try to parse as JSON first (for nested objects)
          (data as any)[key] = JSON.parse(value);
        } catch {
          // If not JSON, use as string
          (data as any)[key] = value;
        }
      }
    });
    
    return { type: qrType, data };
  } catch (error) {
    console.warn('Failed to decode hash:', error);
    return null;
  }
};

// Update browser URL hash without triggering navigation
export const updateUrlHash = (qrData: QRData) => {
  const hash = encodeQRToHash(qrData);
  const newUrl = `${window.location.pathname}${window.location.search}#${hash}`;
  window.history.replaceState(null, '', newUrl);
};

// Get current URL hash
export const getCurrentHash = (): string => {
  return window.location.hash;
};

// Create a shareable URL for a QR code
export const createShareableUrl = (qrData: QRData): string => {
  const hash = encodeQRToHash(qrData);
  return `${window.location.origin}${window.location.pathname}#${hash}`;
};

// Example URLs this will generate:
// #qr-type=text&text=Hello%20World
// #qr-type=url&url=https%3A//example.com
// #qr-type=email&email=test%40example.com&subject=Hello&body=Message
// #qr-type=wifi&ssid=MyWiFi&password=secret123&security=WPA
// #qr-type=contact&firstName=John&lastName=Doe&phone=%2B1234567890&email=john%40example.com