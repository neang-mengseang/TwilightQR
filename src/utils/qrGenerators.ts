import {
  QRData,
  TextQRData,
  URLQRData,
  EmailQRData,
  PhoneQRData,
  SMSQRData,
  WiFiQRData,
  LocationQRData,
  EventQRData,
  ContactQRData,
  SocialQRData,
  CustomQRData,
} from '../types';

/**
 * Generates QR code data string based on the QR type and input data
 * Each QR type has its specific format and encoding requirements
 */

export const generateQRString = (data: QRData): string => {
  switch (data.type) {
    case 'text':
      return generateTextQR(data);
    case 'url':
      return generateURLQR(data);
    case 'email':
      return generateEmailQR(data);
    case 'phone':
      return generatePhoneQR(data);
    case 'sms':
      return generateSMSQR(data);
    case 'wifi':
      return generateWiFiQR(data);
    case 'location':
      return generateLocationQR(data);
    case 'event':
      return generateEventQR(data);
    case 'contact':
      return generateContactQR(data);
    case 'whatsapp':
    case 'telegram':
    case 'messenger':
      return generateSocialQR(data);
    case 'custom':
      return generateCustomQR(data);
    default:
      return '';
  }
};

// Text QR - Simple plain text
const generateTextQR = (data: TextQRData): string => {
  return data.text || '';
};

