import React from 'react';
import { QRData, QRCodeOptions, Language } from '../types';
import QRPreview from './QRPreview';

interface SharedPageProps {
  qrData: QRData;
  qrOptions: QRCodeOptions;
  language: Language;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const SharedPage: React.FC<SharedPageProps> = ({ qrData, qrOptions, language, onToast }) => {
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      onToast('Link copied to clipboard', 'success');
    } catch (e) {
      onToast('Failed to copy link', 'error');
    }
  };

  const openInApp = () => {
    try {
      const newPath = window.location.pathname.replace('/shared', '') || '/';
      window.location.href = newPath + window.location.hash;
    } catch (e) {
      onToast('Unable to open app', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shared QR</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">This view is a minimal preview for shared QR links.</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyLink}
              className="px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200"
            >
              Copy Link
            </button>
            <button
              onClick={openInApp}
              className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-sm text-white"
            >
              Open in App
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <QRPreview qrData={qrData} qrOptions={qrOptions} language={language} onToast={onToast} />
        </div>
      </div>
    </div>
  );
};

export default SharedPage;
