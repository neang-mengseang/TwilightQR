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
  SocialProfileQRData,
  CommunicationQRData,
  EntertainmentQRData,
  PaymentQRData,
  CryptoQRData,
  AppStoreQRData,
  ReviewQRData,
  CouponQRData,
  DocumentQRData,
  BusinessCardQRData,
  MenuQRData,
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
    case 'instagram':
    case 'twitter':
    case 'tiktok':
    case 'youtube':
    case 'linkedin':
    case 'facebook':
    case 'snapchat':
      return generateSocialProfileQR(data);
    case 'discord':
    case 'skype':
    case 'zoom':
      return generateCommunicationQR(data);
    case 'spotify':
      return generateEntertainmentQR(data);
    case 'paypal':
    case 'venmo':
      return generatePaymentQR(data);
    case 'bitcoin':
    case 'ethereum':
      return generateCryptoQR(data);
    case 'app-store':
    case 'play-store':
      return generateAppStoreQR(data);
    case 'rating':
    case 'review':
      return generateReviewQR(data);
    case 'coupon':
      return generateCouponQR(data);
    case 'pdf':
      return generateDocumentQR(data);
    case 'business-card':
      return generateBusinessCardQR(data);
    case 'menu':
      return generateMenuQR(data);
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

// New QR Generator Functions

// Social Media Profiles
export const generateSocialProfileQR = (data: SocialProfileQRData): string => {
  const { type, username } = data;
  
  switch (type) {
    case 'instagram':
      return `https://instagram.com/${username}`;
    case 'twitter':
      return `https://twitter.com/${username}`;
    case 'tiktok':
      return `https://tiktok.com/@${username}`;
    case 'youtube':
      return `https://youtube.com/${username.startsWith('@') ? username : '@' + username}`;
    case 'linkedin':
      return `https://linkedin.com/in/${username}`;
    case 'facebook':
      return `https://facebook.com/${username}`;
    case 'snapchat':
      return `https://snapchat.com/add/${username}`;
    default:
      return '';
  }
};

// Communication Platforms
export const generateCommunicationQR = (data: CommunicationQRData): string => {
  const { type, identifier, message } = data;
  
  switch (type) {
    case 'discord':
      return identifier; // Discord invite link or user ID
    case 'skype':
      return `skype:${identifier}?call`;
    case 'zoom':
      return identifier; // Zoom meeting URL
    default:
      return '';
  }
};

// Entertainment
export const generateEntertainmentQR = (data: EntertainmentQRData): string => {
  const { type, uri } = data;
  
  switch (type) {
    case 'spotify':
      return uri; // Spotify URI like spotify:track:4iV5W9uYEdYUVa79Axb7Rh
    default:
      return '';
  }
};

// Payment
export const generatePaymentQR = (data: PaymentQRData): string => {
  const { type, recipient, amount, note } = data;
  
  switch (type) {
    case 'paypal':
      let paypalUrl = `https://paypal.me/${recipient}`;
      if (amount) paypalUrl += `/${amount}`;
      return paypalUrl;
    case 'venmo':
      let venmoUrl = `https://venmo.com/${recipient}`;
      if (amount || note) {
        const params = new URLSearchParams();
        if (amount) params.append('amount', amount.toString());
        if (note) params.append('note', note);
        venmoUrl += `?${params.toString()}`;
      }
      return venmoUrl;
    default:
      return '';
  }
};

// Cryptocurrency
export const generateCryptoQR = (data: CryptoQRData): string => {
  const { type, address, amount, label, message } = data;
  
  switch (type) {
    case 'bitcoin':
      let btcUri = `bitcoin:${address}`;
      const btcParams = new URLSearchParams();
      if (amount) btcParams.append('amount', amount.toString());
      if (label) btcParams.append('label', label);
      if (message) btcParams.append('message', message);
      if (btcParams.toString()) btcUri += `?${btcParams.toString()}`;
      return btcUri;
    case 'ethereum':
      let ethUri = `ethereum:${address}`;
      if (amount) ethUri += `@1?value=${amount}e18`; // Convert to wei
      return ethUri;
    default:
      return '';
  }
};

// App Stores
export const generateAppStoreQR = (data: AppStoreQRData): string => {
  const { type, appId } = data;
  
  switch (type) {
    case 'app-store':
      return `https://apps.apple.com/app/id${appId}`;
    case 'play-store':
      return `https://play.google.com/store/apps/details?id=${appId}`;
    default:
      return '';
  }
};

// Reviews/Ratings
export const generateReviewQR = (data: ReviewQRData): string => {
  const { type, platform, businessId } = data;
  
  switch (platform) {
    case 'google':
      return `https://www.google.com/search?q=${encodeURIComponent(businessId)}#lrd=0x0:0x0,1`;
    case 'yelp':
      return `https://www.yelp.com/biz/${businessId}`;
    case 'tripadvisor':
      return `https://www.tripadvisor.com/Restaurant_Review-g${businessId}`;
    case 'facebook':
      return `https://www.facebook.com/${businessId}/reviews`;
    default:
      return '';
  }
};

// Coupons
export const generateCouponQR = (data: CouponQRData): string => {
  const { code, description, expiryDate, discount } = data;
  
  // Create a structured coupon data format
  let couponData = `COUPON:${code}`;
  if (description) couponData += `;DESC:${description}`;
  if (discount) couponData += `;DISCOUNT:${discount}`;
  if (expiryDate) couponData += `;EXPIRES:${expiryDate}`;
  
  return couponData;
};

// Documents
export const generateDocumentQR = (data: DocumentQRData): string => {
  return data.url; // Simple URL to PDF document
};

// Business Card (Enhanced vCard)
export const generateBusinessCardQR = (data: BusinessCardQRData): string => {
  const { name, title, company, phone, email, website, address, linkedin } = data;
  
  let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
  vcard += `FN:${name}\n`;
  if (title) vcard += `TITLE:${title}\n`;
  if (company) vcard += `ORG:${company}\n`;
  if (phone) vcard += `TEL:${phone}\n`;
  if (email) vcard += `EMAIL:${email}\n`;
  if (website) vcard += `URL:${website}\n`;
  if (address) vcard += `ADR:;;${address};;;;\n`;
  if (linkedin) vcard += `URL;TYPE=LinkedIn:${linkedin}\n`;
  vcard += 'END:VCARD';
  
  return vcard;
};

// Menu
export const generateMenuQR = (data: MenuQRData): string => {
  return data.menuUrl; // URL to digital menu
};