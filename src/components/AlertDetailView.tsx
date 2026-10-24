import React from 'react';
import {
  AlertTriangle,
  Radio,
  Clock,
  MapPin,
  Activity,
  Layers,
  ShieldAlert,
  Info,
  Waves,
  CloudRain,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { SupportedLanguage, UI_TRANSLATIONS } from '../data/phrases';
import { ALERT_DETAIL_TRANSLATIONS } from '../data/shindoAndLevels';
import { AlertData } from './DashboardView';
import { EarthquakeDrillAnimation } from './EarthquakeDrillAnimation';

interface AlertDetailViewProps {
  alert: AlertData | null;
  language: SupportedLanguage;
  onBackToDashboard: () => void;
}

export const AlertDetailView: React.FC<AlertDetailViewProps> = ({
  alert,
  language,
  onBackToDashboard
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.ja;
  const detailT = ALERT_DETAIL_TRANSLATIONS[language] || ALERT_DETAIL_TRANSLATIONS.ja;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t.nav_dashboard}</span>
        </button>

        <span className="text-xs font-mono text-slate-400">
          HTTP GET /alert-info
        </span>
      </div>

      {/* Current Real-time Observation Card */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-7 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-600/10 text-red-400 border border-red-500/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {alert?.title || detailT.pageTitle}
            </h2>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            {detailT.sourceBadge}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">
              {detailT.epicenterLabel}
            </span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span className="text-base font-bold text-white truncate">
                {alert?.affectedArea || '全国 (Domestic Japan)'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">
              {detailT.intensityLabel}
            </span>
            <span className="text-base font-bold text-amber-400 block">
              {alert?.intensity || '平常時 (Normal)'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">
              {detailT.magnitudeLabel}
            </span>
            <span className="text-base font-bold text-slate-200 block font-mono">
              {alert?.magnitude || '—'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 block mb-1">
              {detailT.timeLabel}
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-slate-300 font-mono">
                {alert?.announcementTime
                  ? new Date(alert.announcementTime).toLocaleString()
                  : '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-300 leading-relaxed">
          <strong className="text-white block mb-1">{detailT.recommendedActionLabel}:</strong>
          {alert?.instructions || t.normal_conditions_text}
        </div>
      </section>

      {/* Interactive Earthquake Survival Video & Animation Drill */}
      <section className="space-y-2">
        <EarthquakeDrillAnimation language={language} />
      </section>

      {/* Japan Seismic Intensity Scale (Shindo 震度) Breakdown - 100% Multilingual */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {detailT.shindoSectionTitle}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {detailT.shindoSectionDesc}
        </p>

        <div className="space-y-2.5 pt-1">
          {detailT.shindoList.map((s) => (
            <div
              key={s.level}
              className={`p-3.5 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${s.color}`}
            >
              <div className="min-w-[170px] flex-shrink-0">
                <strong className="text-sm font-black block tracking-wide">
                  {s.level}
                </strong>
                <span className="text-xs opacity-90 font-medium">
                  {s.name}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 flex-1 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Evacuation Alert Levels (警戒レベル 1〜5) - 100% Multilingual */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {detailT.evacuationSectionTitle}
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {detailT.evacuationSectionDesc}
        </p>

        <div className="space-y-2.5 pt-1">
          {detailT.evacuationList.map((lvl) => (
            <div
              key={lvl.level}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2.5 min-w-[240px] flex-shrink-0">
                <span className={`px-2.5 py-1 rounded-md text-xs font-black shadow-sm ${lvl.badge}`}>
                  {lvl.level}
                </span>
                <strong className="text-xs sm:text-sm text-white">{lvl.name}</strong>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 flex-1 leading-relaxed">
                {lvl.action}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Official Data Source Documentation - 100% Multilingual */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl text-xs text-slate-400 space-y-2.5">
        <h4 className="font-bold text-slate-300 text-sm flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-400" />
          <span>{detailT.jmaSpecsTitle}</span>
        </h4>
        <p className="leading-relaxed">
          {detailT.jmaSpecsBody1}
        </p>
        <p className="leading-relaxed text-slate-400/90">
          {detailT.jmaSpecsBody2}
        </p>
      </section>
    </div>
  );
};
