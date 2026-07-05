import React, { useState, useRef, useEffect } from 'react';
import {
  Moon, Sun, Globe, QrCode, ScanLine, Layers, History, Home, ChevronDown,
  Type, Link2, Mail, Phone, MessageSquare, Wifi, MapPin, Calendar, User,
  MessageCircle, Send, Code, CreditCard, Gamepad2, Instagram, Twitter, Music,
  Youtube, Linkedin, Facebook, Camera, Video, DollarSign, Bitcoin, Smartphone,
  Star, Gift, FileText, UtensilsCrossed,
} from 'lucide-react';
import { Language, QRType } from '../types';
import { getAvailableLanguages } from '../utils/i18n';
import { qrTypeConfigs } from '../utils/qrTypes';

export type Page = 'landing' | 'generator' | 'scanner' | 'batch' | 'history' | 'shared' | 'social';

const iconMap: Record<string, React.ElementType> = {
  Type, Link: Link2, Mail, Phone, MessageSquare, Wifi, MapPin, Calendar, User,
  MessageCircle, Send, Code, CreditCard, Gamepad2, Instagram, Twitter, Music,
  Youtube, Linkedin, Facebook, Camera, Video, DollarSign, Bitcoin, Smartphone,
  Star, Gift, FileText, UtensilsCrossed,
};

const topTypes: QRType[] = [
  'url', 'text', 'wifi', 'email', 'phone', 'sms',
  'contact', 'whatsapp', 'location', 'event', 'paypal', 'business-card',
];

interface HeaderProps {
  theme: 'light' | 'dark';
  language: Language;
  currentPage: Page;
  onThemeChange: (theme: 'light' | 'dark') => void;
  onLanguageChange: (language: Language) => void;
  onNavigate: (page: Page) => void;
  onSelectQRType: (type: QRType) => void;
}

const Header: React.FC<HeaderProps> = ({
  theme,
  language,
  currentPage,
  onThemeChange,
  onLanguageChange,
  onNavigate,
  onSelectQRType
}) => {
  const [generatorDropdownOpen, setGeneratorDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const languages = getAvailableLanguages();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setGeneratorDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'scanner', label: 'Scanner', icon: ScanLine },
    { id: 'batch', label: 'Batch', icon: Layers },
    { id: 'history', label: 'History', icon: History },
  ];

  const handleNavClick = (page: Page) => {
    onNavigate(page);
    setGeneratorDropdownOpen(false);
  };

  const handleSelectType = (type: QRType) => {
    onSelectQRType(type);
    setGeneratorDropdownOpen(false);
  };

  const getTypeIcon = (typeId: QRType): React.ElementType => {
    const config = qrTypeConfigs[typeId];
    return iconMap[config?.icon] || QrCode;
  };

  const PillButton: React.FC<{
    active: boolean;
    onClick: () => void;
    label: string;
    children: React.ReactNode;
  }> = ({ active, onClick, label, children }) => (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 h-11 rounded-xl transition-all duration-200 group ${
        active
          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
      } px-2.5 lg:px-3.5`}
    >
      {children}
      <span className="hidden lg:inline text-sm font-medium whitespace-nowrap">{label}</span>
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none lg:hidden">
        {label}
      </span>
    </button>
  );

  return (
    <>
      {/* Bottom floating pill nav */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 px-2 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 dark:border-gray-700/60">

          {/* Generator with dropdown */}
          <div ref={dropdownRef} className="relative">
            <PillButton
              active={currentPage === 'generator' || generatorDropdownOpen}
              onClick={() => setGeneratorDropdownOpen(!generatorDropdownOpen)}
              label="Generator"
            >
              <QrCode className="w-5 h-5" />
            </PillButton>

            {generatorDropdownOpen && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[26rem] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Quick Generate</p>
                </div>
                <div className="p-3 grid grid-cols-4 gap-1">
                  {topTypes.map(typeId => {
                    const config = qrTypeConfigs[typeId];
                    if (!config) return null;
                    const Icon = getTypeIcon(typeId);
                    return (
                      <button
                        key={typeId}
                        onClick={() => handleSelectType(typeId)}
                        className="flex flex-col items-center gap-1.5 p-2.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 flex items-center justify-center transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-medium text-center leading-tight">{config.name}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="border-t border-gray-100 dark:border-gray-700 p-2">
                  <button
                    onClick={() => { onNavigate('landing'); setGeneratorDropdownOpen(false); }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    <span>View all types</span>
                    <ChevronDown className="w-3.5 h-3.5 rotate-90" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-600" />

          {/* Nav items */}
          {navItems.map((item) => (
            <PillButton
              key={item.id}
              active={currentPage === item.id}
              onClick={() => handleNavClick(item.id)}
              label={item.label}
            >
              <item.icon className="w-5 h-5" />
            </PillButton>
          ))}

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-600" />

          {/* Language */}
          <div ref={langRef} className="relative">
            <PillButton
              active={langOpen}
              onClick={() => setLangOpen(!langOpen)}
              label="Language"
            >
              <Globe className="w-5 h-5" />
            </PillButton>

            {langOpen && (
              <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden p-1.5 min-w-[120px]">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { onLanguageChange(lang.code as Language); setLangOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      language === lang.code
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {lang.nativeLabel}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme */}
          <PillButton
            active={false}
            onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
            label={theme === 'light' ? 'Dark mode' : 'Light mode'}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </PillButton>
        </div>
      </div>
    </>
  );
};

export default Header;
