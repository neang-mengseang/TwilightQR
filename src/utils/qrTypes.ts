import { QRType, QRTypeConfig, FormField } from '../types';
import { generateQRString } from './qrGenerators';

/**
 * Configuration for all supported QR code types
 * Each type defines its form fields, validation, and generation logic
 * 
 * To add a new QR type:
 * 1. Add the type to the QRType union in types/index.ts
 * 2. Create corresponding data interface
 * 3. Add configuration here
 * 4. Implement generator function in qrGenerators.ts
 */

export const qrTypeConfigs: Record<QRType, QRTypeConfig> = {
  text: {
    id: 'text',
    name: 'Text',
    description: 'Generate QR code for plain text',
    icon: 'Type',
    fields: [
      {
        name: 'text',
        label: 'Text Content',
        type: 'textarea',
        placeholder: 'Enter your text here...',
        required: true,
        validation: {
          message: 'Text content is required'
        }
      }
    ],
    generate: generateQRString
  },

  url: {
    id: 'url',
    name: 'Website URL',
    description: 'Create QR code for website links',
    icon: 'Link',
    fields: [
      {
        name: 'url',
        label: 'Website URL',
        type: 'url',
        placeholder: 'https://example.com',
        required: true,
        validation: {
          pattern: '^(https?://)?.+\\..+',
          message: 'Please enter a valid URL'
        }
      }
    ],
    generate: generateQRString
  },

  email: {
    id: 'email',
    name: 'Email',
    description: 'Generate QR code for email addresses',
    icon: 'Mail',
    fields: [
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'example@email.com',
        required: true,
        validation: {
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
          message: 'Please enter a valid email address'
        }
      },
      {
        name: 'subject',
        label: 'Subject (Optional)',
        type: 'text',
        placeholder: 'Email subject'
      },
      {
        name: 'body',
        label: 'Message (Optional)',
        type: 'textarea',
        placeholder: 'Email message content'
      }
    ],
    generate: generateQRString
  },

  phone: {
    id: 'phone',
    name: 'Phone',
    description: 'Create QR code for phone numbers',
    icon: 'Phone',
    fields: [
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        placeholder: '+1234567890',
        required: true,
        validation: {
          pattern: '^[\\+]?[\\d\\s\\-\\(\\)]{7,15}$',
          message: 'Please enter a valid phone number'
        }
      }
    ],
    generate: generateQRString
  },

  sms: {
    id: 'sms',
    name: 'SMS',
    description: 'Generate QR code for SMS messages',
    icon: 'MessageSquare',
    fields: [
      {
        name: 'phone',
        label: 'Phone Number',
        type: 'tel',
        placeholder: '+1234567890',
        required: true,
        validation: {
          pattern: '^[\\+]?[\\d\\s\\-\\(\\)]{7,15}$',
          message: 'Please enter a valid phone number'
        }
      },
      {
        name: 'message',
        label: 'Message (Optional)',
        type: 'textarea',
        placeholder: 'SMS message content'
      }
    ],
    generate: generateQRString
  },

  wifi: {
    id: 'wifi',
    name: 'Wi-Fi',
    description: 'Create QR code for Wi-Fi network access',
    icon: 'Wifi',
    fields: [
      {
        name: 'ssid',
        label: 'Network Name (SSID)',
        type: 'text',
        placeholder: 'My WiFi Network',
        required: true,
        validation: {
          message: 'Network name is required'
        }
      },
      {
        name: 'security',
        label: 'Security Type',
        type: 'select',
        required: true,
        options: [
          { value: 'WPA', label: 'WPA/WPA2' },
          { value: 'WEP', label: 'WEP' },
          { value: 'nopass', label: 'No Password' }
        ]
      },
      {
        name: 'password',
        label: 'Password',
        type: 'text',
        placeholder: 'Network password',
        description: 'Leave empty for open networks'
      },
      {
        name: 'hidden',
        label: 'Hidden Network',
        type: 'checkbox',
        description: 'Check if this is a hidden network'
      }
    ],
    generate: generateQRString
  },

  location: {
    id: 'location',
    name: 'Location',
    description: 'Generate QR code for geographic locations',
    icon: 'MapPin',
    fields: [
      {
        name: 'latitude',
        label: 'Latitude',
        type: 'number',
        placeholder: '40.7128',
        required: true,
        validation: {
          min: -90,
          max: 90,
          message: 'Latitude must be between -90 and 90'
        }
      },
      {
        name: 'longitude',
        label: 'Longitude',
        type: 'number',
        placeholder: '-74.0060',
        required: true,
        validation: {
          min: -180,
          max: 180,
          message: 'Longitude must be between -180 and 180'
        }
      },
      {
        name: 'query',
        label: 'Location Name (Optional)',
        type: 'text',
        placeholder: 'New York City',
        description: 'Optional location description'
      }
    ],
    generate: generateQRString
  },

  event: {
    id: 'event',
    name: 'Event',
    description: 'Create QR code for calendar events',
    icon: 'Calendar',
    fields: [
      {
        name: 'title',
        label: 'Event Title',
        type: 'text',
        placeholder: 'My Event',
        required: true,
        validation: {
          message: 'Event title is required'
        }
      },
      {
        name: 'startDate',
        label: 'Start Date & Time',
        type: 'datetime-local',
        required: true,
        validation: {
          message: 'Start date is required'
        }
      },
      {
        name: 'endDate',
        label: 'End Date & Time',
        type: 'datetime-local',
        required: true,
        validation: {
          message: 'End date is required'
        }
      },
      {
        name: 'location',
        label: 'Location (Optional)',
        type: 'text',
        placeholder: 'Event location'
      },
      {
        name: 'description',
        label: 'Description (Optional)',
        type: 'textarea',
        placeholder: 'Event description'
      }
    ],
    generate: generateQRString
  },

  contact: {
    id: 'contact',
    name: 'Contact',
    description: 'Generate QR code for contact information',
    icon: 'User',
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'John',
        required: true,
        validation: {
          message: 'First name is required'
        }
      },
      {
        name: 'lastName',
        label: 'Last Name (Optional)',
        type: 'text',
        placeholder: 'Doe'
      },
      {
        name: 'organization',
        label: 'Organization (Optional)',
        type: 'text',
        placeholder: 'Company Name'
      },
      {
        name: 'phone',
        label: 'Phone Number (Optional)',
        type: 'tel',
        placeholder: '+1234567890'
      },
      {
        name: 'email',
        label: 'Email Address (Optional)',
        type: 'email',
        placeholder: 'john@example.com'
      },
      {
        name: 'url',
        label: 'Website (Optional)',
        type: 'url',
        placeholder: 'https://example.com'
      }
    ],
    generate: generateQRString
  },

  whatsapp: {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Create QR code for WhatsApp messages',
    icon: 'MessageCircle',
    fields: [
      {
        name: 'identifier',
        label: 'Phone Number',
        type: 'tel',
        placeholder: '+1234567890',
        required: true,
        validation: {
          pattern: '^[\\+]?[\\d\\s\\-\\(\\)]{7,15}$',
          message: 'Please enter a valid phone number'
        },
        description: 'Include country code (e.g., +1234567890)'
      },
      {
        name: 'message',
        label: 'Pre-filled Message (Optional)',
        type: 'textarea',
        placeholder: 'Hello! I found your contact through QR code.'
      }
    ],
    generate: generateQRString
  },

  telegram: {
    id: 'telegram',
    name: 'Telegram',
    description: 'Generate QR code for Telegram contacts',
    icon: 'Send',
    fields: [
      {
        name: 'identifier',
        label: 'Username',
        type: 'text',
        placeholder: 'username or @username',
        required: true,
        validation: {
          message: 'Username is required'
        },
        description: 'Telegram username (with or without @)'
      }
    ],
    generate: generateQRString
  },

  messenger: {
    id: 'messenger',
    name: 'Messenger',
    description: 'Create QR code for Messenger contacts',
    icon: 'MessageSquare',
    fields: [
      {
        name: 'identifier',
        label: 'Username',
        type: 'text',
        placeholder: 'messenger.username',
        required: true,
        validation: {
          message: 'Username is required'
        },
        description: 'Facebook Messenger username'
      }
    ],
    generate: generateQRString
  },

  custom: {
    id: 'custom',
    name: 'Custom',
    description: 'Generate QR code for custom data',
    icon: 'Code',
    fields: [
      {
        name: 'data',
        label: 'Custom Data',
        type: 'textarea',
        placeholder: 'Enter any text, URL, or data format...',
        required: true,
        validation: {
          message: 'Custom data is required'
        },
        description: 'Enter any text or data format (URL, vCard, etc.)'
      }
    ],
    generate: generateQRString
  },
  
  // Business & Professional
  'business-card': {
    id: 'business-card',
    name: 'Business Card',
    description: 'Generate QR code for business card',
    icon: 'CreditCard',
    fields: [
      {
        name: 'name',
        label: 'Full Name',
        type: 'text',
        placeholder: 'John Doe',
        required: true,
        validation: { message: 'Full name is required' }
      },
      {
        name: 'title',
        label: 'Job Title',
        type: 'text',
        placeholder: 'Software Engineer',
        required: false
      },
      {
        name: 'company',
        label: 'Company',
        type: 'text',
        placeholder: 'Company Name',
        required: false
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'john@company.com',
        required: false
      },
      {
        name: 'phone',
        label: 'Phone',
        type: 'tel',
        placeholder: '+1234567890',
        required: false
      },
      {
        name: 'website',
        label: 'Website',
        type: 'url',
        placeholder: 'https://company.com',
        required: false
      }
    ],
    generate: generateQRString
  },

  // Social Media
  discord: {
    id: 'discord',
    name: 'Discord',
    description: 'Generate QR code for Discord server or user',
    icon: 'Gamepad2',
    fields: [
      {
        name: 'invite',
        label: 'Discord Invite Link',
        type: 'url',
        placeholder: 'https://discord.gg/invite-code',
        required: true,
        validation: { message: 'Discord invite link is required' }
      }
    ],
    generate: generateQRString
  },

  instagram: {
    id: 'instagram',
    name: 'Instagram',
    description: 'Generate QR code for Instagram profile',
    icon: 'Instagram',
    fields: [
      {
        name: 'username',
        label: 'Instagram Username',
        type: 'text',
        placeholder: 'your_username',
        required: true,
        validation: { message: 'Instagram username is required' }
      }
    ],
    generate: generateQRString
  },

  twitter: {
    id: 'twitter',
    name: 'Twitter/X',
    description: 'Generate QR code for Twitter/X profile',
    icon: 'Twitter',
    fields: [
      {
        name: 'username',
        label: 'Twitter Username',
        type: 'text',
        placeholder: 'your_username',
        required: true,
        validation: { message: 'Twitter username is required' }
      }
    ],
    generate: generateQRString
  },

  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    description: 'Generate QR code for TikTok profile',
    icon: 'Music',
    fields: [
      {
        name: 'username',
        label: 'TikTok Username',
        type: 'text',
        placeholder: '@your_username',
        required: true,
        validation: { message: 'TikTok username is required' }
      }
    ],
    generate: generateQRString
  },

  youtube: {
    id: 'youtube',
    name: 'YouTube',
    description: 'Generate QR code for YouTube channel',
    icon: 'Youtube',
    fields: [
      {
        name: 'channel',
        label: 'YouTube Channel URL',
        type: 'url',
        placeholder: 'https://youtube.com/@channelname',
        required: true,
        validation: { message: 'YouTube channel URL is required' }
      }
    ],
    generate: generateQRString
  },

  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Generate QR code for LinkedIn profile',
    icon: 'Linkedin',
    fields: [
      {
        name: 'profile',
        label: 'LinkedIn Profile URL',
        type: 'url',
        placeholder: 'https://linkedin.com/in/username',
        required: true,
        validation: { message: 'LinkedIn profile URL is required' }
      }
    ],
    generate: generateQRString
  },

  facebook: {
    id: 'facebook',
    name: 'Facebook',
    description: 'Generate QR code for Facebook profile',
    icon: 'Facebook',
    fields: [
      {
        name: 'profile',
        label: 'Facebook Profile URL',
        type: 'url',
        placeholder: 'https://facebook.com/username',
        required: true,
        validation: { message: 'Facebook profile URL is required' }
      }
    ],
    generate: generateQRString
  },

  snapchat: {
    id: 'snapchat',
    name: 'Snapchat',
    description: 'Generate QR code for Snapchat profile',
    icon: 'Camera',
    fields: [
      {
        name: 'username',
        label: 'Snapchat Username',
        type: 'text',
        placeholder: 'your_username',
        required: true,
        validation: { message: 'Snapchat username is required' }
      }
    ],
    generate: generateQRString
  },

  // Communication
  skype: {
    id: 'skype',
    name: 'Skype',
    description: 'Generate QR code for Skype contact',
    icon: 'Video',
    fields: [
      {
        name: 'username',
        label: 'Skype Username',
        type: 'text',
        placeholder: 'your_skype_name',
        required: true,
        validation: { message: 'Skype username is required' }
      }
    ],
    generate: generateQRString
  },

  zoom: {
    id: 'zoom',
    name: 'Zoom',
    description: 'Generate QR code for Zoom meeting',
    icon: 'Video',
    fields: [
      {
        name: 'meeting_url',
        label: 'Zoom Meeting URL',
        type: 'url',
        placeholder: 'https://zoom.us/j/1234567890',
        required: true,
        validation: { message: 'Zoom meeting URL is required' }
      }
    ],
    generate: generateQRString
  },

  // Entertainment
  spotify: {
    id: 'spotify',
    name: 'Spotify',
    description: 'Generate QR code for Spotify track or playlist',
    icon: 'Music',
    fields: [
      {
        name: 'spotify_url',
        label: 'Spotify URL',
        type: 'url',
        placeholder: 'https://open.spotify.com/track/...',
        required: true,
        validation: { message: 'Spotify URL is required' }
      }
    ],
    generate: generateQRString
  },

  // Payment
  paypal: {
    id: 'paypal',
    name: 'PayPal',
    description: 'Generate QR code for PayPal payment',
    icon: 'DollarSign',
    fields: [
      {
        name: 'email',
        label: 'PayPal Email',
        type: 'email',
        placeholder: 'your@paypal.email',
        required: true,
        validation: { message: 'PayPal email is required' }
      },
      {
        name: 'amount',
        label: 'Amount (optional)',
        type: 'number',
        placeholder: '10.00',
        required: false
      }
    ],
    generate: generateQRString
  },

  venmo: {
    id: 'venmo',
    name: 'Venmo',
    description: 'Generate QR code for Venmo payment',
    icon: 'DollarSign',
    fields: [
      {
        name: 'username',
        label: 'Venmo Username',
        type: 'text',
        placeholder: '@username',
        required: true,
        validation: { message: 'Venmo username is required' }
      },
      {
        name: 'amount',
        label: 'Amount (optional)',
        type: 'number',
        placeholder: '10.00',
        required: false
      }
    ],
    generate: generateQRString
  },

  // Cryptocurrency
  bitcoin: {
    id: 'bitcoin',
    name: 'Bitcoin',
    description: 'Generate QR code for Bitcoin wallet address',
    icon: 'Bitcoin',
    fields: [
      {
        name: 'address',
        label: 'Bitcoin Address',
        type: 'text',
        placeholder: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        required: true,
        validation: { message: 'Bitcoin address is required' }
      },
      {
        name: 'amount',
        label: 'Amount (BTC, optional)',
        type: 'number',
        placeholder: '0.001',
        required: false
      }
    ],
    generate: generateQRString
  },

  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    description: 'Generate QR code for Ethereum wallet address',
    icon: 'Bitcoin',
    fields: [
      {
        name: 'address',
        label: 'Ethereum Address',
        type: 'text',
        placeholder: '0x742d35Cc6634C0532925a3b8D3AC...', 
        required: true,
        validation: { message: 'Ethereum address is required' }
      },
      {
        name: 'amount',
        label: 'Amount (ETH, optional)',
        type: 'number',
        placeholder: '0.1',
        required: false
      }
    ],
    generate: generateQRString
  },

  // Apps & Stores
  'app-store': {
    id: 'app-store',
    name: 'App Store',
    description: 'Generate QR code for App Store app',
    icon: 'Smartphone',
    fields: [
      {
        name: 'app_url',
        label: 'App Store URL',
        type: 'url',
        placeholder: 'https://apps.apple.com/app/...',
        required: true,
        validation: { message: 'App Store URL is required' }
      }
    ],
    generate: generateQRString
  },

  'play-store': {
    id: 'play-store',
    name: 'Google Play Store',
    description: 'Generate QR code for Google Play Store app',
    icon: 'Smartphone',
    fields: [
      {
        name: 'app_url',
        label: 'Play Store URL',
        type: 'url',
        placeholder: 'https://play.google.com/store/apps/details?id=...',
        required: true,
        validation: { message: 'Play Store URL is required' }
      }
    ],
    generate: generateQRString
  },

  // Business & Marketing
  rating: {
    id: 'rating',
    name: 'Rating',
    description: 'Generate QR code for business rating/review',
    icon: 'Star',
    fields: [
      {
        name: 'review_url',
        label: 'Review Platform URL',
        type: 'url',
        placeholder: 'https://google.com/business/reviews/...',
        required: true,
        validation: { message: 'Review URL is required' }
      }
    ],
    generate: generateQRString
  },

  review: {
    id: 'review',
    name: 'Review',
    description: 'Generate QR code for review platform',
    icon: 'Star',
    fields: [
      {
        name: 'review_url',
        label: 'Review Platform URL',
        type: 'url',
        placeholder: 'https://yelp.com/biz/...',
        required: true,
        validation: { message: 'Review URL is required' }
      }
    ],
    generate: generateQRString
  },

  coupon: {
    id: 'coupon',
    name: 'Coupon',
    description: 'Generate QR code for discount coupon',
    icon: 'Gift',
    fields: [
      {
        name: 'code',
        label: 'Coupon Code',
        type: 'text',
        placeholder: 'SAVE20',
        required: true,
        validation: { message: 'Coupon code is required' }
      },
      {
        name: 'description',
        label: 'Description',
        type: 'text',
        placeholder: '20% off your next purchase',
        required: false
      }
    ],
    generate: generateQRString
  },

  menu: {
    id: 'menu',
    name: 'Restaurant Menu',
    description: 'Generate QR code for restaurant menu',
    icon: 'UtensilsCrossed',
    fields: [
      {
        name: 'menu_url',
        label: 'Menu URL',
        type: 'url',
        placeholder: 'https://restaurant.com/menu',
        required: true,
        validation: { message: 'Menu URL is required' }
      }
    ],
    generate: generateQRString
  },

  // Documents
  pdf: {
    id: 'pdf',
    name: 'PDF Document',
    description: 'Generate QR code for PDF document',
    icon: 'FileText',
    fields: [
      {
        name: 'pdf_url',
        label: 'PDF URL',
        type: 'url',
        placeholder: 'https://example.com/document.pdf',
        required: true,
        validation: { message: 'PDF URL is required' }
      }
    ],
    generate: generateQRString
  }
};

// Helper function to get QR type configuration
export const getQRTypeConfig = (type: QRType): QRTypeConfig => {
  return qrTypeConfigs[type];
};

// Get all available QR types
export const getAllQRTypes = (): QRTypeConfig[] => {
  return Object.values(qrTypeConfigs);
};

// Get QR type by ID
export const getQRTypeById = (id: string): QRTypeConfig | undefined => {
  return qrTypeConfigs[id as QRType];
};