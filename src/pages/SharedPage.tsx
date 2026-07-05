import React, { useRef, useEffect, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { QRData, QRCodeOptions, Language } from '../types';
import { decodeHashToQR, createShareableUrl, getCurrentHash } from '../utils/urlHash';
import { generateQRString, validateQRData } from '../utils/qrGenerators';
import { Copy, Share2, Link, Check, Sun, Moon, Maximize, Minimize } from 'lucide-react';

interface SharedPageProps {
  qrData: QRData;
  qrOptions: QRCodeOptions;
  language: Language;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const SharedPage: React.FC<SharedPageProps> = ({ qrData, qrOptions, language, onToast }) => {
  const qrCanvasRef = useRef<HTMLDivElement | null>(null);
  const [qrInstance, setQrInstance] = useState<QRCodeStyling | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
    } catch {
      return false;
    }
  });
  const [metaTitle, setMetaTitle] = useState<string | undefined>(undefined);
  const [metaDescription, setMetaDescription] = useState<string | undefined>(undefined);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const decodeFromUrl = (): QRData | null => {
    const currentHash = getCurrentHash();
    if (!currentHash) return null;
    const decoded = decodeHashToQR(currentHash);
    return decoded ? (decoded.data as QRData) : null;
  };

  useEffect(() => {
    const dataFromUrl = decodeFromUrl();
    const data = dataFromUrl || qrData;

    setMetaTitle((data as any).title);
    setMetaDescription((data as any).description);

    const validation = validateQRData(data);
    if (!validation.isValid) return;

    const str = generateQRString(data);
    const size = isFullscreen ? 900 : 360;

    if (!qrInstance) {
      const instance = new QRCodeStyling({
        width: size,
        height: size,
        type: 'svg',
        data: str,
        margin: 4,
        qrOptions: { errorCorrectionLevel: 'M' },
        dotsOptions: { color: '#000', type: 'rounded' },
        backgroundOptions: { color: '#ffffff' }
      });
      setQrInstance(instance);
      if (qrCanvasRef.current) {
        qrCanvasRef.current.innerHTML = '';
        instance.append(qrCanvasRef.current);
      }
    } else {
      qrInstance.update({ data: str, width: size, height: size });
      if (qrCanvasRef.current) {
        qrCanvasRef.current.innerHTML = '';
        qrInstance.append(qrCanvasRef.current);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrData, isFullscreen]);

  const copyLink = async () => {
    try {
      const url = window.location.href || createShareableUrl(qrData);
      await navigator.clipboard.writeText(url);
      // show transient check icon instead of toast
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 1500);
    } catch (e) {
      onToast('Failed to copy link', 'error');
    }
  };

  const handleShareNative = async () => {
    try {
      const url = window.location.href || createShareableUrl(qrData);
      if (navigator.share) {
        await navigator.share({ title: `QR - ${qrData.type}`, url });
        onToast('Shared', 'success');
      } else {
        await navigator.clipboard.writeText(url);
        onToast('Link copied to clipboard', 'info');
      }
    } catch (e) {
      onToast('Share failed', 'error');
    }
  };

  const enterFullscreen = async () => {
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) await el.requestFullscreen();
      else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen();
      setIsFullscreen(true);
      if (qrInstance) {
        qrInstance.update({ width: 900, height: 900 });
        if (qrCanvasRef.current) {
          qrCanvasRef.current.innerHTML = '';
          qrInstance.append(qrCanvasRef.current);
        }
      }
    } catch (err) {
      console.warn('Fullscreen not available', err);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) await document.exitFullscreen();
      else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
      setIsFullscreen(false);
      if (qrInstance) {
        qrInstance.update({ width: 360, height: 360 });
        if (qrCanvasRef.current) {
          qrCanvasRef.current.innerHTML = '';
          qrInstance.append(qrCanvasRef.current);
        }
      }
    } catch (err) {
      console.warn('Exit fullscreen failed', err);
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      const fs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreen(fs);
      if (qrInstance) {
        const size = fs ? 900 : 360;
        qrInstance.update({ width: size, height: size });
        if (qrCanvasRef.current) {
          qrCanvasRef.current.innerHTML = '';
          qrInstance.append(qrCanvasRef.current);
        }
      }
    };

    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange as any);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange as any);
    };
  }, [qrInstance]);

  // Apply initial theme on mount so QR reflects it immediately
  useEffect(() => {
    try {
      document.documentElement.classList.toggle('dark', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch { /* ignore */ }
    // run once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Theme toggle (uses lifted state so QR can react)
  const ThemeToggle: React.FC<{ isDark: boolean; setIsDark: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isDark, setIsDark }) => {
    useEffect(() => {
      try {
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      } catch { /* ignore */ }
    }, [isDark]);

    return (
      <button
        onClick={() => setIsDark(d => !d)}
        aria-label="Toggle theme"
        title="Toggle theme"
        className="inline-flex items-center p-2 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow"
      >
        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>
    );
  };

  // Update QR instance colors when theme changes
  useEffect(() => {
    if (!qrInstance) return;
    const dotColor = isDark ? '#ffffff' : '#000000';
    const bgColor = isDark ? '#0f172a' : '#ffffff';
    try {
      qrInstance.update({ dotsOptions: { color: dotColor }, backgroundOptions: { color: bgColor } });
      if (qrCanvasRef.current) {
        qrCanvasRef.current.innerHTML = '';
        qrInstance.append(qrCanvasRef.current);
      }
    } catch (e) {
      // ignore
    }
  }, [isDark, qrInstance]);

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 z-50">
        <button
          onClick={exitFullscreen}
          aria-label="Exit fullscreen"
          className="absolute top-4 right-4 inline-flex items-center p-2 rounded-md bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-800 dark:text-emerald-200"
        >
          <Minimize className="w-5 h-5" />
        </button>

        <div className="text-center mb-6 px-4">
          <h1 className="text-3xl font-bold text-emerald-700 dark:text-emerald-200">{metaTitle || qrData.type.toUpperCase()}</h1>
          {metaDescription && (
            <p className="mt-2 text-lg text-emerald-600 dark:text-emerald-300">{metaDescription}</p>
          )}
        </div>

        <div className="flex items-center justify-center">
          <div className="p-6 rounded-xl shadow-2xl" style={{ background: isDark ? '#06121a' : '#ffffff' }}>
            <div ref={qrCanvasRef} style={{ width: 900, height: 900, boxShadow: isDark ? '0 10px 40px rgba(8,145,110,0.18)' : '0 10px 40px rgba(4,120,87,0.12)' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-gray-50 via-emerald-50 to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-300 flex flex-col items-center justify-center py-8 px-4">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shared QR</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">This view is optimized for sharing — scan, copy, or download the QR.</p>
          </div>

          <div className="w-full sm:w-auto flex flex-wrap items-center gap-2 justify-start sm:justify-end mt-3 sm:mt-0">
            <button
              onClick={copyLink}
              aria-label="Copy shareable link"
              className="inline-flex items-center space-x-2 px-2 sm:px-3 py-1 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 shadow"
            >
              {copySuccess ? <Check className="w-4 h-4 text-emerald-600" /> : <Link className="w-4 h-4" />}
              <span className="hidden sm:inline">{copySuccess ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleShareNative}
              aria-label="Share link"
              className="inline-flex items-center px-2 sm:px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-sm text-white shadow"
            >
              <Share2 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={() => (isFullscreen ? exitFullscreen() : enterFullscreen())}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              className="inline-flex items-center p-2 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            <ThemeToggle isDark={isDark} setIsDark={setIsDark} />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{metaTitle || qrData.type.toUpperCase()}</h2>
              {metaDescription ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">{metaDescription}</p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">Scan this QR code or use the actions below</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center pb-4">
            <div ref={qrCanvasRef} style={{ width: 360, height: 360 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedPage;
