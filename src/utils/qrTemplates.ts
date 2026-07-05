import { QRCodeOptions, DotType, CornerSquareType, CornerDotType, ErrorCorrectionLevel } from '../types';

export interface QRTemplate {
  id: string;
  name: string;
  description: string;
  options: Partial<QRCodeOptions>;
}

export const qrStyleTemplates: QRTemplate[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Black on white, square dots',
    options: {
      foregroundColor: '#000000',
      backgroundColor: '#ffffff',
      dotsType: 'square' as DotType,
      cornerSquareType: 'square' as CornerSquareType,
      cornerDotType: 'square' as CornerDotType,
      errorCorrectionLevel: 'M' as ErrorCorrectionLevel,
      transparentBackground: false,
    },
  },
  {
    id: 'emerald',
    name: 'Emerald',
    description: 'Green rounded on white',
    options: {
      foregroundColor: '#059669',
      backgroundColor: '#ffffff',
      dotsType: 'rounded' as DotType,
      cornerSquareType: 'extra-rounded' as CornerSquareType,
      cornerDotType: 'dot' as CornerDotType,
      errorCorrectionLevel: 'M' as ErrorCorrectionLevel,
      transparentBackground: false,
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'White on dark navy',
    options: {
      foregroundColor: '#f8fafc',
      backgroundColor: '#0f172a',
      dotsType: 'rounded' as DotType,
      cornerSquareType: 'extra-rounded' as CornerSquareType,
      cornerDotType: 'dot' as CornerDotType,
      errorCorrectionLevel: 'M' as ErrorCorrectionLevel,
      transparentBackground: false,
    },
  },
  {
    id: 'dots',
    name: 'Dots',
    description: 'Dotted pattern, rounded corners',
    options: {
      foregroundColor: '#1e293b',
      backgroundColor: '#f1f5f9',
      dotsType: 'dots' as DotType,
      cornerSquareType: 'dot' as CornerSquareType,
      cornerDotType: 'dot' as CornerDotType,
      errorCorrectionLevel: 'Q' as ErrorCorrectionLevel,
      transparentBackground: false,
    },
  },
  {
    id: 'classy',
    name: 'Classy',
    description: 'Classy rounded, elegant',
    options: {
      foregroundColor: '#7c2d12',
      backgroundColor: '#fef3c7',
      dotsType: 'classy-rounded' as DotType,
      cornerSquareType: 'extra-rounded' as CornerSquareType,
      cornerDotType: 'square' as CornerDotType,
      errorCorrectionLevel: 'M' as ErrorCorrectionLevel,
      transparentBackground: false,
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Blue on light cyan',
    options: {
      foregroundColor: '#1e40af',
      backgroundColor: '#ecfeff',
      dotsType: 'extra-rounded' as DotType,
      cornerSquareType: 'extra-rounded' as CornerSquareType,
      cornerDotType: 'dot' as CornerDotType,
      errorCorrectionLevel: 'M' as ErrorCorrectionLevel,
      transparentBackground: false,
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Orange on cream',
    options: {
      foregroundColor: '#c2410c',
      backgroundColor: '#fff7ed',
      dotsType: 'rounded' as DotType,
      cornerSquareType: 'dot' as CornerSquareType,
      cornerDotType: 'dot' as CornerDotType,
      errorCorrectionLevel: 'Q' as ErrorCorrectionLevel,
      transparentBackground: false,
    },
  },
  {
    id: 'transparent',
    name: 'Transparent',
    description: 'Dark on transparent bg',
    options: {
      foregroundColor: '#111827',
      backgroundColor: '#ffffff',
      dotsType: 'rounded' as DotType,
      cornerSquareType: 'extra-rounded' as CornerSquareType,
      cornerDotType: 'dot' as CornerDotType,
      errorCorrectionLevel: 'H' as ErrorCorrectionLevel,
      transparentBackground: true,
    },
  },
  {
    id: 'rose',
    name: 'Rose',
    description: 'Pink on light rose',
    options: {
      foregroundColor: '#be123c',
      backgroundColor: '#fff1f2',
      dotsType: 'classy' as DotType,
      cornerSquareType: 'square' as CornerSquareType,
      cornerDotType: 'square' as CornerDotType,
      errorCorrectionLevel: 'M' as ErrorCorrectionLevel,
      transparentBackground: false,
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Deep green on sage',
    options: {
      foregroundColor: '#14532d',
      backgroundColor: '#dcfce7',
      dotsType: 'extra-rounded' as DotType,
      cornerSquareType: 'extra-rounded' as CornerSquareType,
      cornerDotType: 'dot' as CornerDotType,
      errorCorrectionLevel: 'Q' as ErrorCorrectionLevel,
      transparentBackground: false,
    },
  },
  {
    id: 'mono',
    name: 'Mono',
    description: 'Extra rounded, minimal',
    options: {
      foregroundColor: '#18181b',
      backgroundColor: '#fafafa',
      dotsType: 'extra-rounded' as DotType,
      cornerSquareType: 'extra-rounded' as CornerSquareType,
      cornerDotType: 'dot' as CornerDotType,
      errorCorrectionLevel: 'L' as ErrorCorrectionLevel,
      transparentBackground: false,
    },
  },
  {
    id: 'violet',
    name: 'Violet',
    description: 'Purple on lavender',
    options: {
      foregroundColor: '#6d28d9',
      backgroundColor: '#f5f3ff',
      dotsType: 'classy-rounded' as DotType,
      cornerSquareType: 'extra-rounded' as CornerSquareType,
      cornerDotType: 'square' as CornerDotType,
      errorCorrectionLevel: 'M' as ErrorCorrectionLevel,
      transparentBackground: false,
    },
  },
];
