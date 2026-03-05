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
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, description }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
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
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: (format: ExportFormat, size: number, transparent?: boolean) => void;
}

export const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose, onDownload }) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [selectedSize, setSelectedSize] = useState(512);
  const [transparent, setTransparent] = useState(false);

  const formats = [
    { value: 'png' as ExportFormat, label: 'PNG', description: 'Best for web and digital use', icon: Image },
    { value: 'svg' as ExportFormat, label: 'SVG', description: 'Vector format, infinite scalability', icon: FileText },
    { value: 'jpeg' as ExportFormat, label: 'JPEG', description: 'Smaller file size, good quality', icon: Image },
    { value: 'webp' as ExportFormat, label: 'WebP', description: 'Modern format, excellent compression', icon: Image }
  ];

  const sizes = [
    { value: 256, label: 'Small', description: '256x256 px', icon: Smartphone },
    { value: 512, label: 'Medium', description: '512x512 px', icon: Monitor },
    { value: 1024, label: 'Large', description: '1024x1024 px', icon: Monitor },
    { value: 2048, label: 'Extra Large', description: '2048x2048 px', icon: Monitor }
  ];

  const handleDownload = () => {
    onDownload(selectedFormat, selectedSize, transparent);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Save QR Code"
      description="Choose format, size, and options for your QR code"
    >
      <div className="space-y-6">
        {/* Format Selection */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            File Format
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {formats.map((format) => (
              <button
                key={format.value}
                onClick={() => setSelectedFormat(format.value)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedFormat === format.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <format.icon className={`w-5 h-5 mt-0.5 ${
                    selectedFormat === format.value ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {format.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {format.description}
                    </div>
                  </div>
                  {selectedFormat === format.value && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Image Size
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {sizes.map((size) => (
              <button
                key={size.value}
                onClick={() => setSelectedSize(size.value)}
                className={`p-3 rounded-lg border text-left transition-all flex items-center space-x-3 ${
                  selectedSize === size.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <size.icon className={`w-4 h-4 ${
                  selectedSize === size.value ? 'text-blue-600' : 'text-gray-500'
                }`} />
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {size.label}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    {size.description}
                  </span>
                </div>
                {selectedSize === size.value && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        {(selectedFormat === 'png' || selectedFormat === 'webp') && (
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Options
            </h3>
            <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={transparent}
                onChange={(e) => setTransparent(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  Transparent Background
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Remove background for overlays
                </div>
              </div>
            </label>
          </div>
        )}

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>Download {selectedFormat.toUpperCase()}</span>
        </button>
      </div>
    </Modal>
  );
};

interface CopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCopy: (type: 'image' | 'data' | 'url', format?: ExportFormat, size?: number, transparent?: boolean) => void;
}

export const CopyModal: React.FC<CopyModalProps> = ({ isOpen, onClose, onCopy }) => {
  const [selectedType, setSelectedType] = useState<'image' | 'data' | 'url'>('image');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [selectedSize, setSelectedSize] = useState(512);
  const [transparent, setTransparent] = useState(false);
  const [customSize, setCustomSize] = useState('');
  const [showCustomSize, setShowCustomSize] = useState(false);

  const copyTypes = [
    { 
      value: 'image' as const, 
      label: 'Copy as Image', 
      description: 'Copy QR code image to clipboard',
      icon: Image 
    },
    { 
      value: 'data' as const, 
      label: 'Copy QR Data', 
      description: 'Copy the QR code content as text',
      icon: FileText 
    },
    { 
      value: 'url' as const, 
      label: 'Copy Shareable URL', 
      description: 'Copy link to share this QR code',
      icon: Link 
    }
  ];

  const formats = [
    { value: 'png' as ExportFormat, label: 'PNG', description: 'Best for clipboard', icon: Image },
    { value: 'jpeg' as ExportFormat, label: 'JPEG', description: 'Smaller file size', icon: Image },
    { value: 'webp' as ExportFormat, label: 'WebP', description: 'Modern format', icon: Image },
    { value: 'svg' as ExportFormat, label: 'SVG', description: 'Vector format', icon: FileText }
  ];

  const sizes = [
    { value: 128, label: 'Tiny', description: '128x128 px', icon: Smartphone },
    { value: 256, label: 'Small', description: '256x256 px', icon: Smartphone },
    { value: 512, label: 'Medium', description: '512x512 px', icon: Monitor },
    { value: 1024, label: 'Large', description: '1024x1024 px', icon: Monitor },
    { value: 2048, label: 'Extra Large', description: '2048x2048 px', icon: Monitor },
    { value: 4096, label: 'Ultra Large', description: '4096x4096 px', icon: Monitor },
    { value: 0, label: 'Custom', description: 'Enter custom size', icon: Settings }
  ];

  const handleCopy = () => {
    const finalSize = selectedSize === 0 ? parseInt(customSize) || 512 : selectedSize;
    
    if (selectedType === 'image') {
      onCopy(selectedType, selectedFormat, finalSize, transparent);
    } else {
      onCopy(selectedType);
    }
    onClose();
  };

  const isValidCustomSize = selectedSize === 0 ? customSize && parseInt(customSize) > 0 : true;
  const canCopy = selectedType === 'image' ? isValidCustomSize : true;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Copy QR Code"
      description="Choose what and how you want to copy"
    >
      <div className="space-y-6">
        {/* Copy Type Selection */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Copy Type
          </h3>
          <div className="space-y-2">
            {copyTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`w-full p-3 rounded-lg border text-left transition-all flex items-center space-x-3 ${
                  selectedType === type.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <type.icon className={`w-5 h-5 ${
                  selectedType === type.value ? 'text-blue-600' : 'text-gray-500'
                }`} />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {type.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {type.description}
                  </div>
                </div>
                {selectedType === type.value && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Image-specific options */}
        {selectedType === 'image' && (
          <>
            {/* Format Selection */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Image Format
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {formats.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setSelectedFormat(format.value)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedFormat === format.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <format.icon className={`w-4 h-4 mt-0.5 ${
                        selectedFormat === format.value ? 'text-blue-600' : 'text-gray-500'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {format.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {format.description}
                        </div>
                      </div>
                      {selectedFormat === format.value && (
                        <Check className="w-3 h-3 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Image Size
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => {
                      setSelectedSize(size.value);
                      setShowCustomSize(size.value === 0);
                    }}
                    className={`p-3 rounded-lg border text-left transition-all flex items-center space-x-3 ${
                      selectedSize === size.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <size.icon className={`w-4 h-4 ${
                      selectedSize === size.value ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    <div className="flex-1">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {size.label}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                        {size.description}
                      </span>
                    </div>
                    {selectedSize === size.value && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>

              {/* Custom Size Input */}
              {showCustomSize && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Custom Size (pixels)
                  </label>
                  <input
                    type="number"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    placeholder="Enter size (e.g., 800)"
                    min="64"
                    max="8192"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {customSize && (parseInt(customSize) < 64 || parseInt(customSize) > 8192) && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                      Size must be between 64 and 8192 pixels
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Transparency Option */}
            {(selectedFormat === 'png' || selectedFormat === 'webp') && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Options
                </h3>
                <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={transparent}
                    onChange={(e) => setTransparent(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      Transparent Background
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Remove background for overlays
                    </div>
                  </div>
                </label>
              </div>
            )}
          </>
        )}

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          disabled={!canCopy}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
            canCopy
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          <Copy className="w-5 h-5" />
          <span>
            {selectedType === 'image' 
              ? `Copy ${selectedFormat.toUpperCase()}${showCustomSize ? ` (${customSize || 'Custom'}px)` : ''}`
              : selectedType === 'data' 
                ? 'Copy Data' 
                : 'Copy URL'
            }
          </span>
        </button>
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
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
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
                  <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
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