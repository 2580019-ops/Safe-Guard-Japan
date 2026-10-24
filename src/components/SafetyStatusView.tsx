import React, { useState } from 'react';
import {
  HeartHandshake,
  Share2,
  Copy,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Smartphone,
  Lock,
  MessageSquare
} from 'lucide-react';
import { SupportedLanguage, UI_TRANSLATIONS, SAMPLE_PHRASES } from '../data/phrases';

interface SafetyStatusViewProps {
  language: SupportedLanguage;
  onNavigateHome: () => void;
}

export const SafetyStatusView: React.FC<SafetyStatusViewProps> = ({
  language,
  onNavigateHome
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.ja;

  // Form states
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('safe');
  const [customNote, setCustomNote] = useState<string>('');
  const [includeLocation, setIncludeLocation] = useState<boolean>(false);
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Sharing state
  const [copied, setCopied] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [completionMethod, setCompletionMethod] = useState<'share' | 'copy'>('share');

  // Filter templates from sample phrases
  const templates = SAMPLE_PHRASES.filter((p) => p.category === 'safety_status');
  const activePhrase = templates.find((p) => p.key === selectedTemplateKey) || templates[0];

  // Request location with explicit user permission
  const handleLocationToggle = (checked: boolean) => {
    setIncludeLocation(checked);
    setLocationError(null);

    if (checked && !locationCoords) {
      if (!navigator.geolocation) {
        setLocationError('お使いの端末は位置情報取得に対応していません。');
        setIncludeLocation(false);
        return;
      }

      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocationLoading(false);
          setLocationCoords({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
          });
        },
        (err) => {
          setLocationLoading(false);
          setIncludeLocation(false);
          setLocationError('位置情報の取得が拒否されました。位置情報リンクなしでメッセージを作成します。');
        },
        { timeout: 8000 }
      );
    }
  };

  // Generate localized text + Japanese bilingual text for local Japanese responders
  const currentLangText = activePhrase
    ? ((activePhrase[`text_${language}` as keyof typeof activePhrase] as string) || activePhrase.text_ja)
    : '';
  const japaneseText = activePhrase ? activePhrase.text_ja : '';

  const getFullMessage = (): string => {
    let msg = `【SafeGuard Japan 安否情報 / Safety Report】\n`;
    msg += `■ 状況 / Status:\n${currentLangText}\n`;

    if (language !== 'ja') {
      msg += `（日本語訳: ${japaneseText}）\n`;
    }

    if (customNote.trim()) {
      msg += `\n■ メモ / Note:\n${customNote.trim()}\n`;
    }

    if (includeLocation && locationCoords) {
      msg += `\n■ 現在地マップ / Location Link:\nhttps://maps.google.com/?q=${locationCoords.lat},${locationCoords.lon}\n`;
    }

    msg += `\n日時 / Time: ${new Date().toLocaleString()}\n`;
    msg += `※ SafeGuard Japan 端末ローカル生成 (送信履歴はサーバーに保存されません)`;

    return msg;
  };

  // Share via Web Share API
  const handleShare = async () => {
    const textToShare = getFullMessage();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SafeGuard Japan - 安否確認 / Safety Status',
          text: textToShare
        });
        setCompletionMethod('share');
        setIsCompleted(true);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // Fallback to clipboard
          copyToClipboard();
        }
      }
    } else {
      // Fallback
      copyToClipboard();
    }
  };

  // Fallback Copy to Clipboard
  const copyToClipboard = () => {
    const text = getFullMessage();
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);
        setCompletionMethod('copy');
        setIsCompleted(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(() => {
        alert('クリップボードへのアクセスに失敗しました。プレビュー欄から直接コピーしてください。');
      });
  };

  // Completed feedback view (corresponds to /safety-status/sent)
  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl bg-slate-900 border border-emerald-500/40 p-6 sm:p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            HTTP GET /safety-status/sent
          </span>

          <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
            {t.share_feedback_title}
          </h2>

          <p className="text-sm text-slate-300 mt-2 max-w-md mx-auto leading-relaxed">
            {completionMethod === 'share'
              ? 'お使いの端末で共有画面が開かれました。家族や連絡先にそのまま送信してください。'
              : t.copied_success}
          </p>

          <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 text-left">
            <span className="text-xs text-slate-400 block mb-1 font-semibold">
              共有されたメッセージ内容 / Message Transmitted Locally:
            </span>
            <pre className="text-xs text-slate-200 whitespace-pre-wrap font-sans bg-slate-900 p-3 rounded border border-slate-800/80">
              {getFullMessage()}
            </pre>
          </div>

          {/* Privacy reassurance note */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>個人情報保護方針: メッセージは端末内のみで処理され、サーバー保存は行われません。</span>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsCompleted(false)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition"
            >
              もう一度メッセージを編集する
            </button>
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition"
            >
              {t.btn_back_home}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title & Privacy Header */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-600/10 text-emerald-400 border border-emerald-500/20">
                <HeartHandshake className="w-5 h-5" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {t.safety_title}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              {t.safety_desc}
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30 flex items-center gap-1.5 whitespace-nowrap">
            <Lock className="w-3 h-3" />
            {t.local_processing_badge}
          </span>
        </div>
      </section>

      {/* Generator Form */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-5">
        {/* Template Selector */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2 uppercase tracking-wider">
            1. {t.select_template}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {templates.map((tpl) => {
              const isSelected = selectedTemplateKey === tpl.key;
              const text =
                (tpl[`text_${language}` as keyof typeof tpl] as string) || tpl.text_ja;
              return (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplateKey(tpl.key || 'safe')}
                  className={`cursor-pointer p-3.5 rounded-xl border transition ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500 text-white shadow'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-blue-400 bg-blue-500' : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                    <strong className="text-xs sm:text-sm">{text}</strong>
                  </div>
                  {language !== 'ja' && (
                    <span className="text-[11px] text-slate-400 pl-5 block">
                      {tpl.text_ja}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional Custom Note with Character Limit */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="custom-note-textarea" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              2. {t.optional_message}
            </label>
            <span
              className={`text-xs font-mono font-semibold ${
                customNote.length > 180 ? 'text-amber-400' : 'text-slate-500'
              }`}
            >
              {customNote.length} / 200
            </span>
          </div>
          <textarea
            id="custom-note-textarea"
            rows={3}
            maxLength={200}
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="例: 新宿中央公園の避難テント付近にいます。バッテリー節約のため次回連絡は18時の予定です。"
            className="w-full rounded-xl bg-slate-950 border border-slate-800 p-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
        </div>

        {/* Location Link Toggle */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeLocation}
              onChange={(e) => handleLocationToggle(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-700 bg-slate-900 cursor-pointer"
            />
            <div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200 block">
                {t.include_location}
              </span>
              <span className="text-xs text-slate-400">
                受信者がGoogleマップで位置を開けるリンクがメッセージ末尾に付加されます。
              </span>
              {locationLoading && (
                <span className="text-xs text-blue-400 font-mono mt-1 block animate-pulse">
                  GPS位置情報を測位中...
                </span>
              )}
              {locationCoords && includeLocation && (
                <span className="text-xs text-emerald-400 font-mono mt-1 block">
                  測位完了: {locationCoords.lat.toFixed(4)}, {locationCoords.lon.toFixed(4)}
                </span>
              )}
              {locationError && (
                <span className="text-xs text-amber-400 mt-1 block">
                  {locationError}
                </span>
              )}
            </div>
          </label>
        </div>

        {/* Live Message Preview Card */}
        <div>
          <label className="text-xs font-bold text-slate-300 block mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
            3. {t.preview_message}
          </label>
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-200 leading-relaxed shadow-inner">
            <pre className="whitespace-pre-wrap font-sans">{getFullMessage()}</pre>
          </div>
        </div>

        {/* Action Buttons: Web Share API & Clipboard Fallback */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleShare}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>{t.btn_share}</span>
          </button>

          <button
            onClick={copyToClipboard}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition active:scale-95"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t.copied_success : t.btn_copy}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
