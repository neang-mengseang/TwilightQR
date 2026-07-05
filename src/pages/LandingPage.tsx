import React, { useState, useMemo, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QRType, Language } from '../types';
import { t } from '../utils/i18n';
import {
  Search, Filter, Sparkles, ArrowRight, QrCode, Zap, Shield, Download,
  Type, Link2, Mail, Phone, MessageSquare, Wifi, MapPin, Calendar, User,
  MessageCircle, Send, Facebook, Code, Instagram, Twitter, Music, Youtube,
  Linkedin, Camera, Gamepad2, Video, DollarSign, Bitcoin, Smartphone, Star,
  Gift, FileText, CreditCard, UtensilsCrossed, ScanLine, Layers, History,
  Palette, Check,
} from 'lucide-react';

interface LandingPageProps {
  onSelectQRType: (type: QRType) => void;
  onNavigate: (page: 'scanner' | 'batch' | 'history') => void;
  language: Language;
  theme: 'light' | 'dark';
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectQRType, onNavigate, language, theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [heroQrOpacity, setHeroQrOpacity] = useState(0);
  const heroQrRef = useRef<HTMLDivElement>(null);
  const heroQrInstance = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setHeroQrOpacity(1), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const isDark = theme === 'dark';
    const fgColor = isDark ? '#10b981' : '#059669';
    const bgColor = isDark ? '#1f2937' : '#ffffff';

    if (!heroQrInstance.current) {
      heroQrInstance.current = new QRCodeStyling({
        width: 256,
        height: 256,
        type: 'svg',
        data: window.location.href,
        margin: 8,
        qrOptions: { errorCorrectionLevel: 'M' },
        dotsOptions: { color: fgColor, type: 'rounded' },
        backgroundOptions: { color: bgColor },
        cornersSquareOptions: { color: fgColor, type: 'extra-rounded' },
        cornersDotOptions: { color: fgColor, type: 'dot' },
      });
    } else {
      heroQrInstance.current.update({
        data: window.location.href,
        dotsOptions: { color: fgColor, type: 'rounded' },
        backgroundOptions: { color: bgColor },
        cornersSquareOptions: { color: fgColor, type: 'extra-rounded' },
        cornersDotOptions: { color: fgColor, type: 'dot' },
      });
    }

