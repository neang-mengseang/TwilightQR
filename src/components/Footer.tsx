import React from 'react';
import { Heart, Github, ExternalLink, Lock, Palette, Smartphone, Zap } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/i18n';

interface FooterProps {
  language: Language;
}

const Footer: React.FC<FooterProps> = ({ language }) => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          
          {/* Made with love */}
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <span>{t('madeWith', language)}</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/yourusername/qr-magic"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              title="View on GitHub"
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              title="Deploy on Vercel"
            >
              <span className="text-sm">Deploy</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Version */}
          <div className="text-sm text-gray-500 dark:text-gray-500">
            {t('version', language)}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-sm text-gray-500 dark:text-gray-500">
            <p className="mb-2">
              QR Magic is a free, open-source QR code generator that runs entirely in your browser.
            </p>
            <p>
              No data is sent to any server - your privacy is protected.
            </p>
          </div>
        </div>

        {/* Feature List */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex flex-col items-center text-center">
            <Lock className="w-5 h-5 mb-1.5 text-emerald-500" />
            <div className="font-medium mb-0.5">Privacy First</div>
            <div className="text-xs">No server required</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <Palette className="w-5 h-5 mb-1.5 text-emerald-500" />
            <div className="font-medium mb-0.5">Customizable</div>
            <div className="text-xs">Colors, size, logo</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <Smartphone className="w-5 h-5 mb-1.5 text-emerald-500" />
            <div className="font-medium mb-0.5">Responsive</div>
            <div className="text-xs">Works on all devices</div>
          </div>
          <div className="flex flex-col items-center text-center">
            <Zap className="w-5 h-5 mb-1.5 text-emerald-500" />
            <div className="font-medium mb-0.5">Fast</div>
            <div className="text-xs">Instant generation</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;