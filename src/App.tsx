/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { OfflineBanner } from './components/OfflineBanner';
import { DashboardView, AlertData } from './components/DashboardView';
import { AlertDetailView } from './components/AlertDetailView';
import { ShelterMapView } from './components/ShelterMapView';
import { SafetyStatusView } from './components/SafetyStatusView';
import { BackendDocsModal } from './components/BackendDocsModal';
import { EarthquakeDrillAnimation } from './components/EarthquakeDrillAnimation';
import { EarthquakeGuideView } from './components/EarthquakeGuideView';
import { usePWA } from './hooks/usePWA';
import { SupportedLanguage, UI_TRANSLATIONS } from './data/phrases';
import { apiUrl, isApiConfigured } from './api';

export default function App() {
  // Multilingual preference with LocalStorage persistence
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('safeguard_lang');
    if (saved && ['ja', 'en', 'bn', 'vi'].includes(saved)) {
      return saved as SupportedLanguage;
    }
    return 'ja';
  });

  // Active view tab: 'dashboard' | 'alert-info' | 'shelters' | 'safety'
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Backend documentation modal
  const [isBackendDocsOpen, setIsBackendDocsOpen] = useState<boolean>(false);

  // Disaster alert state
  const [alertData, setAlertData] = useState<AlertData | null>(null);
  const [isAlertLoading, setIsAlertLoading] = useState<boolean>(false);
  const [lastFetchedAt, setLastFetchedAt] = useState<string | null>(null);

  // PWA & Connectivity hook
  const { isOnline, isInstallable, isInstalled, isIOS, triggerInstall } = usePWA();

  // Save language to localStorage whenever changed
  const handleLanguageChange = (lang: SupportedLanguage) => {
    setLanguage(lang);
    localStorage.setItem('safeguard_lang', lang);
  };

  // Fetch JMA disaster alert from backend
  const fetchAlert = useCallback(async () => {
    setIsAlertLoading(true);
    try {
      if (!isApiConfigured) throw new Error('Alert API is not configured');
      const res = await fetch(`${apiUrl('/api/alert')}?language=${language}`);
      if (res.ok) {
        const json = await res.json();
        setAlertData(json.data);
        setLastFetchedAt(json.data.cachedAt || new Date().toISOString());
        // Cache to localStorage for offline reload
        localStorage.setItem('safeguard_cached_alert', JSON.stringify(json.data));
      } else {
        throw new Error('Server returned non-200');
      }
    } catch {
      // Offline fallback: load from local storage if available
      const localCached = localStorage.getItem('safeguard_cached_alert');
      if (localCached) {
        try {
          const parsed = JSON.parse(localCached);
          setAlertData({
            ...parsed,
            isCached: true,
            warning: 'Network request failed. Displaying previously cached emergency alert.'
          });
          setLastFetchedAt(parsed.cachedAt);
        } catch {
          // ignore
        }
      } else {
        // Fallback baseline
        setAlertData({
          alertType: 'info',
          title: language === 'en' ? 'No Major Active Disaster Alerts' : '現在、大規模な警報はありません',
          affectedArea: '全国 (Nationwide)',
          intensity: '平常時 (Normal)',
          magnitude: 'N/A',
          announcementTime: new Date().toISOString(),
          severity: 'info',
          instructions: UI_TRANSLATIONS[language]?.normal_conditions_text || '平常時です。備えを確認してください。',
          source: 'JMA Baseline',
          isCached: true
        });
      }
    } finally {
      setIsAlertLoading(false);
    }
  }, [language]);

  useEffect(() => {
    fetchAlert();
  }, [fetchAlert]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Offline Connectivity Warning Banner */}
      <OfflineBanner
        isOnline={isOnline}
        language={language}
        lastUpdated={lastFetchedAt}
      />

      {/* Top Header & Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        language={language}
        onLanguageChange={handleLanguageChange}
        isOnline={isOnline}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isIOS={isIOS}
        onInstall={triggerInstall}
        onOpenBackendDocs={() => setIsBackendDocsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            alert={alertData}
            isLoading={isAlertLoading}
            isOnline={isOnline}
            language={language}
            onRefreshAlert={fetchAlert}
            onNavigate={setCurrentTab}
          />
        )}

        {currentTab === 'alert-info' && (
          <AlertDetailView
            alert={alertData}
            language={language}
            onBackToDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {(currentTab === 'guide' || currentTab === 'drill') && (
          <EarthquakeGuideView
            language={language}
            onBackToDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'shelters' && (
          <ShelterMapView
            language={language}
            isOnline={isOnline}
          />
        )}

        {currentTab === 'safety' && (
          <SafetyStatusView
            language={language}
            onNavigateHome={() => setCurrentTab('dashboard')}
          />
        )}
      </main>

      {/* Spring Boot & MariaDB Specs Modal */}
      <BackendDocsModal
        isOpen={isBackendDocsOpen}
        onClose={() => setIsBackendDocsOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-400">
            SafeGuard Japan (セーフガード・ジャパン) — Multilingual Disaster Preparedness Portal
          </p>
          <p className="text-[11px] text-slate-500">
            Disaster Information: Japan Meteorological Agency (JMA) Open Data Feed.
            Shelter coordinates are development sample data. Follow official local municipal instructions during real emergencies.
          </p>
          <p className="text-[11px] text-slate-600">
            PWA Enabled &bull; No Personal Data Collected &bull; Read-Only Database Architecture &bull; Local Device Sharing Only
          </p>
        </div>
      </footer>
    </div>
  );
}
