import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { RefreshCw, X } from 'lucide-react';

const UpdatePrompt: React.FC = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
      },
      onOfflineReady() {
        setOfflineReady(true);
      },
    });

    return () => {
      updateSW();
    };
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  const close = () => {
    setNeedRefresh(false);
    setOfflineReady(false);
  };

  if (!needRefresh && !offlineReady) return null;

  return (
    <div className="fixed top-4 right-4 z-[70] animate-slide-in-right">
      <div className="max-w-sm w-full bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-700 rounded-xl shadow-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <RefreshCw className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {needRefresh ? 'Update available' : 'Ready for offline use'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {needRefresh ? 'A new version is available. Refresh to update.' : 'App cached for offline access.'}
            </p>
            {needRefresh && (
              <button
                onClick={handleUpdate}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh now
              </button>
            )}
          </div>
          <button
            onClick={close}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePrompt;
