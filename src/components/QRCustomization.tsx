import React, { useRef } from 'react';
import { Palette, Settings, Circle, Square, Eye } from 'lucide-react';
import { QRCodeOptions, Language, DotType, CornerSquareType, CornerDotType } from '../types';
import { t } from '../utils/i18n';

interface QRCustomizationProps {
  options: QRCodeOptions;
  language: Language;
  onChange: (options: Partial<QRCodeOptions>) => void;
}

const QRCustomization: React.FC<QRCustomizationProps> = ({
  options,
  language,
  onChange
}) => {
  const colorsRef = useRef<HTMLDivElement>(null);
  const bodyPatternsRef = useRef<HTMLDivElement>(null);
  const externalEyeRef = useRef<HTMLDivElement>(null);
  const internalEyeRef = useRef<HTMLDivElement>(null);
  const errorCorrectionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleErrorCorrectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' });
  };

  const handleForegroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ foregroundColor: e.target.value });
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ backgroundColor: e.target.value });
  };

  const handleMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ margin: parseInt(e.target.value) });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ logoUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onChange({ logoUrl: undefined });
  };

  // Pattern options with preview SVGs
  const bodyPatterns: Array<{ type: DotType; name: string; preview: string }> = [
    { 
      type: 'rounded', 
      name: 'Rounded',
      preview: `<svg width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="2" width="4" height="4" rx="2" fill="currentColor"/><rect x="8" y="2" width="4" height="4" rx="2" fill="currentColor"/><rect x="14" y="2" width="4" height="4" rx="2" fill="currentColor"/><rect x="2" y="8" width="4" height="4" rx="2" fill="currentColor"/><rect x="8" y="8" width="4" height="4" rx="2" fill="currentColor"/><rect x="14" y="8" width="4" height="4" rx="2" fill="currentColor"/></svg>`
    },
    { 
      type: 'dots', 
      name: 'Dots',
      preview: `<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="4" cy="4" r="2" fill="currentColor"/><circle cx="10" cy="4" r="2" fill="currentColor"/><circle cx="16" cy="4" r="2" fill="currentColor"/><circle cx="4" cy="10" r="2" fill="currentColor"/><circle cx="10" cy="10" r="2" fill="currentColor"/><circle cx="16" cy="10" r="2" fill="currentColor"/></svg>`
    },
    { 
      type: 'classy', 
      name: 'Classy',
      preview: `<svg width="24" height="24" viewBox="0 0 24 24"><polygon points="4,2 6,2 6,6 2,6 2,4" fill="currentColor"/><polygon points="10,2 12,2 12,6 8,6 8,4" fill="currentColor"/><polygon points="16,2 18,2 18,6 14,6 14,4" fill="currentColor"/><polygon points="4,8 6,8 6,12 2,12 2,10" fill="currentColor"/><polygon points="10,8 12,8 12,12 8,12 8,10" fill="currentColor"/><polygon points="16,8 18,8 18,12 14,12 14,10" fill="currentColor"/></svg>`
    },
    { 
      type: 'classy-rounded', 
      name: 'Classy Rounded',
      preview: `<svg width="24" height="24" viewBox="0 0 24 24"><path d="M4,2 L6,2 Q6,2 6,2.5 L6,5.5 Q6,6 5.5,6 L2.5,6 Q2,6 2,5.5 L2,2.5 Q2,2 2.5,2 Z" fill="currentColor"/><path d="M10,2 L12,2 Q12,2 12,2.5 L12,5.5 Q12,6 11.5,6 L8.5,6 Q8,6 8,5.5 L8,2.5 Q8,2 8.5,2 Z" fill="currentColor"/><path d="M16,2 L18,2 Q18,2 18,2.5 L18,5.5 Q18,6 17.5,6 L14.5,6 Q14,6 14,5.5 L14,2.5 Q14,2 14.5,2 Z" fill="currentColor"/></path></svg>`
    },
    { 
      type: 'square', 
      name: 'Square',
      preview: `<svg width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="2" width="4" height="4" fill="currentColor"/><rect x="8" y="2" width="4" height="4" fill="currentColor"/><rect x="14" y="2" width="4" height="4" fill="currentColor"/><rect x="2" y="8" width="4" height="4" fill="currentColor"/><rect x="8" y="8" width="4" height="4" fill="currentColor"/><rect x="14" y="8" width="4" height="4" fill="currentColor"/></svg>`
    },
    { 
      type: 'extra-rounded', 
      name: 'Extra Rounded',
      preview: `<svg width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="2" width="4" height="4" rx="3" fill="currentColor"/><rect x="8" y="2" width="4" height="4" rx="3" fill="currentColor"/><rect x="14" y="2" width="4" height="4" rx="3" fill="currentColor"/><rect x="2" y="8" width="4" height="4" rx="3" fill="currentColor"/><rect x="8" y="8" width="4" height="4" rx="3" fill="currentColor"/><rect x="14" y="8" width="4" height="4" rx="3" fill="currentColor"/></svg>`
    }
  ];

  const cornerSquarePatterns: Array<{ type: CornerSquareType; name: string; preview: string }> = [
    { 
      type: 'dot', 
      name: 'Dot',
      preview: `<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="currentColor"/></svg>`
    },
    { 
      type: 'square', 
      name: 'Square',
      preview: `<svg width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" fill="currentColor"/></svg>`
    },
    { 
      type: 'extra-rounded', 
      name: 'Extra Rounded',
      preview: `<svg width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="8" fill="currentColor"/></svg>`
    }
  ];

  const cornerDotPatterns: Array<{ type: CornerDotType; name: string; preview: string }> = [
    { 
      type: 'dot', 
      name: 'Dot',
      preview: `<svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>`
    },
    { 
      type: 'square', 
      name: 'Square',
      preview: `<svg width="24" height="24" viewBox="0 0 24 24"><rect x="8" y="8" width="8" height="8" fill="currentColor"/></svg>`
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4 lg:mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('qrCustomization', language)}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Customize your QR code
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => scrollToSection(colorsRef)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
          >
            Colors
          </button>
          <button
            onClick={() => scrollToSection(bodyPatternsRef)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
          >
            Body Patterns
          </button>
          <button
            onClick={() => scrollToSection(externalEyeRef)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
          >
            External Eye
          </button>
          <button
            onClick={() => scrollToSection(internalEyeRef)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
          >
            Internal Eye
          </button>
          <button
            onClick={() => scrollToSection(errorCorrectionRef)}
            className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
          >
            Settings
          </button>
        </div>
      </div>

      {/* Body Patterns Section */}
      <div ref={bodyPatternsRef} className="scroll-mt-4 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Circle className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Body Patterns
          </h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {bodyPatterns.map((pattern) => (
            <button
              key={pattern.type}
              onClick={() => onChange({ dotsType: pattern.type })}
              className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                options.dotsType === pattern.type || (!options.dotsType && pattern.type === 'rounded')
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
              }`}
            >
              <div 
                className="text-blue-600 dark:text-blue-400"
                dangerouslySetInnerHTML={{ __html: pattern.preview }}
              />
              <span className="text-xs font-medium text-gray-900 dark:text-white text-center">
                {pattern.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* External Eye Patterns Section */}
      <div ref={externalEyeRef} className="scroll-mt-4 pt-6 border-t border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Eye className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            External Eye Patterns
          </h3>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {cornerSquarePatterns.map((pattern) => (
            <button
              key={pattern.type}
              onClick={() => onChange({ cornerSquareType: pattern.type })}
              className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                options.cornerSquareType === pattern.type || (!options.cornerSquareType && pattern.type === 'extra-rounded')
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-700'
              }`}
            >
              <div 
                className="text-green-600 dark:text-green-400"
                dangerouslySetInnerHTML={{ __html: pattern.preview }}
              />
              <span className="text-xs font-medium text-gray-900 dark:text-white text-center">
                {pattern.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Internal Eye Patterns Section */}
      <div ref={internalEyeRef} className="scroll-mt-4 pt-6 border-t border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-5 h-5 bg-gradient-to-br from-orange-500 to-red-600 rounded-full"></div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Internal Eye Patterns
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {cornerDotPatterns.map((pattern) => (
            <button
              key={pattern.type}
              onClick={() => onChange({ cornerDotType: pattern.type })}
              className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center space-y-2 ${
                options.cornerDotType === pattern.type || (!options.cornerDotType && pattern.type === 'dot')
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-700'
              }`}
            >
              <div 
                className="text-orange-600 dark:text-orange-400"
                dangerouslySetInnerHTML={{ __html: pattern.preview }}
              />
              <span className="text-xs font-medium text-gray-900 dark:text-white text-center">
                {pattern.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Section */}
      <div ref={errorCorrectionRef} className="scroll-mt-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Settings
          </h3>
        </div>

        <div className="space-y-6">
          {/* Colors Section */}
          <div ref={colorsRef} className="scroll-mt-4">
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Palette className="w-4 h-4 mr-2 text-purple-600" />
              Colors
            </h4>
            
            <div className="space-y-4">
              {/* Foreground Color */}
              <div>
                <label htmlFor="foreground-color" className="form-label">
                  {t('foregroundColor', language)}
                </label>
                <div className="flex space-x-3">
                  <input
                    id="foreground-color"
                    type="color"
                    value={options.foregroundColor}
                    onChange={handleForegroundColorChange}
                    className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={options.foregroundColor}
                    onChange={(e) => onChange({ foregroundColor: e.target.value })}
                    className="form-input flex-1 font-mono text-sm"
                    placeholder="#000000"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div>
                <label htmlFor="background-color" className="form-label">
                  {t('backgroundColor', language)}
                </label>
                <div className="flex space-x-3">
                  <input
                    id="background-color"
                    type="color"
                    value={options.backgroundColor}
                    onChange={handleBackgroundColorChange}
                    className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={options.backgroundColor}
                    onChange={(e) => onChange({ backgroundColor: e.target.value })}
                    className="form-input flex-1 font-mono text-sm"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              {/* Color Presets */}
              <div>
                <label className="form-label">Color Presets</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {[
                    { name: 'Classic', fg: '#000000', bg: '#ffffff' },
                    { name: 'Blue', fg: '#1e40af', bg: '#eff6ff' },
                    { name: 'Green', fg: '#166534', bg: '#f0fdf4' },
                    { name: 'Purple', fg: '#7c3aed', bg: '#faf5ff' },
                    { name: 'Red', fg: '#dc2626', bg: '#fef2f2' },
                    { name: 'Orange', fg: '#ea580c', bg: '#fff7ed' },
                    { name: 'Dark', fg: '#ffffff', bg: '#111827' },
                    { name: 'Pink', fg: '#e11d48', bg: '#fdf2f8' }
                  ].map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => onChange({ 
                        foregroundColor: preset.fg, 
                        backgroundColor: preset.bg
                      })}
                      className="p-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-purple-400 
                               dark:hover:border-purple-500 transition-all duration-200 group hover:shadow-md"
                      title={preset.name}
                    >
                      <div className="w-full h-8 rounded flex overflow-hidden">
                        <div 
                          className="w-3/4"
                          style={{ backgroundColor: preset.fg }}
                        ></div>
                        <div 
                          className="w-1/4"
                          style={{ backgroundColor: preset.bg }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">
                        {preset.name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Error Correction Level */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <label htmlFor="error-correction" className="form-label">
              {t('errorCorrection', language)}
            </label>
            <select
              id="error-correction"
              value={options.errorCorrectionLevel}
              onChange={handleErrorCorrectionChange}
              className="form-input"
            >
              <option value="L">{t('errorLow', language)} (~7%)</option>
              <option value="M">{t('errorMedium', language)} (~15%)</option>
              <option value="Q">{t('errorQuartile', language)} (~25%)</option>
              <option value="H">{t('errorHigh', language)} (~30%)</option>
            </select>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Higher error correction allows the QR code to be read even if partially damaged.
            </p>
          </div>

          {/* Margin */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <label htmlFor="qr-margin" className="form-label">
              Margin ({options.margin} modules)
            </label>
            <input
              id="qr-margin"
              type="range"
              min="0"
              max="10"
              step="1"
              value={options.margin}
              onChange={handleMarginChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer 
                       dark:bg-gray-700 slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>10</span>
            </div>
          </div>

          {/* Logo Upload */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <label className="form-label">
              Logo (Optional)
            </label>
            <div className="space-y-3">
              {options.logoUrl ? (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <img 
                    src={options.logoUrl} 
                    alt="Logo preview" 
                    className="w-12 h-12 object-contain rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 dark:text-gray-300">Logo uploaded</p>
                    <p className="text-xs text-gray-500">Will be centered in QR code</p>
                  </div>
                  <button
                    onClick={removeLogo}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <Palette className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label className="cursor-pointer">
                      <span className="text-primary-600 hover:text-primary-700 font-medium">
                        Upload a logo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-gray-500 text-sm mt-1">
                      PNG, JPG, SVG up to 2MB
                    </p>
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Logo will be automatically resized to fit in the center of the QR code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCustomization;
