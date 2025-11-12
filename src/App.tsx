import React, { useState, useEffect } from 'react';
import { QRType, QRData, QRCodeOptions, Language, AppState } from './types';
import { getCurrentLanguage, setCurrentLanguage } from './utils/i18n';
import { validateQRData } from './utils/qrGenerators';
import { decodeHashToQR, updateUrlHash, getCurrentHash } from './utils/urlHash';
import Header from './components/Header';
import QRGeneratorPage from './components/QRGeneratorPage';
import LandingPage from './components/LandingPage';
import SocialPreview from './components/SocialPreview';
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

  // Current page state
  const [currentPage, setCurrentPage] = useState<'landing' | 'generator' | 'social'>('landing');

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

      // Check URL hash for routing and QR data
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
          
          // Check if it's a social preview or generator page
          const urlParams = new URLSearchParams(window.location.hash.slice(1));
          const qrType = urlParams.get('qr-type');
          const isPreviewPath = window.location.pathname.includes('/qr-preview');
          
          if (qrType && decoded.type === qrType && isPreviewPath) {
            setCurrentPage('social');
            showToast(`QR code loaded from URL: ${decoded.type}`, 'success');
          } else {
            setCurrentPage('generator');
          }
        }
      } else {
        // Check for direct QR type parameter
        const urlParams = new URLSearchParams(window.location.hash.slice(1));
        const qrType = urlParams.get('qr-type') as QRType;
        
        if (qrType) {
          handleQRTypeSelection(qrType);
        }
      }
    };

    initializeApp();

    // Listen for hash changes
    const handleHashChange = () => {
      const urlParams = new URLSearchParams(window.location.hash.slice(1));
      const qrType = urlParams.get('qr-type') as QRType;
      
      if (!qrType) {
        setCurrentPage('landing');
        return;
      }
      
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
          
          // Only show social preview if pathname includes '/qr-preview'
          const isPreviewPath = window.location.pathname.includes('/qr-preview');
          if (isPreviewPath) {
            setCurrentPage('social');
          } else {
            setCurrentPage('generator');
          }
        }
      } else {
        handleQRTypeSelection(qrType);
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

  // Handle QR type selection from landing page
  const handleQRTypeSelection = (type: QRType) => {
    // Create new QR data for the selected type
    const newQRData: QRData = { type } as QRData;
    
    setAppState(prev => ({
      ...prev,
      currentType: type,
      qrData: newQRData,
      generatedQRString: ''
    }));

    // Update URL to show the QR generator page
    window.location.hash = `qr-type=${type}`;
    setCurrentPage('generator');
    
    setValidationErrors([]);
  };

  // Handle back to landing page
  const handleBackToLanding = () => {
    window.location.hash = '';
    setCurrentPage('landing');
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

  // Render based on current page
  const renderCurrentPage = () => {
    if (currentPage === 'social' && appState.generatedQRString === 'from-url') {
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

    if (currentPage === 'generator') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
          <Header
            theme={appState.theme}
            language={appState.language}
            onThemeChange={handleThemeChange}
            onLanguageChange={handleLanguageChange}
          />
          <QRGeneratorPage
            qrType={appState.currentType}
            qrData={appState.qrData}
            qrOptions={appState.qrOptions}
            language={appState.language}
            validationErrors={validationErrors}
            onBack={handleBackToLanding}
            onDataChange={handleQRDataChange}
            onOptionsChange={handleQROptionsChange}
            onValidation={handleValidation}
            onReset={handleReset}
            onToast={showToast}
          />
          <Footer language={appState.language} />
        </div>
      );
    }

    // Default: Landing page
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
        <Header
          theme={appState.theme}
          language={appState.language}
          onThemeChange={handleThemeChange}
          onLanguageChange={handleLanguageChange}
        />
        <LandingPage
          onSelectQRType={handleQRTypeSelection}
          language={appState.language}
        />
        <Footer language={appState.language} />
      </div>
    );
  };

  return (
    <div>
      {renderCurrentPage()}
      
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