import React, { useState, useRef, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import {
  ScanLine,
  Camera,
  CameraOff,
  Copy,
  ExternalLink,
  RefreshCw,
  Upload,
  SwitchCamera,
  CheckCircle,
} from 'lucide-react';
import { Language } from '../types';

interface ScannerPageProps {
  language: Language;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

interface CameraDevice {
  deviceId: string;
  label: string;
}

declare global {
  interface Window {
    BarcodeDetector?: new (options?: { formats: string[] }) => {
      detect: (source: CanvasImageSource) => Promise<{ rawValue: string }[]>;
    };
  }
}

const ScannerPage: React.FC<ScannerPageProps> = ({ onToast }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const scanningRef = useRef(false);

  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isStarting, setIsStarting] = useState(false);

  const stopStream = useCallback(() => {
    scanningRef.current = false;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const detectQR = (canvas: HTMLCanvasElement): string | null => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    });
    return code?.data ?? null;
  };

  const scanLoop = useCallback(async () => {
    if (!scanningRef.current || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        let detected: string | null = null;
        try {
          if ('BarcodeDetector' in window && window.BarcodeDetector) {
            const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
            const codes = await detector.detect(canvas);
            if (codes.length > 0) detected = codes[0].rawValue;
          }
        } catch {
          // fall through to jsQR
        }

        if (!detected) {
          detected = detectQR(canvas);
        }

        if (detected) {
          scanningRef.current = false;
          setIsScanning(false);
          setResult(detected);
          onToast('QR code detected', 'success');
          stopStream();
          return;
        }
      }
    }

    rafRef.current = requestAnimationFrame(scanLoop);
  }, [onToast, stopStream]);

  const startCamera = useCallback(
    async (deviceId?: string, mode?: 'environment' | 'user') => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera API is not supported in this browser.');
        onToast('Camera API is not supported in this browser.', 'error');
        return;
      }

      setIsStarting(true);
      setError('');

      stopStream();

      const constraints: MediaStreamConstraints = {
        video: deviceId
          ? { deviceId: { exact: deviceId } }
          : { facingMode: mode ?? facingMode },
      };

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setIsScanning(true);
        scanningRef.current = true;
        setResult('');
        rafRef.current = requestAnimationFrame(scanLoop);
      } catch (err) {
        const name = (err as DOMException)?.name;
        if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
          setError('Camera permission was denied. Please allow camera access and try again.');
          onToast('Camera permission denied', 'error');
        } else if (name === 'NotFoundError' || name === 'OverconstrainedError') {
          setError('No camera was found on this device.');
          onToast('No camera found', 'error');
        } else {
          setError('Unable to access the camera. Please try again.');
          onToast('Unable to access camera', 'error');
        }
      } finally {
        setIsStarting(false);
      }
    },
    [facingMode, onToast, scanLoop, stopStream],
  );

  const refreshCameraList = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices
        .filter((d) => d.kind === 'videoinput')
        .map((d, i) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${i + 1}`,
        }));
      setCameras(videoDevices);
      if (videoDevices.length > 0 && !selectedCameraId) {
        setSelectedCameraId(videoDevices[0].deviceId);
      }
    } catch {
      // ignore enumeration errors
    }
  }, [selectedCameraId]);

  useEffect(() => {
    refreshCameraList();
    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (streamRef.current) {
      refreshCameraList();
    }
  }, [streamRef.current, refreshCameraList]);

  const handleStartStop = () => {
    if (isScanning) {
      stopStream();
      setIsScanning(false);
    } else {
      startCamera(selectedCameraId || undefined);
    }
  };

  const handleSwitchCamera = () => {
    const next: 'environment' | 'user' = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(next);
    if (isScanning) {
      startCamera(undefined, next);
    }
  };

  const handleCameraSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedCameraId(id);
    if (isScanning) {
      startCamera(id);
    }
  };

  const handleScanAgain = () => {
    setResult('');
    startCamera(selectedCameraId || undefined);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      onToast('Copied to clipboard', 'success');
    } catch {
      onToast('Failed to copy', 'error');
    }
  };

  const isUrl = (text: string) => /^https?:\/\//i.test(text.trim());

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        onToast('Failed to read image', 'error');
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let detected: string | null = null;
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });
        detected = code?.data ?? null;
      } catch {
        detected = null;
      }

      if (detected) {
        setResult(detected);
        onToast('QR code detected from image', 'success');
      } else {
        onToast('No QR code found in the image', 'error');
      }

      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      onToast('Failed to load image', 'error');
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);

    e.target.value = '';
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-gray-50 via-emerald-50 to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl shadow-lg mb-4">
              <ScanLine className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              QR Scanner
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Scan a QR code with your camera or upload an image
            </p>
          </div>

          {/* Scanner Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
            {/* Camera controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <select
                value={selectedCameraId}
                onChange={handleCameraSelect}
                disabled={cameras.length === 0}
                className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              >
                {cameras.length === 0 && <option value="">Default camera</option>}
                {cameras.map((cam) => (
                  <option key={cam.deviceId} value={cam.deviceId}>
                    {cam.label}
                  </option>
                ))}
              </select>

              <button
                onClick={handleSwitchCamera}
                disabled={isStarting}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                <SwitchCamera className="w-4 h-4" />
                <span>Flip</span>
              </button>
            </div>

            {/* Video preview with overlay */}
            <div className="relative aspect-square w-full bg-gray-900 dark:bg-black rounded-xl overflow-hidden mb-4">
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning overlay */}
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-64 h-64">
                    <div className="absolute inset-0 border-2 border-emerald-400/60 rounded-2xl" />
                    {/* Animated corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg animate-pulse" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg animate-pulse" />
                  </div>
                </div>
              )}

              {/* Idle / error state */}
              {!isScanning && !result && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                  <CameraOff className="w-12 h-12 mb-2" />
                  <p className="text-sm">Camera is off</p>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-center px-6">
                  <CameraOff className="w-10 h-10 text-red-400 mb-3" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStartStop}
                disabled={isStarting}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-md transition-all duration-300 disabled:opacity-50"
              >
                {isScanning ? (
                  <>
                    <CameraOff className="w-5 h-5" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    <span>{isStarting ? 'Starting...' : 'Start Scanning'}</span>
                  </>
                )}
              </button>

              <label className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Upload className="w-5 h-5" />
                <span>Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Result Card */}
          {result && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Scan Result
                </h2>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-800 dark:text-gray-200 break-all whitespace-pre-wrap font-mono">
                  {result}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>

                {isUrl(result) && (
                  <a
                    href={result}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Link</span>
                  </a>
                )}

                <button
                  onClick={handleScanAgain}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Scan Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
