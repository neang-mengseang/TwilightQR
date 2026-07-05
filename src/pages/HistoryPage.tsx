import React, { useState, useEffect, useRef } from 'react';
import { History, QrCode, Star, Copy, Trash2, ArrowRight, Clock } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import { Language, QRType } from '../types';
import {
  getHistory,
  removeFromHistory,
  toggleFavorite,
  clearHistory,
  HistoryEntry,
} from '../utils/history';
import { decodeHashToQR, createShareableUrl, updateUrlHash } from '../utils/urlHash';
import { generateQRString } from '../utils/qrGenerators';

interface HistoryPageProps {
  language: Language;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
  onSelectQRType: (type: QRType) => void;
}

const formatRelativeTime = (timestamp: number): string => {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
};

interface HistoryCardProps {
  entry: HistoryEntry;
  onToggleFavorite: (id: string) => void;
  onCopyUrl: (entry: HistoryEntry) => void;
  onReopen: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
  entry,
  onToggleFavorite,
  onCopyUrl,
  onReopen,
  onDelete,
}) => {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!qrRef.current) return;
    const qr = new QRCodeStyling({
      width: 80,
      height: 80,
      type: 'svg',
      data: generateQRString(entry.qrData),
      dotsOptions: { color: entry.qrOptions.foregroundColor || '#000', type: 'rounded' },
      backgroundOptions: { color: entry.qrOptions.backgroundColor || '#fff' },
    });
    qrRef.current.innerHTML = '';
    qr.append(qrRef.current);
  }, [entry]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-3 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-start gap-3">
        <div
          ref={qrRef}
          className="shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-white"
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white truncate">
            {entry.label}
          </p>
          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 capitalize">
            {entry.qrData.type}
          </span>
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{formatRelativeTime(entry.timestamp)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={() => onToggleFavorite(entry.id)}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
          title={entry.favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            className="w-4 h-4"
            fill={entry.favorite ? 'currentColor' : 'none'}
            stroke="currentColor"
          />
        </button>
        <button
          onClick={() => onCopyUrl(entry)}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          title="Copy shareable URL"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={() => onReopen(entry)}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          title="Reopen in generator"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(entry.id)}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-auto"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const HistoryPage: React.FC<HistoryPageProps> = ({ language, onToast, onSelectQRType }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'recent' | 'favorites'>('recent');

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const refresh = () => setHistory(getHistory());

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
    refresh();
  };

  const handleCopyUrl = (entry: HistoryEntry) => {
    const url = createShareableUrl(entry.qrData);
    navigator.clipboard
      .writeText(url)
      .then(() => onToast('Shareable URL copied to clipboard', 'success'))
      .catch(() => onToast('Failed to copy URL', 'error'));
  };

  const handleReopen = (entry: HistoryEntry) => {
    onSelectQRType(entry.qrData.type);
    updateUrlHash(entry.qrData);
    onToast('Reopened in generator', 'info');
  };

  const handleDelete = (id: string) => {
    removeFromHistory(id);
    refresh();
    onToast('Removed from history', 'info');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      clearHistory();
      refresh();
      onToast('History cleared', 'info');
    }
  };

  const filteredHistory =
    activeTab === 'favorites' ? history.filter((h) => h.favorite) : history;

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-gray-50 via-emerald-50 to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-xl">
              <History className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              History &amp; Favorites
            </h1>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Tabs */}
        {history.length > 0 && (
          <div className="flex gap-2 mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-1.5 w-fit">
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'recent'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'favorites'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Favorites
            </button>
          </div>
        )}

        {/* Content */}
        {filteredHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-4">
              {history.length === 0 ? (
                <History className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Star className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {history.length === 0
                ? 'No history yet'
                : 'No favorites yet'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
              {history.length === 0
                ? 'Your generated QR codes will appear here for quick access.'
                : 'Star your favorite QR codes to find them quickly later.'}
            </p>
            {history.length === 0 && (
              <button
                onClick={() => onSelectQRType('text')}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg font-medium transition-colors"
              >
                <QrCode className="w-5 h-5" />
                Create your first QR code
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredHistory.map((entry) => (
              <HistoryCard
                key={entry.id}
                entry={entry}
                onToggleFavorite={handleToggleFavorite}
                onCopyUrl={handleCopyUrl}
                onReopen={handleReopen}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
