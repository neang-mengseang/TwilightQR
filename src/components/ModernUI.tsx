import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Download, Copy, Share2, Eye, Image, FileText, Smartphone } from 'lucide-react';
import { ExportFormat } from '../types';

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ trigger, children, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 min-w-[180px] overflow-hidden">
          <div className="py-2">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

interface DropdownItemProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  description?: string;
  disabled?: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ 
  onClick, 
  icon, 
  label, 
  description, 
  disabled = false 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 
               disabled:opacity-50 disabled:cursor-not-allowed transition-colors
               flex items-center space-x-3"
  >
    <div className="flex-shrink-0 text-gray-500 dark:text-gray-400">
      {icon}
    </div>
    <div className="flex-1">
      <div className="text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </div>
      {description && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </div>
      )}
    </div>
  </button>
);

interface ModernButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const ModernButton: React.FC<ModernButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600',
    outline: 'border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

interface DownloadDropdownProps {
  onDownload: (format: ExportFormat, size: number, transparent?: boolean) => void;
  disabled?: boolean;
}

interface CopyDropdownProps {
  onCopy: (format: ExportFormat, size: number, transparent?: boolean) => void;
  disabled?: boolean;
}

const DownloadDropdown: React.FC<DownloadDropdownProps> = ({ onDownload, disabled }) => {
  const [showSizeOptions, setShowSizeOptions] = useState<{ format: ExportFormat; transparent?: boolean } | null>(null);

  const sizeOptions = [
    { size: 256, label: 'Small (256px)', description: 'Good for web' },
    { size: 512, label: 'Medium (512px)', description: 'Standard size' },
    { size: 1024, label: 'Large (1024px)', description: 'High resolution' },
    { size: 2048, label: 'Extra Large (2048px)', description: 'Print quality' },
    { size: 0, label: 'Custom Size', description: 'Enter custom dimensions' }
  ];

  const downloadOptions = [
    { format: 'png' as ExportFormat, label: 'PNG Image', description: 'High quality raster', icon: <Image className="w-4 h-4" /> },
    { format: 'png' as ExportFormat, label: 'PNG Transparent', description: 'No background', icon: <Image className="w-4 h-4" />, transparent: true },
    { format: 'jpeg' as ExportFormat, label: 'JPEG Image', description: 'Smaller file size', icon: <Image className="w-4 h-4" /> },
    { format: 'svg' as ExportFormat, label: 'SVG Vector', description: 'Scalable format', icon: <FileText className="w-4 h-4" /> },
    { format: 'webp' as ExportFormat, label: 'WebP Image', description: 'Modern format', icon: <Smartphone className="w-4 h-4" /> }
  ];

  const handleFormatSelect = (format: ExportFormat, transparent?: boolean) => {
    if (format === 'svg') {
      // SVG doesn't need size options
      onDownload(format, 512, transparent);
    } else {
      setShowSizeOptions({ format, transparent });
    }
  };

  const handleSizeSelect = (size: number) => {
    if (!showSizeOptions) return;
    
    if (size === 0) {
      // Custom size - prompt user
      const customSize = prompt('Enter custom size in pixels (e.g., 800):', '800');
      if (customSize && !isNaN(parseInt(customSize))) {
        onDownload(showSizeOptions.format, parseInt(customSize), showSizeOptions.transparent);
      }
    } else {
      onDownload(showSizeOptions.format, size, showSizeOptions.transparent);
    }
    setShowSizeOptions(null);
  };

  return (
    <Dropdown
      trigger={
        <ModernButton variant="primary" disabled={disabled}>
          <Download className="w-4 h-4 mr-2" />
          Download
          <ChevronDown className="w-4 h-4 ml-2" />
        </ModernButton>
      }
    >
      {!showSizeOptions ? (
        // Show format options
        <>
          {downloadOptions.map((option, index) => (
            <DropdownItem
              key={index}
              onClick={() => handleFormatSelect(option.format, option.transparent)}
              icon={option.icon}
              label={option.label}
              description={option.description}
              disabled={disabled}
            />
          ))}
        </>
      ) : (
        // Show size options
        <>
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Choose Size - {showSizeOptions.format.toUpperCase()}
                {showSizeOptions.transparent && ' (Transparent)'}
              </span>
              <button
                onClick={() => setShowSizeOptions(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
          </div>
          {sizeOptions.map((option, index) => (
            <DropdownItem
              key={index}
              onClick={() => handleSizeSelect(option.size)}
              icon={<div className="w-4 h-4 bg-blue-500 rounded" style={{ 
                width: `${Math.min(16, (option.size || 512) / 128 * 4)}px`,
                height: `${Math.min(16, (option.size || 512) / 128 * 4)}px`
              }} />}
              label={option.label}
              description={option.description}
              disabled={disabled}
            />
          ))}
        </>
      )}
    </Dropdown>
  );
};

const CopyDropdown: React.FC<CopyDropdownProps> = ({ onCopy, disabled }) => {
  const [showSizeOptions, setShowSizeOptions] = useState<{ format: ExportFormat; transparent?: boolean } | null>(null);

  const formatOptions = [
    { format: 'png' as ExportFormat, label: 'PNG Image', description: 'High quality raster', icon: <Image className="w-4 h-4" /> },
    { format: 'png' as ExportFormat, label: 'PNG Transparent', description: 'No background', icon: <Image className="w-4 h-4" />, transparent: true },
    { format: 'jpeg' as ExportFormat, label: 'JPEG Image', description: 'Smaller file size', icon: <Image className="w-4 h-4" /> },
    { format: 'svg' as ExportFormat, label: 'SVG Vector', description: 'Scalable format', icon: <FileText className="w-4 h-4" /> },
    { format: 'webp' as ExportFormat, label: 'WebP Image', description: 'Modern format', icon: <Smartphone className="w-4 h-4" /> }
  ];

  const sizeOptions = [
    { size: 256, label: 'Small (256px)', description: 'Quick copy' },
    { size: 512, label: 'Medium (512px)', description: 'Standard size' },
    { size: 1024, label: 'Large (1024px)', description: 'High resolution' },
    { size: 2048, label: 'Extra Large (2048px)', description: 'Maximum quality' }
  ];

  const handleFormatSelect = (format: ExportFormat, transparent?: boolean) => {
    setShowSizeOptions({ format, transparent });
  };

  const handleSizeSelect = (size: number) => {
    if (!showSizeOptions) return;
    onCopy(showSizeOptions.format, size, showSizeOptions.transparent);
    setShowSizeOptions(null);
  };

  return (
    <Dropdown
      trigger={
        <ModernButton variant="secondary" disabled={disabled}>
          <Copy className="w-4 h-4 mr-2" />
          Copy
          <ChevronDown className="w-4 h-4 ml-2" />
        </ModernButton>
      }
    >
      {!showSizeOptions ? (
        // Show format type options
        <>
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Step 1: Choose Format
            </span>
          </div>
          {formatOptions.map((option, index) => (
            <DropdownItem
              key={index}
              onClick={() => handleFormatSelect(option.format, option.transparent)}
              icon={option.icon}
              label={option.label}
              description={option.description}
              disabled={disabled}
            />
          ))}
        </>
      ) : (
        // Show size options
        <>
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Step 2: Choose Size
                </span>
                <div className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                  {showSizeOptions.format.toUpperCase()}
                  {showSizeOptions.transparent && ' • Transparent'}
                </div>
              </div>
              <button
                onClick={() => setShowSizeOptions(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none"
              >
                ×
              </button>
            </div>
          </div>
          {sizeOptions.map((option, index) => (
            <DropdownItem
              key={index}
              onClick={() => handleSizeSelect(option.size)}
              icon={<div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center">
                <Copy className="w-3 h-3 text-white" />
              </div>}
              label={option.label}
              description={option.description}
              disabled={disabled}
            />
          ))}
        </>
      )}
    </Dropdown>
  );
};

export { Dropdown, DropdownItem, ModernButton, DownloadDropdown, CopyDropdown };
export type { DropdownProps, DropdownItemProps, ModernButtonProps, DownloadDropdownProps, CopyDropdownProps };