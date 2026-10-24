import React, { useState } from 'react';
import {
  ShieldAlert,
  Globe2,
  Wifi,
  WifiOff,
  Download,
  Layers,
  MapPin,
  HeartHandshake,
  Info,
  Menu,
  X,
  Video,
  GraduationCap
} from 'lucide-react';
import { SupportedLanguage, UI_TRANSLATIONS } from '../data/phrases';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  isOnline: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  onInstall: () => void;
  onOpenBackendDocs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  language,
  onLanguageChange,
  isOnline,
  isInstallable,
  isInstalled,
  isIOS,
  onInstall,
  onOpenBackendDocs
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.ja;

  const languages: { code: SupportedLanguage; label: string; nativeName: string }[] = [
    { code: 'ja', label: '日本語', nativeName: 'Japanese' },
    { code: 'en', label: 'English', nativeName: 'English' },
    { code: 'bn', label: 'বাংলা', nativeName: 'Bengali' },
    { code: 'vi', label: 'Tiếng Việt', nativeName: 'Vietnamese' }
  ];

  const handleNavClick = (tab: string) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Logo & Name */}
            <div
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-900 flex items-center justify-center text-white shadow-lg shadow-red-600/30 ring-2 ring-red-500/30 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                    SafeGuard Japan
                  </span>
                  <span className="hidden md:inline-block text-[11px] font-bold px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                    JMA防災
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                  セーフガード・ジャパン
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                  currentTab === 'dashboard'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Layers className="w-4 h-4" />
                {t.nav_dashboard}
              </button>

              <button
                onClick={() => handleNavClick('alert-info')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                  currentTab === 'alert-info'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Info className="w-4 h-4" />
                {t.nav_alert_info}
              </button>

              <button
                onClick={() => handleNavClick('guide')}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 ${
                  currentTab === 'guide' || currentTab === 'drill'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/40 ring-2 ring-red-400/50'
                    : 'bg-red-950/40 text-red-200 border border-red-500/40 hover:bg-red-900/60 hover:text-white shadow-sm'
                }`}
              >
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-red-400" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                </div>
                <span>{t.nav_guide || t.nav_drill}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 shadow-sm animate-pulse">
                  {language === 'bn' ? 'ভিডিও + ৬০ সে.' : language === 'vi' ? 'Video + 60s' : language === 'en' ? 'Video & 60s Drill' : '動画＆訓練'}
                </span>
              </button>

              <button
                onClick={() => handleNavClick('shelters')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                  currentTab === 'shelters'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <MapPin className="w-4 h-4" />
                {t.nav_shelters}
              </button>

              <button
                onClick={() => handleNavClick('safety')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                  currentTab === 'safety'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                {t.nav_safety}
              </button>
            </nav>

            {/* Right Controls: Online Status, Lang Selector, Install, Backend Specs */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Online / Offline Status Badge */}
              <div
                className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  isOnline
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-950/80 text-amber-300 border-amber-500/40 animate-pulse'
                }`}
                title={isOnline ? t.online : t.offline}
              >
                {isOnline ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <Wifi className="w-3.5 h-3.5" />
                    <span className="hidden xl:inline">{t.online}</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <WifiOff className="w-3.5 h-3.5" />
                    <span className="hidden xl:inline">{t.offline}</span>
                  </>
                )}
              </div>

              {/* Language Selector Dropdown */}
              <div className="relative flex items-center">
                <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1 text-xs">
                  <Globe2 className="w-3.5 h-3.5 text-blue-400 mr-1.5 flex-shrink-0" />
                  <select
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
                    className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1"
                    aria-label="Select Language"
                  >
                    {languages.map((l) => (
                      <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100">
                        {l.label} ({l.code.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* PWA In-App Install Button */}
              {isInstallable && (
                <button
                  onClick={onInstall}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition active:scale-95"
                  title="Install SafeGuard Japan PWA"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.install_pwa}</span>
                </button>
              )}

              {/* iOS Safari Guide Button if on iOS and not standalone */}
              {isIOS && !isInstalled && (
                <button
                  onClick={() => setShowIOSModal(true)}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Install (iOS)</span>
                </button>
              )}

              {/* Spring Boot & MariaDB Architecture button */}
              <button
                onClick={onOpenBackendDocs}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 border border-slate-700 text-xs font-medium transition"
                title="View Spring Boot, MariaDB, and MyBatis specs"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Java 17 / MariaDB</span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-5 space-y-2">
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                currentTab === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              {t.nav_dashboard}
            </button>

            <button
              onClick={() => handleNavClick('alert-info')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                currentTab === 'alert-info'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Info className="w-4 h-4" />
              {t.nav_alert_info}
            </button>

            <button
              onClick={() => handleNavClick('guide')}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition border ${
                currentTab === 'guide' || currentTab === 'drill'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-400 shadow-lg shadow-red-600/30'
                  : 'bg-red-950/50 text-red-100 border-red-500/50 hover:bg-red-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-600/30 border border-red-500/40 flex items-center justify-center text-red-300">
                  <GraduationCap className="w-4 h-4 animate-pulse" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-white">{t.nav_guide || t.nav_drill}</span>
                    <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-amber-400 text-slate-950">
                      NEW
                    </span>
                  </div>
                  <p className="text-[11px] text-red-200/80 font-normal">
                    {language === 'bn' ? 'অ্যানিমেশন ভিডিও ও ৬০ সে. ড্রিল' : language === 'vi' ? 'Video mô phỏng & 60s' : language === 'en' ? 'Animation video & 60s drill' : '実演アニメ動画＆60秒ドリル'}
                  </p>
                </div>
              </div>
              <span className="text-xs text-red-300 font-bold">&rarr;</span>
            </button>

            <button
              onClick={() => handleNavClick('shelters')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                currentTab === 'shelters'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4" />
              {t.nav_shelters}
            </button>

            <button
              onClick={() => handleNavClick('safety')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                currentTab === 'safety'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              {t.nav_safety}
            </button>

            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenBackendDocs();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <span>Spring Boot 3 & MariaDB Schema</span>
                <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Backend Docs
                </span>
              </button>

              {isInstallable && (
                <button
                  onClick={() => {
                    onInstall();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-emerald-600 text-white"
                >
                  <Download className="w-4 h-4" />
                  {t.install_pwa}
                </button>
              )}

              {isIOS && !isInstalled && (
                <button
                  onClick={() => {
                    setShowIOSModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-slate-800 text-slate-200"
                >
                  <Download className="w-4 h-4 text-blue-400" />
                  Install PWA on iOS
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* iOS Safari Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-400" />
                Install on iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              Safari on iOS allows home screen installation:
            </p>
            <ol className="text-sm text-slate-300 space-y-2 list-decimal list-inside bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <li>Tap the <strong className="text-white">Share</strong> button in Safari toolbar.</li>
              <li>Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.</li>
              <li>Tap <strong className="text-white">Add</strong> at top right.</li>
            </ol>
            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};
