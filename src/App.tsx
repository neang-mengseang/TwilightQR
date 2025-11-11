import React, { useState, useEffect } from 'react';
import { QRType, QRData, QRCodeOptions, Language, AppState } from './types';
import { getCurrentLanguage, setCurrentLanguage } from './utils/i18n';
import { validateQRData } from './utils/qrGenerators';
import { decodeHashToQR, updateUrlHash, getCurrentHash } from './utils/urlHash';
import Header from './components/Header';
import QRForm from './components/QRForm';
import QRPreview from './components/QRPreview';
import SocialPreview from './components/SocialPreview';
import QRCustomization from './components/QRCustomization';
import QRTypeSelector from './components/QRTypeSelector';
import Footer from './components/Footer';
import Toast from './components/Toast';


/**
 * Main App Component
 * Manages the global state and coordinates all child components
 */

const App: React.FC = () => {
  // Global app state
  const [appState, setAppState] = useState<AppState>({
    currentType: 'text',
    qrData: { type: 'text', text: '' },
    qrOptions: {
      size: 300, // Fixed preview size
      errorCorrectionLevel: 'M',
      foregroundColor: '#000000',
      backgroundColor: '#ffffff',
      margin: 4,
      transparentBackground: false
    },
    theme: 'light',
    language: 'en',
    generatedQRString: ''
  });

  // Toast notifications
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    show: boolean;
  }>({
    message: '',
    type: 'info',
    show: false
  });

  // Form validation state
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Layout state
  const [customizationExpanded, setCustomizationExpanded] = useState(true);

  // Initialize app state from localStorage and URL hash
  useEffect(() => {
    const initializeApp = () => {
      // Theme
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      if (savedTheme) {
        setAppState(prev => ({ ...prev, theme: savedTheme }));
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setAppState(prev => ({ ...prev, theme: 'dark' }));
        document.documentElement.classList.add('dark');
      }

      // Language
      const savedLanguage = getCurrentLanguage();
      setAppState(prev => ({ ...prev, language: savedLanguage }));

      // QR Options
      const savedOptions = localStorage.getItem('qrOptions');
      if (savedOptions) {
        try {
          const options = JSON.parse(savedOptions);
          setAppState(prev => ({ ...prev, qrOptions: { ...prev.qrOptions, ...options } }));
        } catch (error) {
          console.warn('Failed to parse saved QR options:', error);
        }
      }

      // Check URL hash for QR data
      const currentHash = getCurrentHash();
      if (currentHash) {
        const decoded = decodeHashToQR(currentHash);
        if (decoded) {
          setAppState(prev => ({
            ...prev,
            currentType: decoded.type,
            qrData: decoded.data as QRData,
            generatedQRString: 'from-url'
          }));
          showToast(`QR code loaded from URL: ${decoded.type}`, 'success');
        }
      }
    };

    initializeApp();

    // Listen for hash changes
    const handleHashChange = () => {
      const currentHash = getCurrentHash();
      if (currentHash) {
        const decoded = decodeHashToQR(currentHash);
        if (decoded) {
          setAppState(prev => ({
            ...prev,
            currentType: decoded.type,
            qrData: decoded.data as QRData,
            generatedQRString: 'from-url'
          }));
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle theme change
  const handleThemeChange = (theme: 'light' | 'dark') => {
    setAppState(prev => ({ ...prev, theme }));
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };

  // Handle language change
  const handleLanguageChange = (language: Language) => {
    setAppState(prev => ({ ...prev, language }));
    setCurrentLanguage(language);
  };

  // Handle QR type change
  const handleQRTypeChange = (type: QRType) => {
    // Reset form data when type changes
    const newQRData: QRData = { type } as QRData;
    
    setAppState(prev => ({
      ...prev,
      currentType: type,
      qrData: newQRData,
      generatedQRString: ''
    }));

    // Update URL hash
    updateUrlHash(newQRData);
    
    setValidationErrors([]);
  };

  // Handle form data change
  const handleQRDataChange = (data: Partial<QRData>) => {
    const newQRData = { ...appState.qrData, ...data } as QRData;
    
    setAppState(prev => ({
      ...prev,
      qrData: newQRData
    }));

    // Update URL hash
    updateUrlHash(newQRData);

    // Clear validation errors when user types
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }

    // Auto-generate QR if data is valid
    const validation = validateQRData(newQRData);
    if (validation.isValid) {
      // We'll generate the QR string in the QRPreview component
      setAppState(prev => ({ ...prev, generatedQRString: 'valid' }));
    }
  };

  // Handle QR customization options change
  const handleQROptionsChange = (options: Partial<QRCodeOptions>) => {
    const newOptions = { ...appState.qrOptions, ...options };
    
    setAppState(prev => ({
      ...prev,
      qrOptions: newOptions
    }));

    // Save to localStorage
    localStorage.setItem('qrOptions', JSON.stringify(newOptions));
  };

  // Show toast notification
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, show: true });
  };

  // Hide toast notification
  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  // Handle form validation
  const handleValidation = (errors: string[]) => {
    setValidationErrors(errors);
    if (errors.length > 0) {
      showToast(errors[0], 'error');
    }
  };

  // Reset form
  const handleReset = () => {
    const resetData: QRData = { type: appState.currentType } as QRData;
    
    setAppState(prev => ({
      ...prev,
      qrData: resetData,
      generatedQRString: ''
    }));
    
    setValidationErrors([]);
    showToast('Form reset successfully', 'success');
  };

  // If loaded from URL hash, show SocialPreview only
  if (appState.generatedQRString === 'from-url') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
        <Header
          theme={appState.theme}
          language={appState.language}
          onThemeChange={handleThemeChange}
          onLanguageChange={handleLanguageChange}
        />
        <main className="container mx-auto px-4 py-6">
          <SocialPreview
            qrData={appState.qrData}
            qrOptions={appState.qrOptions}
            language={appState.language}
          />
        </main>
        <Footer language={appState.language} />
      </div>
    );
  }

  // Default: full dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
      {/* Header */}
      <Header
        theme={appState.theme}
        language={appState.language}
        onThemeChange={handleThemeChange}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main Dashboard Layout */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Responsive layout: Mobile vertical, Desktop grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Type Selector (Desktop) */}
            <div className="lg:col-span-3">
              <QRTypeSelector
                selectedType={appState.currentType}
                onTypeChange={handleQRTypeChange}
                language={appState.language}
              />
            </div>

            {/* Main Content - Form and Customization */}
            <div className="lg:col-span-5 space-y-6">
              <QRForm
                qrData={appState.qrData}
                currentType={appState.currentType}
                language={appState.language}
                validationErrors={validationErrors}
                onTypeChange={handleQRTypeChange}
                onDataChange={handleQRDataChange}
                onValidation={handleValidation}
                onReset={handleReset}
              />

              {/* Customization Panel - Always visible on desktop */}
              <div className="lg:block">
                <QRCustomization
                  options={appState.qrOptions}
                  language={appState.language}
                  onChange={handleQROptionsChange}
                />
              </div>

              {/* Mobile customization toggle */}
              <div className="flex justify-center lg:hidden">
                <button
                  onClick={() => setCustomizationExpanded(!customizationExpanded)}
                  className="px-4 py-2 text-sm bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                >
                  {customizationExpanded ? 'Hide' : 'Show'} Customization
                </button>
              </div>

              {/* Mobile customization panel */}
              {customizationExpanded && (
                <div className="lg:hidden">
                  <QRCustomization
                    options={appState.qrOptions}
                    language={appState.language}
                    onChange={handleQROptionsChange}
                  />
                </div>
              )}
            </div>

            {/* Right Sidebar - Preview (Sticky on desktop) */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-6">
                <QRPreview
                  qrData={appState.qrData}
                  qrOptions={appState.qrOptions}
                  language={appState.language}
                  onToast={showToast}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {appState.currentType.toUpperCase()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Current QR Type
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {validationErrors.length === 0 ? 'Valid' : 'Invalid'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Data Status
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {appState.qrOptions.size}px
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Preview Size
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer language={appState.language} />

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onHide={hideToast}
      />
    </div>
  );
};

export default App;