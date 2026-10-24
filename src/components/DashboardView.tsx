import React from 'react';
import {
  AlertTriangle,
  Radio,
  MapPin,
  HeartHandshake,
  Clock,
  PhoneCall,
  Activity,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  GraduationCap,
  BookOpen
} from 'lucide-react';
import { SupportedLanguage, UI_TRANSLATIONS } from '../data/phrases';
import { EarthquakeDrillAnimation } from './EarthquakeDrillAnimation';

export interface AlertData {
  alertType: string;
  title: string;
  affectedArea: string;
  announcementTime: string;
  intensity: string;
  magnitude?: string;
  severity: 'critical' | 'warning' | 'advisory' | 'info';
  instructions: string;
  source: string;
  isCached: boolean;
  cachedAt?: string;
  warning?: string;
}

interface DashboardViewProps {
  alert: AlertData | null;
  isLoading: boolean;
  isOnline: boolean;
  language: SupportedLanguage;
  onRefreshAlert: () => void;
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  alert,
  isLoading,
  isOnline,
  language,
  onRefreshAlert,
  onNavigate
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.ja;

  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-red-600 text-white animate-pulse shadow-md shadow-red-600/50">
            <AlertTriangle className="w-3.5 h-3.5" />
            CRITICAL EMERGENCY
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-500 text-slate-950 shadow-md">
            <AlertTriangle className="w-3.5 h-3.5" />
            WARNING
          </span>
        );
      case 'advisory':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
            <Info className="w-3.5 h-3.5" />
            ADVISORY
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            NORMAL / NO SEVERE ALERT
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Alert Banner / Main Card */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-700/80 p-5 sm:p-7 shadow-2xl">
        {/* Subtle background radar ring */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />

        {/* Top Header of the card */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                {t.jma_source}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {alert?.title || '気象庁 防災速報'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {alert && getSeverityBadge(alert.severity)}

            {alert?.isCached ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-900/40 text-amber-300 border border-amber-600/40">
                <Clock className="w-3 h-3" />
                {t.cached_badge}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-red-950/60 text-red-300 border border-red-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                {t.live_badge}
              </span>
            )}

            <button
              onClick={onRefreshAlert}
              disabled={isLoading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition active:rotate-180 disabled:opacity-50"
              title="Refresh JMA data (60s cache)"
              aria-label="Refresh disaster data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Disaster Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
          {/* Affected Area */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90">
            <span className="text-xs font-medium text-slate-400 block mb-1">
              {t.card_affected_area}
            </span>
            <div className="text-lg sm:text-xl font-bold text-white flex items-baseline gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span className="truncate">{alert?.affectedArea || '全国 (Nationwide)'}</span>
            </div>
          </div>

          {/* Intensity / Magnitude */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90">
            <span className="text-xs font-medium text-slate-400 block mb-1">
              {t.card_intensity_scale}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-amber-400">
                {alert?.intensity || t.card_normal_intensity}
              </span>
              {alert?.magnitude && alert.magnitude !== 'N/A' && (
                <span className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                  {alert.magnitude}
                </span>
              )}
            </div>
          </div>

          {/* Announcement Timestamp */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90">
            <span className="text-xs font-medium text-slate-400 block mb-1">
              {t.card_announcement_time}
            </span>
            <div className="text-sm sm:text-base font-semibold text-slate-200 flex items-center gap-1.5 font-mono">
              <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>
                {alert?.announcementTime
                  ? new Date(alert.announcementTime).toLocaleString()
                  : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Instructions Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-slate-100">
          <div className="flex items-center gap-2 mb-2 text-blue-300 font-bold text-sm sm:text-base">
            <Activity className="w-4 h-4 text-blue-400" />
            <span>{t.action_instructions}</span>
          </div>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            {alert?.instructions || t.normal_conditions_text}
          </p>
        </div>

        {/* Cached Data Warning (Disaster Guideline: Never claim cached is current) */}
        {alert?.isCached && (
          <div className="mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{t.cached_notice_title}:</p>
              <p className="text-amber-300/90 mt-0.5">
                {t.cached_notice_desc} ({t.last_fetched}: {alert.cachedAt ? new Date(alert.cachedAt).toLocaleTimeString() : '—'})
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Earthquake Preparedness Guide Feature Banner & Direct Action */}
      <section
        onClick={() => onNavigate('guide')}
        className="group cursor-pointer relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 border border-red-500/40 p-5 sm:p-6 shadow-2xl hover:border-red-400 transition"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-red-600/10 blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-600 text-white">
                  DROP &bull; COVER &bull; HOLD ON
                </span>
                <span className="text-xs text-red-300 font-semibold">
                  {language === 'bn' ? 'টেবিলের নিচে সঠিক ভঙ্গি' : language === 'ja' ? '机の下の防御姿勢' : language === 'vi' ? 'Tư thế chuẩn dưới gầm bàn' : 'Posture Under Table'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-1 group-hover:text-red-200 transition">
                {t.prep_guide_title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {t.prep_guide_desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-md group-hover:translate-x-1 transition flex-shrink-0">
            <span>{t.btn_open_prep_guide}</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* Earthquake Survival Interactive Animated Video & Drill Player directly on Dashboard */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
              {language === 'bn' ? 'ভূমিকম্পে সুরক্ষা অ্যানিমেটেড ভিডিও' : language === 'ja' ? '地震防災アニメーション動画' : language === 'vi' ? 'Video Hoạt Hình Phòng Tránh Động Đất' : 'Earthquake Protection Animated Video'}
            </span>
          </div>
          <button
            onClick={() => onNavigate('guide')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition"
          >
            <span>{t.btn_open_prep_guide}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <EarthquakeDrillAnimation language={language} />
      </section>

      {/* Quick Action Navigation Buttons (4-Card Grid) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Earthquake Preparedness Guide Card */}
        <div
          onClick={() => onNavigate('guide')}
          className="group relative cursor-pointer p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:bg-slate-850 transition shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-red-300 transition flex items-center justify-between">
            <span>{language === 'bn' ? 'ভূমিকম্প প্রস্তুতি গাইড' : language === 'ja' ? '地震防災ガイド' : language === 'vi' ? 'Hướng dẫn phòng tránh' : 'Earthquake Guide'}</span>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {language === 'bn' ? 'টেবিলের নিচে মাথা ও শরীর রক্ষার সঠিক ভঙ্গি ও অ্যানাটমি নির্দেশিকা।' : language === 'ja' ? '机の下での正しい防御姿勢をイラストと解剖図で徹底解説。' : language === 'vi' ? 'Hướng dẫn tư thế chuẩn dưới gầm bàn với sơ đồ giải phẫu tương tác.' : 'Visual step-by-step posture guide for taking cover under a table.'}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-red-400">
            <span>{t.btn_open_prep_guide}</span>
            <span>&rarr;</span>
          </div>
        </div>

        {/* Find Shelters Card */}
        <div
          onClick={() => onNavigate('shelters')}
          className="group relative cursor-pointer p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition flex items-center justify-between">
            <span>{t.btn_find_shelters}</span>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {t.shelter_search_desc}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-400">
            <span>{t.btn_go_to_shelters}</span>
            <span>&rarr;</span>
          </div>
        </div>

        {/* Safety Confirmation Card */}
        <div
          onClick={() => onNavigate('safety')}
          className="group relative cursor-pointer p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 transition shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition flex items-center justify-between">
            <span>{t.btn_create_safety_msg}</span>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {t.safety_desc}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <span>{t.btn_go_to_safety}</span>
            <span>&rarr;</span>
          </div>
        </div>

        {/* Detailed Alerts Card */}
        <div
          onClick={() => onNavigate('alert-info')}
          className="group relative cursor-pointer p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 transition shadow-lg"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Info className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition flex items-center justify-between">
            <span>{t.btn_view_alert_details}</span>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {t.alert_card_desc}
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <span>{t.btn_go_to_alert_details}</span>
            <span>&rarr;</span>
          </div>
        </div>
      </section>

      {/* Emergency Contacts Widget for Japan */}
      <section className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-red-400" />
            <span>{t.emergency_contacts_title}</span>
          </h3>
          <span className="text-xs text-slate-400">24時間対応 / 24/7 Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a
            href="tel:119"
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/50 transition group"
          >
            <div>
              <span className="text-xs text-slate-400 block">{t.ambulance_fire}</span>
              <span className="text-xl font-black text-red-400 font-mono">119</span>
            </div>
            <PhoneCall className="w-4 h-4 text-slate-600 group-hover:text-red-400 transition" />
          </a>

          <a
            href="tel:110"
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500/50 transition group"
          >
            <div>
              <span className="text-xs text-slate-400 block">{t.police}</span>
              <span className="text-xl font-black text-blue-400 font-mono">110</span>
            </div>
            <PhoneCall className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition" />
          </a>

          <a
            href="tel:171"
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 transition group"
          >
            <div>
              <span className="text-xs text-slate-400 block">{t.disaster_voice}</span>
              <span className="text-xl font-black text-amber-400 font-mono">171</span>
            </div>
            <PhoneCall className="w-4 h-4 text-slate-600 group-hover:text-amber-400 transition" />
          </a>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-center">
            <span className="text-xs text-slate-400 block">{t.japan_helpline}</span>
            <span className="text-xs text-emerald-400 font-semibold mt-1">
              JNTO (多言語対応) 050-3816-2720
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
