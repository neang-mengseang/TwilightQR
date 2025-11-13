// QR Code Types and Interfaces

export type QRType = 
  | 'text'
  | 'url' 
  | 'email'
  | 'phone'
  | 'sms'
  | 'wifi'
  | 'location'
  | 'event'
  | 'contact'
  | 'whatsapp'
  | 'telegram'
  | 'messenger'
  | 'instagram'
  | 'twitter'
  | 'tiktok'
  | 'youtube'
  | 'linkedin'
  | 'facebook'
  | 'snapchat'
  | 'discord'
  | 'skype'
  | 'zoom'
  | 'spotify'
  | 'paypal'
  | 'venmo'
  | 'bitcoin'
  | 'ethereum'
  | 'app-store'
  | 'play-store'
  | 'rating'
  | 'review'
  | 'coupon'
  | 'pdf'
  | 'business-card'
  | 'menu'
  | 'custom';

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type Language = 'en' | 'km';

export type DotType = 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
export type CornerSquareType = 'dot' | 'square' | 'extra-rounded';
export type CornerDotType = 'dot' | 'square';

export interface QRCodeOptions {
  size: number;
  errorCorrectionLevel: ErrorCorrectionLevel;
  foregroundColor: string;
  backgroundColor: string;
  margin: number;
  logoUrl?: string;
  logoSize?: number; // Logo size as a percentage (0.1 - 0.5)
  template?: string; // Template style ID
  transparentBackground?: boolean;
  dotsType?: DotType;
  cornerSquareType?: CornerSquareType;
  cornerDotType?: CornerDotType;
}

// Base interface for all QR data types
export interface BaseQRData {
  type: QRType;
}

// Text QR
export interface TextQRData extends BaseQRData {
  type: 'text';
  text: string;
}

// URL QR
export interface URLQRData extends BaseQRData {
  type: 'url';
  url: string;
}

// Email QR
export interface EmailQRData extends BaseQRData {
  type: 'email';
  email: string;
  subject?: string;
  body?: string;
}

// Phone QR
export interface PhoneQRData extends BaseQRData {
  type: 'phone';
  phone: string;
}

// SMS QR
export interface SMSQRData extends BaseQRData {
  type: 'sms';
  phone: string;
  message?: string;
}

// WiFi QR
export interface WiFiQRData extends BaseQRData {
  type: 'wifi';
  ssid: string;
  password: string;
  security: 'WPA' | 'WEP' | 'nopass';
  hidden?: boolean;
}

// Location/Geo QR
export interface LocationQRData extends BaseQRData {
  type: 'location';
  latitude: number;
  longitude: number;
  query?: string;
}

// Event/vEvent QR
export interface EventQRData extends BaseQRData {
  type: 'event';
  title: string;
  location?: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay?: boolean;
}

// Contact/vCard QR
export interface ContactQRData extends BaseQRData {
  type: 'contact';
  firstName: string;
  lastName?: string;
  organization?: string;
  phone?: string;
  email?: string;
  url?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

// Social Media QR (WhatsApp, Telegram, Messenger)
export interface SocialQRData extends BaseQRData {
  type: 'whatsapp' | 'telegram' | 'messenger';
  identifier: string; // phone number for WhatsApp, username for others
  message?: string;
}

// Social Media Profiles QR
export interface SocialProfileQRData extends BaseQRData {
  type: 'instagram' | 'twitter' | 'tiktok' | 'youtube' | 'linkedin' | 'facebook' | 'snapchat';
  username: string;
}

// Communication QR
export interface CommunicationQRData extends BaseQRData {
  type: 'discord' | 'skype' | 'zoom';
  identifier: string; // username, ID, or meeting URL
  message?: string;
}

// Entertainment QR
export interface EntertainmentQRData extends BaseQRData {
  type: 'spotify';
  uri: string; // Spotify URI (track, playlist, artist, etc.)
}

// Payment QR
export interface PaymentQRData extends BaseQRData {
  type: 'paypal' | 'venmo';
  recipient: string;
  amount?: number;
  note?: string;
}

// Cryptocurrency QR
export interface CryptoQRData extends BaseQRData {
  type: 'bitcoin' | 'ethereum';
  address: string;
  amount?: number;
  label?: string;
  message?: string;
}

// App Store QR
export interface AppStoreQRData extends BaseQRData {
  type: 'app-store' | 'play-store';
  appId: string; // App ID or package name
  appName?: string;
}

// Review/Rating QR
export interface ReviewQRData extends BaseQRData {
  type: 'rating' | 'review';
  platform: 'google' | 'yelp' | 'tripadvisor' | 'facebook';
  businessId: string;
  businessName?: string;
}

// Coupon QR
export interface CouponQRData extends BaseQRData {
  type: 'coupon';
  code: string;
  description?: string;
  expiryDate?: string;
  discount?: string;
}

// Document QR
export interface DocumentQRData extends BaseQRData {
  type: 'pdf';
  title: string;
  url: string;
  description?: string;
}

// Business Card QR (enhanced vCard)
export interface BusinessCardQRData extends BaseQRData {
  type: 'business-card';
  name: string;
  title?: string;
  company?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  linkedin?: string;
}

// Menu QR
export interface MenuQRData extends BaseQRData {
  type: 'menu';
  restaurantName: string;
  menuUrl: string;
  description?: string;
}

// Custom QR (user enters raw data)
export interface CustomQRData extends BaseQRData {
  type: 'custom';
  data: string;
}

// Union type for all QR data types
export type QRData = 
  | TextQRData
  | URLQRData
  | EmailQRData
  | PhoneQRData
  | SMSQRData
  | WiFiQRData
  | LocationQRData
  | EventQRData
  | ContactQRData
  | SocialQRData
  | SocialProfileQRData
  | CommunicationQRData
  | EntertainmentQRData
  | PaymentQRData
  | CryptoQRData
  | AppStoreQRData
  | ReviewQRData
  | CouponQRData
  | DocumentQRData
  | BusinessCardQRData
  | MenuQRData
  | CustomQRData;

// Form field configuration
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'number' | 'select' | 'textarea' | 'datetime-local' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  validation?: {
    pattern?: string;
    message?: string;
    min?: number;
    max?: number;
  };
  options?: { value: string; label: string }[];
  description?: string;
}

// QR Type Configuration
export interface QRTypeConfig {
  id: QRType;
  name: string;
  description: string;
  icon: string;
  fields: FormField[];
  generate: (data: any) => string;
}

// App State
export interface AppState {
  currentType: QRType;
  qrData: QRData;
  qrOptions: QRCodeOptions;
  theme: 'light' | 'dark';
  language: Language;
  generatedQRString: string;
}

// Translation interface
export interface Translations {
  [key: string]: {
    en: string;
    km: string;
  };
}

// Export format types
export type ExportFormat = 'png' | 'svg' | 'jpeg' | 'webp';

export interface ExportOptions {
  format: ExportFormat;
  quality?: number; // for jpeg/webp
  scale?: number; // for png
  size?: number; // custom export size
}