// URL QR - Website links
const generateURLQR = (data: URLQRData): string => {
  let url = data.url || '';
  
  // Add protocol if missing
  if (url && !url.match(/^https?:\/\//)) {
    url = 'https://' + url;
  }
  
  return url;
};

// Email QR - Email addresses with optional subject and body
const generateEmailQR = (data: EmailQRData): string => {
  let emailString = `mailto:${data.email || ''}`;
  
  const params: string[] = [];
  if (data.subject) {
    params.push(`subject=${encodeURIComponent(data.subject)}`);
  }
  if (data.body) {
    params.push(`body=${encodeURIComponent(data.body)}`);
  }
  
  if (params.length > 0) {
    emailString += '?' + params.join('&');
  }
  
  return emailString;
};

// Phone QR - Phone numbers
const generatePhoneQR = (data: PhoneQRData): string => {
  return `tel:${data.phone || ''}`;
};

// SMS QR - SMS messages with optional pre-filled text
const generateSMSQR = (data: SMSQRData): string => {
  let smsString = `SMSTO:${data.phone || ''}`;
  
  if (data.message) {
    smsString += `:${data.message}`;
  }
  
  return smsString;
};

// WiFi QR - Network configuration
const generateWiFiQR = (data: WiFiQRData): string => {
  const security = data.security || 'WPA';
  const ssid = data.ssid || '';
  const password = data.password || '';
  const hidden = data.hidden ? 'true' : 'false';
  
  // WiFi QR format: WIFI:T:WPA;S:mynetwork;P:mypass;H:false;;
  return `WIFI:T:${security};S:${escapeWiFiValue(ssid)};P:${escapeWiFiValue(password)};H:${hidden};;`;
};

// Helper function to escape special characters in WiFi values
const escapeWiFiValue = (value: string): string => {
  return value.replace(/([\\";,:])/g, '\\$1');
};

// Location/Geo QR - Geographic coordinates
const generateLocationQR = (data: LocationQRData): string => {
  const lat = data.latitude || 0;
  const lng = data.longitude || 0;
  let geoString = `geo:${lat},${lng}`;
  
  if (data.query) {
    geoString += `?q=${encodeURIComponent(data.query)}`;
  }
  
  return geoString;
};

// Event QR - Calendar events in vEvent format
const generateEventQR = (data: EventQRData): string => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  let vEvent = 'BEGIN:VCALENDAR\n';
  vEvent += 'VERSION:2.0\n';
  vEvent += 'PRODID:-//QR Magic//QR Magic 1.0//EN\n';
  vEvent += 'BEGIN:VEVENT\n';
  vEvent += `SUMMARY:${data.title || 'Untitled Event'}\n`;
  
  if (data.description) {
    vEvent += `DESCRIPTION:${data.description}\n`;
  }
  
  if (data.location) {
    vEvent += `LOCATION:${data.location}\n`;
  }
  
  if (data.startDate) {
    vEvent += `DTSTART:${formatDate(data.startDate)}\n`;
  }
  
  if (data.endDate) {
    vEvent += `DTEND:${formatDate(data.endDate)}\n`;
  }
  
  // Generate a unique ID for the event
  const uid = `${Date.now()}@qrmagic.app`;
  vEvent += `UID:${uid}\n`;
  vEvent += `DTSTAMP:${formatDate(new Date().toISOString())}\n`;
  vEvent += 'END:VEVENT\n';
  vEvent += 'END:VCALENDAR';
  
  return vEvent;
};

// Contact QR - vCard format
const generateContactQR = (data: ContactQRData): string => {
  let vCard = 'BEGIN:VCARD\n';
  vCard += 'VERSION:3.0\n';
  
  // Full name
  const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
  if (fullName) {
    vCard += `FN:${fullName}\n`;
    vCard += `N:${data.lastName || ''};${data.firstName || ''};;;\n`;
  }
  
  // Organization
  if (data.organization) {
    vCard += `ORG:${data.organization}\n`;
  }
  
  // Phone
  if (data.phone) {
    vCard += `TEL:${data.phone}\n`;
  }
  
  // Email
  if (data.email) {
    vCard += `EMAIL:${data.email}\n`;
  }
  
  // URL
  if (data.url) {
    vCard += `URL:${data.url}\n`;
  }
  
  // Address
  if (data.address) {
    const addr = data.address;
    const addressLine = [
      addr.street || '',
      addr.city || '',
      addr.state || '',
      addr.postalCode || '',
      addr.country || ''
    ].filter(Boolean).join(';');
    
    if (addressLine) {
      vCard += `ADR:;;${addressLine}\n`;
    }
  }
  
  vCard += 'END:VCARD';
  
  return vCard;
};

// Social Media QR - WhatsApp, Telegram, Messenger
const generateSocialQR = (data: SocialQRData): string => {
  const identifier = data.identifier || '';
  const message = data.message || '';
  
  switch (data.type) {
    case 'whatsapp':
      // WhatsApp format: https://wa.me/phonenumber?text=message
      let whatsappUrl = `https://wa.me/${identifier.replace(/[^\d]/g, '')}`;
      if (message) {
        whatsappUrl += `?text=${encodeURIComponent(message)}`;
      }
      return whatsappUrl;
      
    case 'telegram':
      // Telegram format: https://t.me/username or tg://resolve?domain=username
      if (identifier.startsWith('@')) {
        return `https://t.me/${identifier.substring(1)}`;
      }
      return `https://t.me/${identifier}`;
      
    case 'messenger':
      // Messenger format: https://m.me/username
      return `https://m.me/${identifier}`;
      
    default:
      return '';
  }
};

// Custom QR - User-provided raw data
const generateCustomQR = (data: CustomQRData): string => {
  return data.data || '';
};

// Validation functions for different QR types
export const validateQRData = (data: QRData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  switch (data.type) {
    case 'text':
      if (!data.text?.trim()) {
        errors.push('Text content is required');
      }
      break;
      
    case 'url':
      if (!data.url?.trim()) {
        errors.push('URL is required');
      } else if (!isValidURL(data.url)) {
        errors.push('Please enter a valid URL');
      }
      break;
      
    case 'email':
      if (!data.email?.trim()) {
        errors.push('Email address is required');
      } else if (!isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
      }
      break;
      
    case 'phone':
      if (!data.phone?.trim()) {
        errors.push('Phone number is required');
      } else if (!isValidPhone(data.phone)) {
        errors.push('Please enter a valid phone number');
      }
      break;
      
    case 'sms':
      if (!data.phone?.trim()) {
        errors.push('Phone number is required');
      } else if (!isValidPhone(data.phone)) {
        errors.push('Please enter a valid phone number');
      }
      break;
      
    case 'wifi':
      if (!data.ssid?.trim()) {
        errors.push('Network name (SSID) is required');
      }
      if (data.security !== 'nopass' && !data.password?.trim()) {
        errors.push('Password is required for secured networks');
      }
      break;
      
    case 'location':
      if (data.latitude === undefined || data.longitude === undefined) {
        errors.push('Latitude and longitude are required');
      } else if (!isValidLatitude(data.latitude) || !isValidLongitude(data.longitude)) {
        errors.push('Please enter valid coordinates');
      }
      break;
      
    case 'event':
      if (!data.title?.trim()) {
        errors.push('Event title is required');
      }
      if (!data.startDate) {
        errors.push('Start date is required');
      }
      if (!data.endDate) {
        errors.push('End date is required');
      }
      if (data.startDate && data.endDate && new Date(data.startDate) >= new Date(data.endDate)) {
        errors.push('End date must be after start date');
      }
      break;
      
    case 'contact':
      if (!data.firstName?.trim()) {
        errors.push('First name is required');
      }
      if (data.email && !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
      }
      if (data.phone && !isValidPhone(data.phone)) {
        errors.push('Please enter a valid phone number');
      }
      if (data.url && !isValidURL(data.url)) {
        errors.push('Please enter a valid website URL');
      }
      break;
      
    case 'whatsapp':
    case 'messenger':
    case 'telegram':
      if (!data.identifier?.trim()) {
        errors.push('Phone number or username is required');
      }
      break;
      
    case 'custom':
      if (!data.data?.trim()) {
        errors.push('Custom data is required');
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper validation functions
const isValidURL = (url: string): boolean => {
  try {
    // Add protocol if missing for validation
    const testUrl = url.match(/^https?:\/\//) ? url : 'https://' + url;
    new URL(testUrl);
    return true;
  } catch {
    return false;
  }
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,15}$/;
  return phoneRegex.test(phone);
};

const isValidLatitude = (lat: number): boolean => {
  return lat >= -90 && lat <= 90;
};

const isValidLongitude = (lng: number): boolean => {
  return lng >= -180 && lng <= 180;
};