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