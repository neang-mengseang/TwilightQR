import { QRData, QRCodeOptions } from '../types';

export interface HistoryEntry {
  id: string;
  qrData: QRData;
  qrOptions: QRCodeOptions;
  timestamp: number;
  favorite: boolean;
  label: string;
}

const HISTORY_KEY = 'qrHistory';
const MAX_HISTORY = 50;

export const getHistory = (): HistoryEntry[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
};

export const addToHistory = (qrData: QRData, qrOptions: QRCodeOptions): void => {
  const history = getHistory();
  const label = generateLabel(qrData);
  const entry: HistoryEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    qrData,
    qrOptions,
    timestamp: Date.now(),
    favorite: false,
    label,
  };
  const filtered = history.filter(h => !(h.qrData.type === qrData.type && JSON.stringify(h.qrData) === JSON.stringify(qrData)));
  const updated = [entry, ...filtered].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const removeFromHistory = (id: string): void => {
  const history = getHistory();
  const updated = history.filter(h => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const toggleFavorite = (id: string): void => {
  const history = getHistory();
  const updated = history.map(h => h.id === id ? { ...h, favorite: !h.favorite } : h);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};

export const getFavorites = (): HistoryEntry[] => {
  return getHistory().filter(h => h.favorite);
};

const generateLabel = (qrData: QRData): string => {
  const data = qrData as any;
  switch (qrData.type) {
    case 'text': return data.text?.slice(0, 30) || 'Text QR';
    case 'url': return data.url?.slice(0, 30) || 'URL QR';
    case 'email': return data.email || 'Email QR';
    case 'wifi': return data.ssid ? `Wi-Fi: ${data.ssid}` : 'Wi-Fi QR';
    case 'phone': return data.phone || 'Phone QR';
    case 'sms': return data.phone ? `SMS: ${data.phone}` : 'SMS QR';
    case 'contact': return data.firstName ? `Contact: ${data.firstName}` : 'Contact QR';
    case 'event': return data.title || 'Event QR';
    case 'location': return data.query || `Location ${data.latitude},${data.longitude}`;
    case 'whatsapp': return `WhatsApp: ${data.identifier || ''}`;
    case 'telegram': return `Telegram: ${data.identifier || ''}`;
    case 'instagram': return `Instagram: ${data.username || ''}`;
    case 'youtube': return `YouTube: ${data.channel || ''}`;
    case 'spotify': return `Spotify: ${data.spotify_url || ''}`;
    case 'paypal': return `PayPal: ${data.email || ''}`;
    case 'bitcoin': return `BTC: ${data.address?.slice(0, 12) || ''}`;
    case 'ethereum': return `ETH: ${data.address?.slice(0, 12) || ''}`;
    case 'pdf': return `PDF: ${data.pdf_url?.slice(0, 30) || ''}`;
    case 'menu': return `Menu: ${data.menu_url?.slice(0, 30) || ''}`;
    case 'business-card': return `Card: ${data.name || ''}`;
    case 'coupon': return `Coupon: ${data.code || ''}`;
    default: return `${qrData.type} QR`;
  }
};
