import React from 'react';
import { QRType, Language } from '../types';
import { t } from '../utils/i18n';
import { 
  Type, 
  Link2, 
  Mail, 
  Phone, 
  MessageSquare, 
  Wifi, 
  MapPin, 
  Calendar, 
  User, 
  MessageCircle, 
  Send, 
  Facebook,
  Code,
  Sparkles,
  Instagram,
  Twitter,
  Music,
  Youtube,
  Linkedin,
  Camera,
  Gamepad2,
  Video,
  DollarSign,
  Bitcoin,
  Smartphone,
  Star,
  Gift,
  FileText,
  CreditCard,
  UtensilsCrossed
} from 'lucide-react';

interface HorizontalQRTypeSelectorProps {
  selectedType: QRType;
  onTypeChange: (type: QRType) => void;
  language: Language;
}

const HorizontalQRTypeSelector: React.FC<HorizontalQRTypeSelectorProps> = ({ 
  selectedType, 
  onTypeChange, 
  language 
}) => {

  const qrTypes = [
    // Basic Types
    { 
      id: 'text' as QRType, 
      icon: Type, 
      color: 'from-blue-500 via-blue-600 to-cyan-500',
      description: 'Plain text content'
    },
    { 
      id: 'url' as QRType, 
      icon: Link2, 
      color: 'from-green-500 via-green-600 to-emerald-500',
      description: 'Website or web link'
    },
    { 
      id: 'custom' as QRType, 
      icon: Code, 
      color: 'from-gray-600 via-gray-600 to-gray-500',
      description: 'Custom data format'
    },

    // Contact & Communication
    { 
      id: 'email' as QRType, 
      icon: Mail, 
      color: 'from-red-500 via-red-600 to-pink-500',
      description: 'Email address or message'
    },
    { 
      id: 'phone' as QRType, 
      icon: Phone, 
      color: 'from-purple-500 via-purple-600 to-indigo-500',
      description: 'Phone number for calling'
    },
    { 
      id: 'sms' as QRType, 
      icon: MessageSquare, 
      color: 'from-yellow-500 via-yellow-600 to-orange-500',
      description: 'SMS text message'
    },
    { 
      id: 'contact' as QRType, 
      icon: User, 
      color: 'from-violet-500 via-violet-600 to-purple-500',
      description: 'Contact information (vCard)'
    },
    { 
      id: 'business-card' as QRType, 
      icon: CreditCard, 
      color: 'from-slate-500 via-slate-600 to-gray-600',
      description: 'Professional business card'
    },

    // Social Media Messaging
    { 
      id: 'whatsapp' as QRType, 
      icon: MessageCircle, 
      color: 'from-green-600 via-green-600 to-green-500',
      description: 'WhatsApp message'
    },
    { 
      id: 'telegram' as QRType, 
      icon: Send, 
      color: 'from-blue-600 via-blue-600 to-blue-500',
      description: 'Telegram message'
    },
    { 
      id: 'messenger' as QRType, 
      icon: Facebook, 
      color: 'from-blue-500 via-blue-600 to-purple-500',
      description: 'Facebook Messenger'
    },
    { 
      id: 'discord' as QRType, 
      icon: Gamepad2, 
      color: 'from-indigo-600 via-purple-600 to-purple-600',
      description: 'Discord server/user'
    },

    // Social Media Profiles
    { 
      id: 'instagram' as QRType, 
      icon: Instagram, 
      color: 'from-pink-500 via-rose-500 to-rose-500',
      description: 'Instagram profile'
    },
    { 
      id: 'twitter' as QRType, 
      icon: Twitter, 
      color: 'from-sky-500 via-sky-600 to-blue-500',
      description: 'Twitter/X profile'
    },
    { 
      id: 'tiktok' as QRType, 
      icon: Music, 
      color: 'from-black via-gray-800 to-gray-800',
      description: 'TikTok profile'
    },
    { 
      id: 'youtube' as QRType, 
      icon: Youtube, 
      color: 'from-red-600 via-red-600 to-red-500',
      description: 'YouTube channel'
    },
    { 
      id: 'linkedin' as QRType, 
      icon: Linkedin, 
      color: 'from-blue-700 via-blue-700 to-blue-600',
      description: 'LinkedIn profile'
    },
    { 
      id: 'facebook' as QRType, 
      icon: Facebook, 
      color: 'from-blue-600 via-blue-600 to-indigo-600',
      description: 'Facebook profile'
    },
    { 
      id: 'snapchat' as QRType, 
      icon: Camera, 
      color: 'from-yellow-400 via-yellow-400 to-yellow-300',
      description: 'Snapchat profile'
    },

    // Communication Platforms
    { 
      id: 'skype' as QRType, 
      icon: Video, 
      color: 'from-blue-500 via-blue-600 to-cyan-500',
      description: 'Skype contact'
    },
    { 
      id: 'zoom' as QRType, 
      icon: Video, 
      color: 'from-blue-600 via-blue-700 to-blue-700',
      description: 'Zoom meeting link'
    },

    // Entertainment
    { 
      id: 'spotify' as QRType, 
      icon: Music, 
      color: 'from-green-500 via-green-500 to-green-400',
      description: 'Spotify track/playlist'
    },

    // Connectivity
    { 
      id: 'wifi' as QRType, 
      icon: Wifi, 
      color: 'from-teal-500 via-teal-600 to-cyan-500',
      description: 'WiFi network credentials'
    },

    // Location & Events
    { 
      id: 'location' as QRType, 
      icon: MapPin, 
      color: 'from-emerald-500 via-emerald-600 to-green-500',
      description: 'Geographic coordinates'
    },
    { 
      id: 'event' as QRType, 
      icon: Calendar, 
      color: 'from-orange-500 via-orange-600 to-red-500',
      description: 'Calendar event details'
    },

    // Payment & Crypto
    { 
      id: 'paypal' as QRType, 
      icon: DollarSign, 
      color: 'from-blue-600 via-blue-600 to-blue-500',
      description: 'PayPal payment'
    },
    { 
      id: 'venmo' as QRType, 
      icon: DollarSign, 
      color: 'from-blue-500 via-cyan-500 to-cyan-500',
      description: 'Venmo payment'
    },
    { 
      id: 'bitcoin' as QRType, 
      icon: Bitcoin, 
      color: 'from-orange-500 via-yellow-500 to-yellow-500',
      description: 'Bitcoin wallet address'
    },
    { 
      id: 'ethereum' as QRType, 
      icon: Bitcoin, 
      color: 'from-gray-600 via-gray-600 to-gray-500',
      description: 'Ethereum wallet address'
    },

    // Apps & Stores
    { 
      id: 'app-store' as QRType, 
      icon: Smartphone, 
      color: 'from-blue-600 via-blue-600 to-blue-500',
      description: 'App Store app'
    },
    { 
      id: 'play-store' as QRType, 
      icon: Smartphone, 
      color: 'from-green-600 via-green-600 to-green-500',
      description: 'Google Play Store app'
    },

    // Business & Marketing
    { 
      id: 'rating' as QRType, 
      icon: Star, 
      color: 'from-yellow-500 via-yellow-500 to-yellow-400',
      description: 'Business rating/review'
    },
    { 
      id: 'review' as QRType, 
      icon: Star, 
      color: 'from-orange-500 via-yellow-500 to-yellow-500',
      description: 'Review platform link'
    },
    { 
      id: 'coupon' as QRType, 
      icon: Gift, 
      color: 'from-purple-500 via-pink-500 to-pink-500',
      description: 'Discount coupon code'
    },
    { 
      id: 'menu' as QRType, 
      icon: UtensilsCrossed, 
      color: 'from-amber-500 via-orange-500 to-orange-500',
      description: 'Restaurant menu'
    },

    // Documents
    { 
      id: 'pdf' as QRType, 
      icon: FileText, 
      color: 'from-red-500 via-red-600 to-red-600',
      description: 'PDF document link'
    }
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Choose QR Code Type
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Select what you want to encode - all {qrTypes.length} QR types available
            </p>
          </div>
        </div>
      </div>

      {/* All QR Types Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
        {qrTypes.map((qrType) => {
          const IconComponent = qrType.icon;
          const isSelected = selectedType === qrType.id;
          
          return (
            <button
              key={qrType.id}
              onClick={() => onTypeChange(qrType.id)}
              className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                isSelected
                  ? 'ring-2 ring-blue-500 scale-105 shadow-xl'
                  : 'hover:scale-102 hover:shadow-lg'
              }`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${qrType.color} ${
                isSelected ? 'opacity-100' : 'opacity-90 group-hover:opacity-100'
              } transition-opacity`} />
              
              {/* Content */}
              <div className="relative p-4 text-center min-h-[100px] flex flex-col justify-center">
                <div className="flex justify-center mb-2">
                  <IconComponent className="w-7 h-7 text-white drop-shadow-sm" />
                </div>
                <div className="text-sm font-semibold text-white mb-1 drop-shadow-sm">
                  {t(qrType.id, language)}
                </div>
                <div className="text-xs text-white/80 leading-tight">
                  {qrType.description}
                </div>
              </div>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </button>
          );
        })}
      </div>
      
      {/* Stats */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">{qrTypes.length}</span> QR code types available • 
          <span className="font-semibold text-blue-600 dark:text-blue-400"> {t(selectedType, language)}</span> selected
        </p>
      </div>
    </div>
  );
};

export default HorizontalQRTypeSelector;