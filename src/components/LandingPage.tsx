import React, { useState, useMemo } from 'react';
import { QRType, Language } from '../types';
import { t } from '../utils/i18n';
import { 
  Search,
  Filter,
  Sparkles,
  ArrowRight,
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

interface LandingPageProps {
  onSelectQRType: (type: QRType) => void;
  language: Language;
}

const QRTypeLandingPage: React.FC<LandingPageProps> = ({ onSelectQRType, language }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // All QR types with their metadata
  const qrTypes = [
    // Basic Types
    { 
      id: 'text' as QRType, 
      icon: Type, 
      color: 'from-blue-500 to-cyan-500',
      category: 'basic',
      description: 'Plain text content'
    },
    { 
      id: 'url' as QRType, 
      icon: Link2, 
      color: 'from-green-500 to-emerald-500',
      category: 'basic',
      description: 'Website or web link'
    },
    { 
      id: 'custom' as QRType, 
      icon: Code, 
      color: 'from-gray-600 to-gray-500',
      category: 'basic',
      description: 'Custom data format'
    },

    // Contact & Communication
    { 
      id: 'email' as QRType, 
      icon: Mail, 
      color: 'from-red-500 to-pink-500',
      category: 'contact',
      description: 'Email address or message'
    },
    { 
      id: 'phone' as QRType, 
      icon: Phone, 
      color: 'from-purple-500 to-indigo-500',
      category: 'contact',
      description: 'Phone number for calling'
    },
    { 
      id: 'sms' as QRType, 
      icon: MessageSquare, 
      color: 'from-yellow-500 to-orange-500',
      category: 'contact',
      description: 'SMS text message'
    },
    { 
      id: 'contact' as QRType, 
      icon: User, 
      color: 'from-violet-500 to-purple-500',
      category: 'contact',
      description: 'Contact information (vCard)'
    },
    { 
      id: 'business-card' as QRType, 
      icon: CreditCard, 
      color: 'from-slate-500 to-gray-600',
      category: 'contact',
      description: 'Professional business card'
    },

    // Social Media
    { 
      id: 'whatsapp' as QRType, 
      icon: MessageCircle, 
      color: 'from-green-600 to-green-500',
      category: 'social',
      description: 'WhatsApp message'
    },
    { 
      id: 'telegram' as QRType, 
      icon: Send, 
      color: 'from-blue-600 to-blue-500',
      category: 'social',
      description: 'Telegram message'
    },
    { 
      id: 'messenger' as QRType, 
      icon: Facebook, 
      color: 'from-blue-500 to-purple-500',
      category: 'social',
      description: 'Facebook Messenger'
    },
    { 
      id: 'discord' as QRType, 
      icon: Gamepad2, 
      color: 'from-indigo-600 to-purple-600',
      category: 'social',
      description: 'Discord server/user'
    },
    { 
      id: 'instagram' as QRType, 
      icon: Instagram, 
      color: 'from-pink-500 to-rose-500',
      category: 'social',
      description: 'Instagram profile'
    },
    { 
      id: 'twitter' as QRType, 
      icon: Twitter, 
      color: 'from-sky-500 to-blue-500',
      category: 'social',
      description: 'Twitter/X profile'
    },
    { 
      id: 'tiktok' as QRType, 
      icon: Music, 
      color: 'from-black to-gray-800',
      category: 'social',
      description: 'TikTok profile'
    },
    { 
      id: 'youtube' as QRType, 
      icon: Youtube, 
      color: 'from-red-600 to-red-500',
      category: 'social',
      description: 'YouTube channel'
    },
    { 
      id: 'linkedin' as QRType, 
      icon: Linkedin, 
      color: 'from-blue-700 to-blue-600',
      category: 'social',
      description: 'LinkedIn profile'
    },
    { 
      id: 'facebook' as QRType, 
      icon: Facebook, 
      color: 'from-blue-600 to-indigo-600',
      category: 'social',
      description: 'Facebook profile'
    },
    { 
      id: 'snapchat' as QRType, 
      icon: Camera, 
      color: 'from-yellow-400 to-yellow-300',
      category: 'social',
      description: 'Snapchat profile'
    },

    // Communication
    { 
      id: 'skype' as QRType, 
      icon: Video, 
      color: 'from-blue-500 to-cyan-500',
      category: 'communication',
      description: 'Skype contact'
    },
    { 
      id: 'zoom' as QRType, 
      icon: Video, 
      color: 'from-blue-600 to-blue-700',
      category: 'communication',
      description: 'Zoom meeting link'
    },

    // Entertainment
    { 
      id: 'spotify' as QRType, 
      icon: Music, 
      color: 'from-green-500 to-green-400',
      category: 'entertainment',
      description: 'Spotify track/playlist'
    },

    // Connectivity
    { 
      id: 'wifi' as QRType, 
      icon: Wifi, 
      color: 'from-teal-500 to-cyan-500',
      category: 'connectivity',
      description: 'WiFi network credentials'
    },

    // Location & Events
    { 
      id: 'location' as QRType, 
      icon: MapPin, 
      color: 'from-emerald-500 to-green-500',
      category: 'location',
      description: 'Geographic coordinates'
    },
    { 
      id: 'event' as QRType, 
      icon: Calendar, 
      color: 'from-orange-500 to-red-500',
      category: 'events',
      description: 'Calendar event details'
    },

    // Payment & Crypto
    { 
      id: 'paypal' as QRType, 
      icon: DollarSign, 
      color: 'from-blue-600 to-blue-500',
      category: 'payment',
      description: 'PayPal payment'
    },
    { 
      id: 'venmo' as QRType, 
      icon: DollarSign, 
      color: 'from-blue-500 to-cyan-500',
      category: 'payment',
      description: 'Venmo payment'
    },
    { 
      id: 'bitcoin' as QRType, 
      icon: Bitcoin, 
      color: 'from-orange-500 to-yellow-500',
      category: 'crypto',
      description: 'Bitcoin wallet address'
    },
    { 
      id: 'ethereum' as QRType, 
      icon: Bitcoin, 
      color: 'from-gray-600 to-gray-500',
      category: 'crypto',
      description: 'Ethereum wallet address'
    },

    // Apps & Stores
    { 
      id: 'app-store' as QRType, 
      icon: Smartphone, 
      color: 'from-blue-600 to-blue-500',
      category: 'apps',
      description: 'App Store app'
    },
    { 
      id: 'play-store' as QRType, 
      icon: Smartphone, 
      color: 'from-green-600 to-green-500',
      category: 'apps',
      description: 'Google Play Store app'
    },

    // Business & Marketing
    { 
      id: 'rating' as QRType, 
      icon: Star, 
      color: 'from-yellow-500 to-yellow-400',
      category: 'business',
      description: 'Business rating/review'
    },
    { 
      id: 'review' as QRType, 
      icon: Star, 
      color: 'from-orange-500 to-yellow-500',
      category: 'business',
      description: 'Review platform link'
    },
    { 
      id: 'coupon' as QRType, 
      icon: Gift, 
      color: 'from-purple-500 to-pink-500',
      category: 'business',
      description: 'Discount coupon code'
    },
    { 
      id: 'menu' as QRType, 
      icon: UtensilsCrossed, 
      color: 'from-amber-500 to-orange-500',
      category: 'business',
      description: 'Restaurant menu'
    },

    // Documents
    { 
      id: 'pdf' as QRType, 
      icon: FileText, 
      color: 'from-red-500 to-red-600',
      category: 'documents',
      description: 'PDF document link'
    }
  ];

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Types', icon: Sparkles },
    { id: 'basic', name: 'Basic', icon: Type },
    { id: 'contact', name: 'Contact & Communication', icon: User },
    { id: 'social', name: 'Social Media', icon: MessageCircle },
    { id: 'communication', name: 'Communication', icon: Video },
    { id: 'entertainment', name: 'Entertainment', icon: Music },
    { id: 'connectivity', name: 'Connectivity', icon: Wifi },
    { id: 'location', name: 'Location & Events', icon: MapPin },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'payment', name: 'Payment', icon: DollarSign },
    { id: 'crypto', name: 'Cryptocurrency', icon: Bitcoin },
    { id: 'apps', name: 'Apps & Stores', icon: Smartphone },
    { id: 'business', name: 'Business & Marketing', icon: Star },
    { id: 'documents', name: 'Documents', icon: FileText }
  ];

  // Filter QR types based on search and category
  const filteredTypes = useMemo(() => {
    return qrTypes.filter(qrType => {
      const matchesSearch = qrType.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           qrType.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           t(qrType.id, language).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || qrType.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [qrTypes, searchTerm, selectedCategory, language]);

  // Group filtered types by category for display
  const groupedTypes = useMemo(() => {
    const groups: Record<string, typeof qrTypes> = {};
    
    if (selectedCategory === 'all') {
      // Show all categories with their QR types
      categories.forEach(cat => {
        if (cat.id !== 'all') {
          groups[cat.id] = filteredTypes.filter(type => type.category === cat.id);
        }
      });
    } else {
      // Show only selected category
      groups[selectedCategory] = filteredTypes;
    }
    
    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });
    
    return groups;
  }, [filteredTypes, selectedCategory, categories]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              QR Magic
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Choose the perfect QR code type for your needs
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {filteredTypes.length} QR Types Available
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                All Categories
              </span>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search QR types..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="lg:w-80">
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* QR Types by Category */}
          <div className="space-y-12">
            {Object.entries(groupedTypes).map(([categoryId, types]) => {
              const category = categories.find(cat => cat.id === categoryId);
              if (!category || types.length === 0) return null;

              const CategoryIcon = category.icon;

              return (
                <div key={categoryId} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8">
                  
                  {/* Category Header */}
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {category.name}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {types.length} QR type{types.length !== 1 ? 's' : ''} available
                      </p>
                    </div>
                  </div>

                  {/* QR Types Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {types.map((qrType) => {
                      const IconComponent = qrType.icon;
                      
                      return (
                        <button
                          key={qrType.id}
                          onClick={() => onSelectQRType(qrType.id)}
                          className="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                          style={{
                            background: `linear-gradient(135deg, ${qrType.color.replace('from-', '').replace(' to-', ', ')})`,
                          }}
                        >
                          {/* Background Pattern */}
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Content */}
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                                <IconComponent className="w-6 h-6 text-white" />
                              </div>
                              <ArrowRight className="w-5 h-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                            </div>
                            
                            <h3 className="text-lg font-semibold text-white mb-2">
                              {t(qrType.id, language)}
                            </h3>
                            
                            <p className="text-sm text-white/80 leading-relaxed">
                              {qrType.description}
                            </p>
                          </div>

                          {/* Hover Glow Effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredTypes.length === 0 && (
            <div className="text-center py-16">
              <div className="mb-6">
                <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No QR types found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting your search term or category filter
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRTypeLandingPage;