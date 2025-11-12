import React from 'react';
import { QRType, QRData, QRCodeOptions, Language } from '../types';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { t } from '../utils/i18n';
import QRForm from './QRForm';
import QRPreview from './QRPreview';
import QRCustomization from './QRCustomization';

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
  onToast
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header with Back Button */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center space-x-3 px-6 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 group"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Back to QR Types
                </span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {t(qrType, language)} QR Code
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Create and customize your QR code
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left Column - Form and Customization */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* QR Content Form */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        QR Content
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Enter the content for your {t(qrType, language)} QR code
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <QRForm
                    qrData={qrData}
                    currentType={qrType}
                    language={language}
                    validationErrors={validationErrors}
                    onTypeChange={() => {}} // Type is fixed in subpage
                    onDataChange={onDataChange}
                    onValidation={onValidation}
                    onReset={onReset}
                  />
                </div>
              </div>

              {/* Customization */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Customization
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Personalize your QR code appearance
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <QRCustomization
                    options={qrOptions}
                    language={language}
                    onChange={onOptionsChange}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Preview (Sticky) */}
            <div className="xl:col-span-1">
              <div className="sticky top-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                          Live Preview
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Real-time QR code preview
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <QRPreview
                      qrData={qrData}
                      qrOptions={qrOptions}
                      language={language}
                      onToast={onToast}
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Actions
                  </h3>
                  
                  <div className="space-y-3">
                    <button
                      onClick={onReset}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                      Reset Form
                    </button>
                    
                    <button
                      onClick={() => window.history.pushState({}, '', '/')}
                      className="w-full px-4 py-3 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors font-medium"
                    >
                      Create New QR
                    </button>
                  </div>
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