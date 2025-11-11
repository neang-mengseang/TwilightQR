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