import React, { useState, useRef, useEffect } from 'react';
import { QRType, QRData, QRCodeOptions, Language } from '../types';
import {
  ArrowLeft, Edit3, Palette, ChevronDown, Check, Search, QrCode,
  Type, Link2, Mail, Phone, MessageSquare, Wifi, MapPin, Calendar, User,
  MessageCircle, Send, Code, CreditCard, Gamepad2, Instagram, Twitter, Music,
  Youtube, Linkedin, Facebook, Camera, Video, DollarSign, Bitcoin, Smartphone,
  Star, Gift, FileText, UtensilsCrossed,
} from 'lucide-react';
import { t } from '../utils/i18n';
import { qrTypeConfigs } from '../utils/qrTypes';
import QRForm from '../components/QRForm';
import QRPreview from '../components/QRPreview';
import QRCustomization from '../components/QRCustomization';

const iconMap: Record<string, React.ElementType> = {
  Type, Link: Link2, Mail, Phone, MessageSquare, Wifi, MapPin, Calendar, User,
  MessageCircle, Send, Code, CreditCard, Gamepad2, Instagram, Twitter, Music,
  Youtube, Linkedin, Facebook, Camera, Video, DollarSign, Bitcoin, Smartphone,
  Star, Gift, FileText, UtensilsCrossed,
};

interface QRGeneratorPageProps {
  qrType: QRType;
  qrData: QRData;
  qrOptions: QRCodeOptions;
  language: Language;
  validationErrors: string[];
  onBack: () => void;
  onDataChange: (data: Partial<QRData>) => void;
  onOptionsChange: (options: Partial<QRCodeOptions>) => void;
  onValidation: (errors: string[]) => void;
  onReset: () => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onSaveToHistory: () => void;
  onSelectQRType: (type: QRType) => void;
}

const QRGeneratorPage: React.FC<QRGeneratorPageProps> = ({
  qrType,
  qrData,
  qrOptions,
  language,
  validationErrors,
  onBack,
  onDataChange,
  onOptionsChange,
  onValidation,
  onReset,
  onToast,
  onSaveToHistory,
  onSelectQRType
}) => {
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [typeSearch, setTypeSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionsHistoryRef = useRef<QRCodeOptions[]>([]);

  const allTypes = Object.keys(qrTypeConfigs) as QRType[];
  const currentConfig = qrTypeConfigs[qrType];

  const filteredTypes = allTypes.filter(typeId =>
    qrTypeConfigs[typeId].name.toLowerCase().includes(typeSearch.toLowerCase())
  );

  const handleOptionsChangeWithHistory = (options: Partial<QRCodeOptions>) => {
    optionsHistoryRef.current.push({ ...qrOptions });
    if (optionsHistoryRef.current.length > 50) optionsHistoryRef.current.shift();
    onOptionsChange(options);
  };

  const handleUndo = () => {
    const prev = optionsHistoryRef.current.pop();
    if (prev) {
      onOptionsChange(prev);
      onToast('Undone', 'info');
    } else {
      onToast('Nothing to undo', 'info');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen pb-24">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">

          {/* Top Bar: Back + Type Dropdown */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover-lift group"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
              <span className="font-medium text-gray-900 dark:text-white text-sm">Back</span>
            </button>

            {/* QR Type Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover-lift"
              >
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{currentConfig.name}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${typeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {typeDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={typeSearch}
                        onChange={(e) => setTypeSearch(e.target.value)}
                        placeholder="Search QR types..."
                        autoFocus
                        className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto p-2">
                    {filteredTypes.map(typeId => {
                      const config = qrTypeConfigs[typeId];
                      const isActive = typeId === qrType;
                      const Icon = iconMap[config?.icon] || QrCode;
                      return (
                        <button
                          key={typeId}
                          onClick={() => {
                            onSelectQRType(typeId);
                            setTypeDropdownOpen(false);
                            setTypeSearch('');
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                            isActive
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <Icon className="w-4 h-4 flex-shrink-0 opacity-70" />
                          <span className="text-sm font-medium flex-1">{config.name}</span>
                          {isActive && <Check className="w-4 h-4 text-emerald-600" />}
                        </button>
                      );
                    })}
                    {filteredTypes.length === 0 && (
                      <p className="text-center text-sm text-gray-400 py-4">No types found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column - Form and Customization */}
            <div className="lg:col-span-2 space-y-6">

              {/* QR Content Form */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <Edit3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">Content</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{currentConfig.name} QR code</p>
                  </div>
                </div>
                <div className="p-5">
                  <QRForm
                    qrData={qrData}
                    currentType={qrType}
                    language={language}
                    validationErrors={validationErrors}
                    onTypeChange={() => {}}
                    onDataChange={onDataChange}
                    onValidation={onValidation}
                    onReset={onReset}
                  />
                </div>
              </div>

              {/* Customization */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">Style</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Colors, patterns, logo</p>
                  </div>
                </div>
                <div className="p-5">
                  <QRCustomization
                    options={qrOptions}
                    language={language}
                    onChange={handleOptionsChangeWithHistory}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Preview (Sticky on desktop) */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-20">
                <div>
                  <QRPreview
                    qrData={qrData}
                    qrOptions={qrOptions}
                    language={language}
                    onToast={onToast}
                    onSaveToHistory={onSaveToHistory}
                    onUndo={handleUndo}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGeneratorPage;
