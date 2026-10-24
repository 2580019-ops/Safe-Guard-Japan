import React from 'react';
import { WifiOff, AlertTriangle } from 'lucide-react';
import { SupportedLanguage, UI_TRANSLATIONS } from '../data/phrases';

interface OfflineBannerProps {
  isOnline: boolean;
  language: SupportedLanguage;
  lastUpdated?: string | null;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOnline,
  language,
  lastUpdated
}) => {
  if (isOnline) return null;

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.ja;

  return (
    <aside aria-label="Offline Mode Notification" className="bg-amber-950/90 border-b border-amber-600/50 text-amber-200 px-4 py-2.5 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-amber-800 text-amber-100 flex-shrink-0 animate-pulse">
            <WifiOff className="w-4 h-4" />
          </span>
          <p className="font-medium">
            <strong>{t.offline}:</strong> {t.offline_banner}
          </p>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-1.5 text-amber-300 font-mono text-xs flex-shrink-0">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.last_updated}: {new Date(lastUpdated).toLocaleTimeString()}</span>
          </div>
        )}
      </div>
    </aside>
  );
};
