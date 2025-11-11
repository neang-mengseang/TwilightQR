import { translations } from '../i18n/translations';
import { Language } from '../types';

/**
 * Translation utilities for multi-language support
 */

// Get current language from localStorage or default to English
export const getCurrentLanguage = (): Language => {
  const saved = localStorage.getItem('language') as Language;
  return saved && ['en', 'km'].includes(saved) ? saved : 'en';
};

// Set current language and save to localStorage
export const setCurrentLanguage = (language: Language): void => {
  localStorage.setItem('language', language);
  
  // Update document language attribute for accessibility
  document.documentElement.lang = language === 'km' ? 'km-KH' : 'en-US';
};

// Get translated text for a key
export const t = (key: string, language?: Language): string => {
  const lang = language || getCurrentLanguage();
  const translation = translations[key];
  
  if (!translation) {
    console.warn(`Translation key "${key}" not found`);
    return key;
  }
  
  return translation[lang] || translation.en || key;
};

// Get all available languages
export const getAvailableLanguages = () => [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'km', label: 'Khmer', nativeLabel: 'ខ្មែរ' }
];

// Format date according to current language
export const formatDate = (date: Date | string, language?: Language): string => {
  const lang = language || getCurrentLanguage();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return dateObj.toLocaleDateString(lang === 'km' ? 'km-KH' : 'en-US', options);
};

// Format numbers according to current language
export const formatNumber = (number: number, language?: Language): string => {
  const lang = language || getCurrentLanguage();
  return number.toLocaleString(lang === 'km' ? 'km-KH' : 'en-US');
};

// Get text direction for current language (for RTL support if needed)
export const getTextDirection = (_language?: Language): 'ltr' | 'rtl' => {
  // Khmer is LTR, but keeping this function for future RTL language support
  return 'ltr';
};