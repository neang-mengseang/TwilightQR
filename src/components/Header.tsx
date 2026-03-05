import React from 'react';
import { Moon, Sun, Globe, QrCode } from 'lucide-react';
import { Language } from '../types';
import { t, getAvailableLanguages } from '../utils/i18n';

interface HeaderProps {
  theme: 'light' | 'dark';
  language: Language;
  onThemeChange: (theme: 'light' | 'dark') => void;
  onLanguageChange: (language: Language) => void;
}

const Header: React.FC<HeaderProps> = ({
  theme,
  language,
  onThemeChange,
  onLanguageChange
}) => {
  const languages = getAvailableLanguages();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-emerald-600 rounded-lg">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('appTitle', language)}
              </h1>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('appSubtitle', language)}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            
            {/* Language Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as Language)}
                className="appearance-none bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                         rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 dark:text-gray-300
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                         cursor-pointer"
                aria-label={t('language', language)}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeLabel}
                  </option>
                ))}
              </select>
              <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => onThemeChange(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600
                       text-gray-700 dark:text-gray-300 transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                       dark:focus:ring-offset-gray-800"
              aria-label={theme === 'light' ? t('darkMode', language) : t('lightMode', language)}
              title={theme === 'light' ? t('darkMode', language) : t('lightMode', language)}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;