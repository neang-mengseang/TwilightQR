import React, { useState, useEffect } from 'react';
import { QRType, QRData, QRCodeOptions, Language, AppState } from './types';
import { getCurrentLanguage, setCurrentLanguage } from './utils/i18n';
import { validateQRData } from './utils/qrGenerators';
import { decodeHashToQR, updateUrlHash, getCurrentHash } from './utils/urlHash';
import { addToHistory } from './utils/history';
import Header, { Page } from './components/Header';
import QRGeneratorPage from './pages/QRGeneratorPage';
import LandingPage from './pages/LandingPage';
import ScannerPage from './pages/ScannerPage';
import BatchPage from './pages/BatchPage';
import HistoryPage from './pages/HistoryPage';
import SocialPreview from './components/SocialPreview';
import SharedPage from './pages/SharedPage';
import Footer from './components/Footer';
import Toast from './components/Toast';
import UpdatePrompt from './components/UpdatePrompt';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    currentType: 'text',
    qrData: { type: 'text', text: '' },
    qrOptions: {
      size: 300,
      errorCorrectionLevel: 'M',
      foregroundColor: '#000000',
      backgroundColor: '#ffffff',
      margin: 4,
      transparentBackground: false
    },
    theme: 'light',
    language: 'en',
    generatedQRString: 'idle'
  });

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    show: boolean;
  }>({
    message: '',
    type: 'info',
    show: false
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  useEffect(() => {
    const initializeApp = () => {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      const theme = savedTheme || 'light';
      setAppState(prev => ({ ...prev, theme }));
      document.documentElement.classList.toggle('dark', theme === 'dark');

      const savedLanguage = getCurrentLanguage();
      setAppState(prev => ({ ...prev, language: savedLanguage }));

      const savedOptions = localStorage.getItem('qrOptions');
      if (savedOptions) {
        try {
          const options = JSON.parse(savedOptions);
          setAppState(prev => ({ ...prev, qrOptions: { ...prev.qrOptions, ...options } }));
        } catch (error) {
          console.warn('Failed to parse saved QR options:', error);
        }
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

          const isPreviewPath = window.location.pathname.includes('/qr-preview');
          if (isPreviewPath) {
            setCurrentPage('social');
          } else if (window.location.pathname.includes('/shared')) {
            setCurrentPage('shared');
          } else {
            setCurrentPage('generator');
          }
        }
      }
    };

    initializeApp();

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

          const isPreviewPath = window.location.pathname.includes('/qr-preview');
          if (isPreviewPath) {
            setCurrentPage('social');
          } else if (window.location.pathname.includes('/shared')) {
            setCurrentPage('shared');
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

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setAppState(prev => ({ ...prev, theme }));
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };

  const handleLanguageChange = (language: Language) => {
    setAppState(prev => ({ ...prev, language }));
    setCurrentLanguage(language);
  };

  const handleNavigate = (page: Page) => {
    if (page === 'landing') {
      window.location.hash = '';
    }
    setCurrentPage(page);
  };

  const handleQRTypeSelection = (type: QRType) => {
    const newQRData: QRData = { type } as QRData;

    setAppState(prev => ({
      ...prev,
      currentType: type,
      qrData: newQRData,
      generatedQRString: 'idle'
    }));

    window.location.hash = `qr-type=${type}`;
    setCurrentPage('generator');
    setValidationErrors([]);
  };

  const handleBackToLanding = () => {
    window.location.hash = '';
    setCurrentPage('landing');
  };

  const handleQRDataChange = (data: Partial<QRData>) => {
    const newQRData = { ...appState.qrData, ...data } as QRData;

    setAppState(prev => ({
      ...prev,
      qrData: newQRData
    }));

    updateUrlHash(newQRData);

    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }

    const validation = validateQRData(newQRData);
    if (validation.isValid) {
      setAppState(prev => ({ ...prev, generatedQRString: 'valid' }));
    }
  };

  const handleSaveToHistory = () => {
    const validation = validateQRData(appState.qrData);
    if (validation.isValid) {
      addToHistory(appState.qrData, appState.qrOptions);
    }
  };

  const handleQROptionsChange = (options: Partial<QRCodeOptions>) => {
    const newOptions = { ...appState.qrOptions, ...options };

    setAppState(prev => ({
      ...prev,
      qrOptions: newOptions
    }));

    localStorage.setItem('qrOptions', JSON.stringify(newOptions));
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type, show: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const handleValidation = (errors: string[]) => {
    setValidationErrors(errors);
    if (errors.length > 0) {
      showToast(errors[0], 'error');
    }
  };

  const handleReset = () => {
    const resetData: QRData = { type: appState.currentType } as QRData;

    setAppState(prev => ({
      ...prev,
      qrData: resetData,
      generatedQRString: 'idle'
    }));

    setValidationErrors([]);
    showToast('Form reset successfully', 'success');
  };

  const renderCurrentPage = () => {
    if (currentPage === 'social' && appState.generatedQRString === 'from-url') {
      return (
        <div className="min-h-screen pb-24 bg-gradient-to-br from-gray-50 via-emerald-50 to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
          <Header
            theme={appState.theme}
            language={appState.language}
            currentPage={currentPage}
            onThemeChange={handleThemeChange}
            onLanguageChange={handleLanguageChange}
            onNavigate={handleNavigate}
          onSelectQRType={handleQRTypeSelection}
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

    if (currentPage === 'shared') {
      return (
        <SharedPage qrData={appState.qrData} qrOptions={appState.qrOptions} language={appState.language} onToast={showToast} />
      );
    }

    if (currentPage === 'scanner') {
      return (
        <div className="min-h-screen pb-24 bg-gradient-to-br from-gray-50 via-emerald-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
          <Header
            theme={appState.theme}
            language={appState.language}
            currentPage={currentPage}
            onThemeChange={handleThemeChange}
            onLanguageChange={handleLanguageChange}
            onNavigate={handleNavigate}
          onSelectQRType={handleQRTypeSelection}
          />
          <ScannerPage language={appState.language} onToast={showToast} />
          <Footer language={appState.language} />
        </div>
      );
    }

    if (currentPage === 'batch') {
      return (
        <div className="min-h-screen pb-24 bg-gradient-to-br from-gray-50 via-emerald-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
          <Header
            theme={appState.theme}
            language={appState.language}
            currentPage={currentPage}
            onThemeChange={handleThemeChange}
            onLanguageChange={handleLanguageChange}
            onNavigate={handleNavigate}
          onSelectQRType={handleQRTypeSelection}
          />
          <BatchPage language={appState.language} onToast={showToast} />
          <Footer language={appState.language} />
        </div>
      );
    }

    if (currentPage === 'history') {
      return (
        <div className="min-h-screen pb-24 bg-gradient-to-br from-gray-50 via-emerald-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
          <Header
            theme={appState.theme}
            language={appState.language}
            currentPage={currentPage}
            onThemeChange={handleThemeChange}
            onLanguageChange={handleLanguageChange}
            onNavigate={handleNavigate}
          onSelectQRType={handleQRTypeSelection}
          />
          <HistoryPage
            language={appState.language}
            onToast={showToast}
            onSelectQRType={handleQRTypeSelection}
          />
          <Footer language={appState.language} />
        </div>
      );
    }

    if (currentPage === 'generator') {
      return (
        <div className="min-h-screen pb-24 bg-gradient-to-br from-gray-50 via-emerald-50 to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
          <Header
            theme={appState.theme}
            language={appState.language}
            currentPage={currentPage}
            onThemeChange={handleThemeChange}
            onLanguageChange={handleLanguageChange}
            onNavigate={handleNavigate}
          onSelectQRType={handleQRTypeSelection}
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
            onSaveToHistory={handleSaveToHistory}
            onSelectQRType={handleQRTypeSelection}
          />
          <Footer language={appState.language} />
        </div>
      );
    }

    return (
      <div className="min-h-screen pb-24 bg-gradient-to-br from-gray-50 via-emerald-50 to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300">
        <Header
          theme={appState.theme}
          language={appState.language}
          currentPage={currentPage}
          onThemeChange={handleThemeChange}
          onLanguageChange={handleLanguageChange}
          onNavigate={handleNavigate}
        onSelectQRType={handleQRTypeSelection}
        />
        <LandingPage
          onSelectQRType={handleQRTypeSelection}
          onNavigate={handleNavigate}
          language={appState.language}
          theme={appState.theme}
        />
        <Footer language={appState.language} />
      </div>
    );
  };

  return (
    <div>
      {renderCurrentPage()}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onHide={hideToast}
      />
      <UpdatePrompt />
    </div>
  );
};

export default App;
