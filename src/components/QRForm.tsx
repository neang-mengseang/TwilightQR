import React from 'react';
import { RotateCcw } from 'lucide-react';
import { QRType, QRData, Language } from '../types';
import { qrTypeConfigs } from '../utils/qrTypes';
import { t } from '../utils/i18n';
import FormField from './FormField';

interface QRFormProps {
  currentType: QRType;
  qrData: QRData;
  language: Language;
  validationErrors: string[];
  onTypeChange: (type: QRType) => void;
  onDataChange: (data: Partial<QRData>) => void;
  onValidation: (errors: string[]) => void;
  onReset: () => void;
}

const QRForm: React.FC<QRFormProps> = ({
  currentType,
  qrData,
  language,
  validationErrors,
  onTypeChange,
  onDataChange,
  onReset
}) => {
  const currentConfig = qrTypeConfigs[currentType];

  const handleFieldChange = (fieldName: string, value: any) => {
    onDataChange({ [fieldName]: value });
  };

  return (
    <div className="card p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
          {t('qrType', language)}
        </h2>
        <button
          onClick={onReset}
          className="btn-secondary inline-flex items-center space-x-2 text-sm"
          title={t('reset', language)}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('reset', language)}</span>
        </button>
      </div>

      {/* Type Description */}
      <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          {currentConfig.name}
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {currentConfig.description}
        </p>
      </div>

      {/* Dynamic Form Fields */}
      <div className="space-y-4">
        {currentConfig.fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={(qrData as any)[field.name] || ''}
            onChange={(value: any) => handleFieldChange(field.name, value)}
            language={language}
            error={validationErrors.find(err => err.includes(field.label))}
          />
        ))}
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <h4 className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">
            {t('invalidInput', language)}
          </h4>
          <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-2">
          💡 {t('text', language)} {t('text', language)}
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          {currentType === 'wifi' && 'Users can scan this QR code to automatically connect to your Wi-Fi network.'}
          {currentType === 'url' && 'Scanning this QR code will open the website in the default browser.'}
          {currentType === 'email' && 'This QR code will open the email app with pre-filled recipient and content.'}
          {currentType === 'phone' && 'Scanning will prompt to call the phone number.'}
          {currentType === 'sms' && 'This will open the messaging app with pre-filled recipient and message.'}
          {currentType === 'location' && 'Users can scan to view the location in their maps app.'}
          {currentType === 'contact' && 'This creates a vCard that can be saved to contacts.'}
          {currentType === 'event' && 'Scanning will prompt to add the event to calendar.'}
          {currentType === 'text' && 'Simple text QR code that displays the content when scanned.'}
          {(currentType === 'whatsapp' || currentType === 'telegram' || currentType === 'messenger') && 'This will open the messaging app with pre-filled contact.'}
          {currentType === 'custom' && 'Enter any text or data format. Advanced users can input vCard, vEvent, or other structured data.'}
        </p>
      </div>
    </div>
  );
};

export default QRForm;