    if (heroQrRef.current) {
      heroQrRef.current.innerHTML = '';
      heroQrInstance.current.append(heroQrRef.current);
      const svg = heroQrRef.current.querySelector('svg');
      if (svg) {
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.display = 'block';
      }
    }
  }, [theme]);

  const qrTypes = [
    { id: 'text' as QRType, icon: Type, category: 'basic', description: 'Plain text content' },
    { id: 'url' as QRType, icon: Link2, category: 'basic', description: 'Website or web link' },
    { id: 'custom' as QRType, icon: Code, category: 'basic', description: 'Custom data format' },
    { id: 'email' as QRType, icon: Mail, category: 'contact', description: 'Email address or message' },
    { id: 'phone' as QRType, icon: Phone, category: 'contact', description: 'Phone number for calling' },
    { id: 'sms' as QRType, icon: MessageSquare, category: 'contact', description: 'SMS text message' },
    { id: 'contact' as QRType, icon: User, category: 'contact', description: 'Contact information (vCard)' },
    { id: 'business-card' as QRType, icon: CreditCard, category: 'contact', description: 'Professional business card' },
    { id: 'whatsapp' as QRType, icon: MessageCircle, category: 'social', description: 'WhatsApp message' },
    { id: 'telegram' as QRType, icon: Send, category: 'social', description: 'Telegram message' },
    { id: 'messenger' as QRType, icon: Facebook, category: 'social', description: 'Facebook Messenger' },
    { id: 'discord' as QRType, icon: Gamepad2, category: 'social', description: 'Discord server/user' },
    { id: 'instagram' as QRType, icon: Instagram, category: 'social', description: 'Instagram profile' },
    { id: 'twitter' as QRType, icon: Twitter, category: 'social', description: 'Twitter/X profile' },
    { id: 'tiktok' as QRType, icon: Music, category: 'social', description: 'TikTok profile' },
    { id: 'youtube' as QRType, icon: Youtube, category: 'social', description: 'YouTube channel' },
    { id: 'linkedin' as QRType, icon: Linkedin, category: 'social', description: 'LinkedIn profile' },
    { id: 'facebook' as QRType, icon: Facebook, category: 'social', description: 'Facebook profile' },
    { id: 'snapchat' as QRType, icon: Camera, category: 'social', description: 'Snapchat profile' },
    { id: 'skype' as QRType, icon: Video, category: 'communication', description: 'Skype contact' },
    { id: 'zoom' as QRType, icon: Video, category: 'communication', description: 'Zoom meeting link' },
    { id: 'spotify' as QRType, icon: Music, category: 'entertainment', description: 'Spotify track/playlist' },
    { id: 'wifi' as QRType, icon: Wifi, category: 'connectivity', description: 'WiFi network credentials' },
    { id: 'location' as QRType, icon: MapPin, category: 'location', description: 'Geographic coordinates' },
    { id: 'event' as QRType, icon: Calendar, category: 'events', description: 'Calendar event details' },
    { id: 'paypal' as QRType, icon: DollarSign, category: 'payment', description: 'PayPal payment' },
    { id: 'venmo' as QRType, icon: DollarSign, category: 'payment', description: 'Venmo payment' },
    { id: 'bitcoin' as QRType, icon: Bitcoin, category: 'crypto', description: 'Bitcoin wallet address' },
    { id: 'ethereum' as QRType, icon: Bitcoin, category: 'crypto', description: 'Ethereum wallet address' },
    { id: 'app-store' as QRType, icon: Smartphone, category: 'apps', description: 'App Store app' },
    { id: 'play-store' as QRType, icon: Smartphone, category: 'apps', description: 'Google Play Store app' },
    { id: 'rating' as QRType, icon: Star, category: 'business', description: 'Business rating/review' },
    { id: 'review' as QRType, icon: Star, category: 'business', description: 'Review platform link' },
    { id: 'coupon' as QRType, icon: Gift, category: 'business', description: 'Discount coupon code' },
    { id: 'menu' as QRType, icon: UtensilsCrossed, category: 'business', description: 'Restaurant menu' },
    { id: 'pdf' as QRType, icon: FileText, category: 'documents', description: 'PDF document link' },
  ];

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
    { id: 'documents', name: 'Documents', icon: FileText },
  ];

  const filteredTypes = useMemo(() => {
    return qrTypes.filter(qrType => {
      const matchesSearch = qrType.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           qrType.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           t(qrType.id, language).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || qrType.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [qrTypes, searchTerm, selectedCategory, language]);

  const groupedTypes = useMemo(() => {
    const groups: Record<string, typeof qrTypes> = {};
    if (selectedCategory === 'all') {
      categories.forEach(cat => {
        if (cat.id !== 'all') groups[cat.id] = filteredTypes.filter(type => type.category === cat.id);
      });
    } else {
      groups[selectedCategory] = filteredTypes;
    }
    Object.keys(groups).forEach(key => { if (groups[key].length === 0) delete groups[key]; });
    return groups;
  }, [filteredTypes, selectedCategory, categories]);

  const heroFeatures = [
    { icon: Zap, title: 'Instant Generation', desc: 'Real-time QR preview as you type' },
    { icon: Palette, title: 'Full Customization', desc: 'Colors, patterns, logos, frames' },
    { icon: Shield, title: 'Privacy First', desc: 'Everything runs in your browser' },
    { icon: Download, title: 'Multi-Format Export', desc: 'PNG, SVG, JPEG, WebP, PDF' },
  ];

  const quickActions = [
    { icon: ScanLine, title: 'Scan QR Code', desc: 'Use your camera to read QR codes', page: 'scanner' as const },
    { icon: Layers, title: 'Batch Generate', desc: 'Create multiple QRs from CSV', page: 'batch' as const },
    { icon: History, title: 'History & Favorites', desc: 'Revisit your saved QR codes', page: 'history' as const },
  ];

  return (
    <div className="min-h-screen pb-24 bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Layered backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800" />
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute inset-0 hero-grid" />

        {/* Floating blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-300/20 dark:bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-200/25 dark:bg-emerald-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-200/15 dark:bg-teal-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />

        {/* Decorative corner accents */}
        <div className="absolute top-0 right-0 w-40 h-40 border-r-2 border-t-2 border-emerald-200/30 dark:border-emerald-700/20 rounded-tr-[3rem] rounded-bl-[3rem] m-4 hidden lg:block" />
        <div className="absolute bottom-0 left-0 w-40 h-40 border-l-2 border-b-2 border-emerald-200/30 dark:border-emerald-700/20 rounded-tr-[3rem] rounded-bl-[3rem] m-4 hidden lg:block" />

        <div className="relative container mx-auto px-4 py-16 md:py-28">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Hero Text */}
            <div className="text-center md:text-left animate-slide-up">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full text-sm font-medium text-emerald-700 dark:text-emerald-300 mb-6 ring-1 ring-emerald-200 dark:ring-emerald-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>36 QR types and counting</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
                Generate stunning
                <br />
                <span className="gradient-text">QR codes</span> in seconds
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
                A complete QR platform. Create, customize, scan, and batch-generate QR codes for any purpose. All in your browser, no signup needed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={() => {
                    const grid = document.getElementById('qr-types-grid');
                    grid?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-medium rounded-xl shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Start Creating</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('scanner')}
                  className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <ScanLine className="w-5 h-5" />
                  <span>Scan a QR</span>
                </button>
              </div>

              {/* Hero Features */}
              <div className="grid grid-cols-2 gap-4 mt-12">
                {heroFeatures.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <div key={feat.title} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg ring-1 ring-emerald-200/50 dark:ring-emerald-800/50">
                        <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{feat.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{feat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hero QR Demo */}
            <div className="flex justify-center md:justify-end animate-scale-in" style={{ opacity: heroQrOpacity, transition: 'opacity 0.6s ease' }}>
              <div className="relative float-card">
                {/* Glow behind card */}
                <div className="absolute -inset-4 bg-gradient-to-br from-emerald-400/30 to-teal-500/20 rounded-[2rem] blur-2xl animate-glow" />

                {/* Main card */}
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 shine-sweep">
                  {/* Top bar dots */}
                  <div className="flex items-center gap-1.5 mb-5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
                    <div className="ml-auto flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      live
                    </div>
                  </div>

                  {/* Real QR from current URL */}
                  <div className="w-64 h-64 rounded-2xl p-4 relative overflow-hidden ring-1 ring-gray-100 dark:ring-gray-700">
                    <div ref={heroQrRef} className="w-full h-full flex items-center justify-center" />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Live Preview</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Scans to this page</p>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg px-3 py-2 border border-gray-100 dark:border-gray-700 flex items-center gap-2 animate-float" style={{ animationDelay: '2s' }}>
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-gray-900 dark:text-white leading-none">PNG SVG PDF</p>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 leading-none mt-0.5">Export</p>
                  </div>
                </div>

                {/* Floating scan badge */}
                <div className="absolute -bottom-3 -left-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg px-3 py-2 border border-gray-100 dark:border-gray-700 flex items-center gap-2 animate-float" style={{ animationDelay: '0.8s' }}>
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                    <ScanLine className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-gray-900 dark:text-white leading-none">Scan Ready</p>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 leading-none mt-0.5">High ECC</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                onClick={() => onNavigate(action.page)}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 text-left transition-all duration-200 hover-lift hover:shadow-xl"
                >
                <div className="inline-flex p-3 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl shadow-lg mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{action.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{action.desc}</p>
                <div className="flex items-center space-x-1 mt-3 text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:space-x-2 transition-all">
                  <span>Open</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* QR Types Grid */}
      <section id="qr-types-grid" className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Choose your QR type
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {filteredTypes.length} of {qrTypes.length} types available
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search QR types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="lg:w-80 relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all appearance-none cursor-pointer"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Type Groups */}
          <div className="space-y-8">
            {Object.entries(groupedTypes).map(([categoryId, types]) => {
              const category = categories.find(cat => cat.id === categoryId);
              if (!category || types.length === 0) return null;
              const CategoryIcon = category.icon;
              return (
                <div key={categoryId} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl shadow-lg">
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{category.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{types.length} type{types.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {types.map((qrType) => {
                      const IconComponent = qrType.icon;
                      return (
                        <button
                          key={qrType.id}
                          onClick={() => onSelectQRType(qrType.id)}
                          className="group relative overflow-hidden rounded-xl p-5 text-left transition-all duration-200 hover-lift bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:shadow-lg"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg shadow-md">
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                            <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                          </div>
                          <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                            {t(qrType.id, language)}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{qrType.description}</p>
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
              <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No QR types found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Try adjusting your search or filter</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-3xl p-8 md:p-12 text-center shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '36', label: 'QR Types' },
              { value: '4', label: 'Export Formats' },
              { value: '100%', label: 'Client-side' },
              { value: 'Free', label: 'Forever' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-emerald-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
