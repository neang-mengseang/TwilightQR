import React from 'react';
import { QRData, QRCodeOptions, Language } from '../types';
import QRPreview from './QRPreview';

interface SocialPreviewProps {
  qrData: QRData;
  qrOptions: QRCodeOptions;
  language: Language;
}

const SocialPreview: React.FC<SocialPreviewProps> = ({ qrData, qrOptions, language }) => {
  // Only show if qrData is valid and has content
  if (!qrData || !qrData.type || (qrData.type === 'text' && !qrData.text)) {
    return null;
  }
  // Provide a no-op onToast handler for QRPreview
  const noopToast = () => {};
  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      <h2 className="text-xl font-bold mb-4">Social QR Preview</h2>
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <QRPreview qrData={qrData} qrOptions={qrOptions} language={language} onToast={noopToast} />
      </div>
      <div className="mt-2 text-gray-500 text-sm">Share this QR code with your friends!</div>
    </div>
  );
};

export default SocialPreview;
