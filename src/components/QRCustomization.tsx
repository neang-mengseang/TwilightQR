import React, { useRef, useState, useCallback } from 'react';
import { Palette, Circle, Eye, ChevronDown, Layout, Upload, X, Check } from 'lucide-react';
import { QRCodeOptions, Language, DotType, CornerSquareType, CornerDotType, ErrorCorrectionLevel } from '../types';
import { colorPresets } from '../utils/colorPresets';
import { qrStyleTemplates } from '../utils/qrTemplates';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errorCorrectionOpen, setErrorCorrectionOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      onChange({ logoUrl: event.target?.result as string });
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleTemplateSelect = (templateId: string) => {
    const template = qrStyleTemplates.find(t => t.id === templateId);
    if (template) {
      onChange(template.options);
      setSelectedTemplate(templateId);
    }
  };

  const errorCorrectionOptions = [
    { 
      value: 'L' as ErrorCorrectionLevel, 
      title: 'Low (7%)', 
      description: 'Good for pristine environments' 
    },
    { 
      value: 'M' as ErrorCorrectionLevel, 
      title: 'Medium (15%)', 
      description: 'Recommended for most uses' 
    },
    { 
      value: 'Q' as ErrorCorrectionLevel, 
      title: 'Quartile (25%)', 
      description: 'Good for outdoor or industrial use' 
    },
    { 
      value: 'H' as ErrorCorrectionLevel, 
      title: 'High (30%)', 
      description: 'Maximum damage resistance' 
    }
  ];

  const handleErrorCorrectionChange = (level: ErrorCorrectionLevel) => {
    onChange({ errorCorrectionLevel: level });
    setErrorCorrectionOpen(false);
  };

  const handleForegroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ foregroundColor: e.target.value });
  };

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ backgroundColor: e.target.value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleLogoSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseFloat(e.target.value);
    onChange({ logoSize: size });
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
    <div>
      {/* Templates */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Layout className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Templates</h3>
          {selectedTemplate && (
            <button
              onClick={() => setSelectedTemplate(null)}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-auto"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {qrStyleTemplates.map((template) => {
            const isActive = selectedTemplate === template.id;
            const fg = template.options.foregroundColor || '#000';
            const bg = template.options.transparentBackground ? 'transparent' : (template.options.backgroundColor || '#fff');
            return (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className={`relative p-2 rounded-lg border transition-all flex flex-col items-center gap-1.5 ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300'
                }`}
                title={template.description}
              >
                {isActive && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                <div
                  className="w-full h-8 rounded flex items-center justify-center"
                  style={{ backgroundColor: bg, backgroundImage: bg === 'transparent' ? 'linear-gradient(45deg, #d1d5db 25%, transparent 25%, transparent 75%, #d1d5db 75%), linear-gradient(45deg, #d1d5db 25%, transparent 25%, transparent 75%, #d1d5db 75%)' : undefined, backgroundSize: bg === 'transparent' ? '6px 6px' : undefined, backgroundPosition: bg === 'transparent' ? '0 0, 3px 3px' : undefined }}
                >
                  <div className="grid grid-cols-3 gap-0.5">
                    {[0,1,2,3,4,5,6,7,8].map(i => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-sm"
                        style={{ backgroundColor: fg, opacity: (i * 3 + 1) % 4 === 0 ? 0 : 0.9 }}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">{template.name}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Apply a full style preset. Optional, customize further after.</p>
      </div>

      {/* Body Patterns */}
      <div ref={bodyPatternsRef} className="scroll-mt-4 mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Circle className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Body Pattern</h3>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {bodyPatterns.map((pattern) => (
            <button
              key={pattern.type}
              onClick={() => onChange({ dotsType: pattern.type })}
              className={`p-2 rounded-lg border transition-all flex flex-col items-center gap-1.5 ${
                options.dotsType === pattern.type || (!options.dotsType && pattern.type === 'rounded')
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300'
              }`}
            >
              <div className="text-emerald-600 dark:text-emerald-400" dangerouslySetInnerHTML={{ __html: pattern.preview }} />
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">{pattern.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Corner Patterns */}
      <div ref={externalEyeRef} className="scroll-mt-4 pt-5 border-t border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Eye className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Corner Square</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {cornerSquarePatterns.map((pattern) => (
            <button
              key={pattern.type}
              onClick={() => onChange({ cornerSquareType: pattern.type })}
              className={`p-2 rounded-lg border transition-all flex flex-col items-center gap-1.5 ${
                options.cornerSquareType === pattern.type || (!options.cornerSquareType && pattern.type === 'extra-rounded')
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300'
              }`}
            >
              <div className="text-emerald-600 dark:text-emerald-400" dangerouslySetInnerHTML={{ __html: pattern.preview }} />
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">{pattern.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div ref={internalEyeRef} className="scroll-mt-4 mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-4 h-4 bg-emerald-600 rounded-full"></div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Corner Dot</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {cornerDotPatterns.map((pattern) => (
            <button
              key={pattern.type}
              onClick={() => onChange({ cornerDotType: pattern.type })}
              className={`p-2 rounded-lg border transition-all flex flex-col items-center gap-1.5 ${
                options.cornerDotType === pattern.type || (!options.cornerDotType && pattern.type === 'dot')
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300'
              }`}
            >
              <div className="text-emerald-600 dark:text-emerald-400" dangerouslySetInnerHTML={{ __html: pattern.preview }} />
              <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">{pattern.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div ref={colorsRef} className="scroll-mt-4 pt-5 border-t border-gray-100 dark:border-gray-700 mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Palette className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Colors</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="form-label">Foreground</label>
            <div className="flex gap-2">
              <input type="color" value={options.foregroundColor} onChange={handleForegroundColorChange} className="w-10 h-9 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer" />
              <input type="text" value={options.foregroundColor} onChange={(e) => onChange({ foregroundColor: e.target.value })} className="form-input flex-1 font-mono text-sm" placeholder="#000000" />
            </div>
          </div>

          <div>
            <label className="form-label">Background</label>
            <div className={`flex gap-2 transition-opacity ${options.transparentBackground ? 'opacity-40 pointer-events-none' : ''}`}>
              <input type="color" value={options.backgroundColor} onChange={handleBackgroundColorChange} className="w-10 h-9 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer" />
              <input type="text" value={options.backgroundColor} onChange={(e) => onChange({ backgroundColor: e.target.value })} className="form-input flex-1 font-mono text-sm" placeholder="#ffffff" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => onChange({ transparentBackground: !options.transparentBackground })}
            className="flex items-center justify-between w-full p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${options.transparentBackground ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                {options.transparentBackground ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900 dark:text-white">Transparent background</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{options.transparentBackground ? 'No fill behind QR dots' : 'Solid color fill'}</div>
              </div>
            </div>
            <div className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${options.transparentBackground ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${options.transparentBackground ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </button>

          <div>
            <label className="form-label">Presets</label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {colorPresets.map((preset) => {
                const isActive = options.foregroundColor === preset.foreground && options.backgroundColor === preset.background;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onChange({ foregroundColor: preset.foreground, backgroundColor: preset.background })}
                    className={`p-1.5 rounded-lg border transition-all ${isActive ? 'border-emerald-500 shadow-sm' : 'border-gray-200 dark:border-gray-600 hover:border-emerald-400'}`}
                    title={preset.description}
                  >
                    <div className="w-full h-6 rounded flex overflow-hidden">
                      <div className="w-3/4" style={{ backgroundColor: preset.foreground }} />
                      <div className="w-1/4" style={{ backgroundColor: preset.background }} />
                    </div>
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 truncate">{preset.name}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="pt-5 border-t border-gray-100 dark:border-gray-700 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Logo</h3>
        {options.logoUrl ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <img src={options.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">Logo uploaded</span>
              <button onClick={removeLogo} className="text-red-600 hover:text-red-700 text-xs font-medium">Remove</button>
            </div>
            <div>
              <label className="text-xs text-gray-600 dark:text-gray-400">Size: {Math.round((options.logoSize || 0.4) * 100)}%</label>
              <input type="range" min="0.1" max="0.5" step="0.05" value={options.logoSize || 0.4} onChange={handleLogoSizeChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider mt-1" />
            </div>
          </div>
        ) : (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all ${
              dragOver
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 scale-[1.02]'
                : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-colors ${dragOver ? 'bg-emerald-100 dark:bg-emerald-900/40' : 'bg-gray-100 dark:bg-gray-700'}`}>
              <Upload className={`w-5 h-5 ${dragOver ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`} />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {dragOver ? 'Drop to upload' : 'Drag & drop logo'}
            </span>
            <span className="text-xs text-gray-400 mt-1">or click to browse, PNG/JPG/SVG</span>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </div>
        )}
      </div>

      {/* Error Correction */}
      <div ref={errorCorrectionRef} className="scroll-mt-4 pt-5 border-t border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Error Correction</h3>
        <div className="relative">
          <button
            onClick={() => setErrorCorrectionOpen(!errorCorrectionOpen)}
            className="w-full p-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-left flex items-center justify-between hover:border-emerald-400 transition-colors"
          >
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{errorCorrectionOptions.find(opt => opt.value === options.errorCorrectionLevel)?.title}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 block">{errorCorrectionOptions.find(opt => opt.value === options.errorCorrectionLevel)?.description}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${errorCorrectionOpen ? 'rotate-180' : ''}`} />
          </button>
          {errorCorrectionOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
              {errorCorrectionOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleErrorCorrectionChange(option.value)}
                  className={`w-full p-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    options.errorCorrectionLevel === option.value ? 'bg-emerald-50 dark:bg-emerald-900/20 border-l-4 border-emerald-500' : ''
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{option.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCustomization;
