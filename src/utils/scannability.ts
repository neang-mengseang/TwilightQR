import { QRCodeOptions } from '../types';

export interface ScanIssue {
  level: 'warning' | 'error';
  message: string;
}

export interface ScanScore {
  score: number;
  label: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  color: string;
  issues: ScanIssue[];
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const cleaned = hex.replace('#', '');
  if (cleaned.length !== 6) return null;
  const r = parseInt(cleaned.slice(0, 2), 16);
  const g = parseInt(cleaned.slice(2, 4), 16);
  const b = parseInt(cleaned.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
};

const getLuminance = (hex: string): number => {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const { r, g, b } = rgb;
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
};

const getContrastRatio = (fg: string, bg: string): number => {
  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

export const calculateScanScore = (
  options: QRCodeOptions,
  dataLength: number
): ScanScore => {
  const issues: ScanIssue[] = [];
  let score = 100;

  const fg = options.foregroundColor;
  const bg = options.transparentBackground ? '#ffffff' : options.backgroundColor;
  const contrast = getContrastRatio(fg, bg);

  if (contrast < 2) {
    score -= 40;
    issues.push({ level: 'error', message: 'Very low contrast. QR will be hard to scan.' });
  } else if (contrast < 3) {
    score -= 20;
    issues.push({ level: 'warning', message: 'Low contrast. May cause scanning issues.' });
  } else if (contrast < 4.5) {
    score -= 10;
    issues.push({ level: 'warning', message: 'Moderate contrast. Consider darker foreground or lighter background.' });
  }

  if (options.logoUrl) {
    const logoSize = options.logoSize || 0.4;
    if (logoSize > 0.4) {
      score -= 15;
      issues.push({ level: 'warning', message: 'Logo is large. Reduce to 30-40% for best scannability.' });
    }
    if (options.errorCorrectionLevel === 'L') {
      score -= 15;
      issues.push({ level: 'error', message: 'Logo with low error correction (L). Use M or H.' });
    } else if (options.errorCorrectionLevel === 'M' && logoSize > 0.35) {
      score -= 5;
      issues.push({ level: 'warning', message: 'Logo with medium ECC. Consider H for large logos.' });
    }
  }

  const eccCapacity: Record<string, number> = { L: 154, M: 128, Q: 104, H: 72 };
  const capacity = eccCapacity[options.errorCorrectionLevel] || 128;
  if (dataLength > capacity * 0.8) {
    score -= 10;
    issues.push({ level: 'warning', message: 'High data density. QR is dense and harder to scan.' });
  }

  if (options.margin < 2) {
    score -= 10;
    issues.push({ level: 'warning', message: 'Very small margin. Use at least 2-4 for reliable scanning.' });
  }

  score = Math.max(0, Math.min(100, score));

  let label: ScanScore['label'] = 'Excellent';
  let color = '#10b981';
  if (score < 50) { label = 'Poor'; color = '#ef4444'; }
  else if (score < 70) { label = 'Fair'; color = '#f59e0b'; }
  else if (score < 90) { label = 'Good'; color = '#eab308'; }

  return { score, label, color, issues };
};
