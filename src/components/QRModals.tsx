import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Share2,
  Image,
  FileText,
  Smartphone,
  Monitor,
  Check,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle,
  Send,
  Mail,
  Link,
  QrCode,
  Settings
} from 'lucide-react';
import { ExportFormat, QRData } from '../types';
import { encodeQRToHash } from '../utils/urlHash';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  description?: string;
  maxWidth?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, description, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-hidden`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (format: ExportFormat, size: number, transparent?: boolean) => void;
  onCopy: (type: 'image' | 'data' | 'url', format?: ExportFormat, size?: number, transparent?: boolean) => void;
  defaultTransparent?: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onDownload, onCopy, defaultTransparent }) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [selectedSize, setSelectedSize] = useState(512);
  const [transparent, setTransparent] = useState(defaultTransparent ?? false);
  const [customSize, setCustomSize] = useState('');
  const [showCustomSize, setShowCustomSize] = useState(false);

  React.useEffect(() => {
    if (isOpen) setTransparent(defaultTransparent ?? false);
  }, [isOpen, defaultTransparent]);

  const formats = [
    { value: 'png' as ExportFormat, label: 'PNG', description: 'Best for web', icon: Image },
    { value: 'svg' as ExportFormat, label: 'SVG', description: 'Vector, scalable', icon: FileText },
    { value: 'jpeg' as ExportFormat, label: 'JPEG', description: 'Smaller size', icon: Image },
    { value: 'webp' as ExportFormat, label: 'WebP', description: 'Modern format', icon: Image },
    { value: 'pdf' as ExportFormat, label: 'PDF', description: 'Print-ready', icon: FileText },
  ];

  const sizes = [
    { value: 128, label: 'Tiny', sub: '128px', icon: Smartphone },
    { value: 256, label: 'Small', sub: '256px', icon: Smartphone },
    { value: 512, label: 'Medium', sub: '512px', icon: Monitor },
    { value: 1024, label: 'Large', sub: '1024px', icon: Monitor },
    { value: 2048, label: 'X-Large', sub: '2048px', icon: Monitor },
    { value: 0, label: 'Custom', sub: 'Enter size', icon: Settings },
  ];

  const showTransparent = selectedFormat !== 'jpeg';
  const canCopyImage = selectedFormat !== 'pdf';

  const getFinalSize = () => selectedSize === 0 ? parseInt(customSize) || 512 : selectedSize;
  const isValidCustomSize = selectedSize === 0 ? customSize && parseInt(customSize) > 0 && parseInt(customSize) <= 8192 : true;

  const handleDownload = () => {
    onDownload(selectedFormat, getFinalSize(), transparent);
    onClose();
  };

  const handleCopy = () => {
    onCopy('image', selectedFormat, getFinalSize(), transparent);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export QR Code"
      description="Configure format and size, then download or copy"
      maxWidth="max-w-2xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: Format */}
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Format</h3>
            <div className="grid grid-cols-2 gap-2">
              {formats.map((format) => (
                <button
                  key={format.value}
                  onClick={() => setSelectedFormat(format.value)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    selectedFormat === format.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <format.icon className={`w-4 h-4 ${selectedFormat === format.value ? 'text-emerald-600' : 'text-gray-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{format.label}</div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{format.description}</div>
                    </div>
                    {selectedFormat === format.value && <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Transparent toggle */}
          {showTransparent && (
            <label className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border border-gray-200 dark:border-gray-700">
              <input
                type="checkbox"
                checked={transparent}
                onChange={(e) => setTransparent(e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">Transparent background</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Remove fill behind QR dots</div>
              </div>
            </label>
          )}
        </div>

        {/* Right column: Size + actions */}
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Size</h3>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => {
                    setSelectedSize(size.value);
                    setShowCustomSize(size.value === 0);
                  }}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    selectedSize === size.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <size.icon className={`w-4 h-4 mx-auto mb-1 ${selectedSize === size.value ? 'text-emerald-600' : 'text-gray-500'}`} />
                  <div className="text-xs font-medium text-gray-900 dark:text-white">{size.label}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400">{size.sub}</div>
                </button>
              ))}
            </div>

            {showCustomSize && (
              <div className="mt-2 p-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <input
                  type="number"
                  value={customSize}
                  onChange={(e) => setCustomSize(e.target.value)}
                  placeholder="e.g. 800"
                  min="64"
                  max="8192"
                  className="w-full px-2.5 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
                {customSize && (parseInt(customSize) < 64 || parseInt(customSize) > 8192) && (
                  <p className="text-xs text-red-600 mt-1">64 to 8192 px</p>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              disabled={!canCopyImage || !isValidCustomSize}
              className={`py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                canCopyImage && isValidCustomSize
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }`}
              title={canCopyImage ? 'Copy to clipboard' : 'PDF cannot be copied as image'}
            >
              <Copy className="w-5 h-5" />
              <span>Copy</span>
            </button>
            <button
              onClick={handleDownload}
              disabled={!isValidCustomSize}
              className={`py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                isValidCustomSize
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Download className="w-5 h-5" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (platform: string) => void;
  qrData: QRData;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, onShare, qrData }) => {
  const [urlCopied, setUrlCopied] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const socialPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'bg-sky-500' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-600' },
    { id: 'telegram', name: 'Telegram', icon: Send, color: 'bg-blue-500' },
    { id: 'email', name: 'Email', icon: Mail, color: 'bg-gray-600' },
    { id: 'native', name: 'More Options', icon: Share2, color: 'bg-gray-700' }
  ];

  const buildSharedUrl = (): string => {
    try {
      const merged = { ...qrData } as Record<string, any>;
      if (title) merged.title = title;
      if (description) merged.description = description;
      const hash = encodeQRToHash(merged as QRData);

      const basePath = window.location.pathname.replace(/\/$/, '');
      const sharedPath = basePath.includes('/shared') ? basePath : `${basePath}/shared`;
      return `${window.location.origin}${sharedPath}#${hash}`;
    } catch (err) {
      console.error('Failed to build shared URL', err);
      return window.location.href;
    }
  };

  const handleCopyUrl = async () => {
    try {
      const url = buildSharedUrl();
      await navigator.clipboard.writeText(url);
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  const handleShare = (platform: string) => {
    const url = buildSharedUrl();

    try {
      if (platform === 'native') {
        if (navigator.share) {
          navigator.share({ title: title || 'QR Code', text: description || '', url });
        } else {
          navigator.clipboard.writeText(url);
        }
      } else if (platform === 'copy-url') {
        navigator.clipboard.writeText(url);
        setUrlCopied(true);
        setTimeout(() => setUrlCopied(false), 2000);
      } else {
        const shareText = `Check out this QR code: ${url}`;
        const shareUrls: Record<string, string> = {
          facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
          instagram: url,
          linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
          telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent('Check out this QR code')}`,
          email: `mailto:?subject=${encodeURIComponent(title || 'QR Code')}&body=${encodeURIComponent(shareText)}`
        };

        if (shareUrls[platform]) {
          window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
      }
    } catch (err) {
      console.error('Share error', err);
    } finally {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share QR Code"
      description="Share your QR code with others"
    >
      <div className="space-y-6">
        {/* Metadata inputs */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-900 dark:text-white">Title (optional)</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800" placeholder="Add a short title" />
          <label className="text-sm font-medium text-gray-900 dark:text-white">Description (optional)</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-800" placeholder="Add a short description" />
        </div>
        {/* Copy URL Section */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Shareable Link
          </h3>
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 font-mono break-all">
              {buildSharedUrl()}
            </div>
            <button
              onClick={handleCopyUrl}
              className={`p-3 rounded-lg transition-all ${
                urlCopied 
                  ? 'bg-green-600 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {urlCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {urlCopied && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">
              URL copied to clipboard!
            </p>
          )}
        </div>

        {/* Social Media Platforms */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Share on Social Media
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {socialPlatforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleShare(platform.id)}
                className="p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all text-left group hover:shadow-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${platform.color} group-hover:scale-110 transition-transform`}>
                    <platform.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="font-medium text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {platform.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};