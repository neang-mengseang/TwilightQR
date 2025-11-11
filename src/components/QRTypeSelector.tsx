import React, { useState } from 'react';
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
  Search,
  Grid3X3,
  Sparkles
} from 'lucide-react';

interface QRTypeSelectorProps {
  selectedType: QRType;
  onTypeChange: (type: QRType) => void;
  language: Language;
}

const QRTypeSelector: React.FC<QRTypeSelectorProps> = ({ 
  selectedType, 
  onTypeChange, 
  language 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const qrTypes = [
    { 
      id: 'text' as QRType, 
      icon: Type, 
      color: 'from-blue-500 to-cyan-500',
      category: 'Basic'
    },
    { 
      id: 'url' as QRType, 
      icon: Link2, 
      color: 'from-green-500 to-emerald-500',
      category: 'Basic'
    },
    { 
      id: 'email' as QRType, 
      icon: Mail, 
      color: 'from-red-500 to-pink-500',
      category: 'Communication'
    },
    { 
      id: 'phone' as QRType, 
      icon: Phone, 
      color: 'from-purple-500 to-violet-500',
      category: 'Communication'
    },
    { 
      id: 'sms' as QRType, 
      icon: MessageSquare, 
      color: 'from-yellow-500 to-orange-500',
      category: 'Communication'
    },
    { 
      id: 'wifi' as QRType, 
      icon: Wifi, 
      color: 'from-indigo-500 to-blue-500',
      category: 'Network'
    },
    { 
      id: 'location' as QRType, 
      icon: MapPin, 
      color: 'from-teal-500 to-green-500',
      category: 'Location'
    },
    { 
      id: 'event' as QRType, 
      icon: Calendar, 
      color: 'from-pink-500 to-rose-500',
      category: 'Event'
    },
    { 
      id: 'contact' as QRType, 
      icon: User, 
      color: 'from-gray-500 to-slate-500',
      category: 'Contact'
    },
    { 
      id: 'whatsapp' as QRType, 
      icon: MessageCircle, 
      color: 'from-green-600 to-green-500',
      category: 'Social'
    },
    { 
      id: 'telegram' as QRType, 
      icon: Send, 
      color: 'from-blue-600 to-blue-500',
      category: 'Social'
    },
    { 
      id: 'messenger' as QRType, 
      icon: Facebook, 
      color: 'from-blue-500 to-purple-500',
      category: 'Social'
    },
    { 
      id: 'custom' as QRType, 
      icon: Code, 
      color: 'from-gray-600 to-gray-500',
      category: 'Advanced'
    }
  ];

  const categories = [...new Set(qrTypes.map(type => type.category))];
  
  const filteredTypes = qrTypes.filter(type => 
    t(type.id, language).toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedTypes = categories.reduce((acc, category) => {
    acc[category] = filteredTypes.filter(type => type.category === category);
    return acc;
  }, {} as Record<string, typeof qrTypes>);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                QR Code Types
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Choose the type of content to encode
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400' 
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search QR types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-96 overflow-y-auto">
        {Object.entries(groupedTypes).map(([category, types]) => (
          types.length > 0 && (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                {category}
              </h3>
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'} gap-3`}>
                {types.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => onTypeChange(type.id)}
                      className={`group relative p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg transform scale-105'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${type.color} shadow-lg group-hover:shadow-xl transition-shadow`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-center">
                          <p className={`text-sm font-medium ${
                            isSelected 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {t(type.id, language)}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default QRTypeSelector;