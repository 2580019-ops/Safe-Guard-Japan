import React from 'react';
import {
  Video,
  ShieldAlert,
  GraduationCap,
  Sparkles,
  Info,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Flame,
  Activity
} from 'lucide-react';
import { SupportedLanguage } from '../data/phrases';
import { EarthquakeDrillAnimation } from './EarthquakeDrillAnimation';

interface EmergencyEducationProps {
  language: SupportedLanguage;
}

export const EmergencyEducation: React.FC<EmergencyEducationProps> = ({ language }) => {
  const content = {
    ja: {
      badge: '緊急防災教育アニメーション動画',
      title: '地震発生時の身の守り方：ドロップ・カバー・ホールドオン実技解説',
      subtitle: '勉強中や作業中に地震が起きた場合、どのように机の下へ入り、頭や首を落下物から守るかを視覚的に再現した教育用シミュレーションです。',
      video_tag: 'AI生成・物理シミュレーション動画',
      drill_tag: '60秒実技訓練タイマー搭載',
      highlights_title: '動画で学ぶ3つの重要ポイント',
      point1_title: 'なぜ机の下に入るのか？',
      point1_desc: '照明器具、天井板、分厚い本などの落下物を頑丈な天板が跳ね返し、頭部への直撃を防ぎます。',
      point2_title: 'なぜ首の後ろを腕で覆うのか？',
      point2_desc: '脳幹と頸椎（首の神経）を守るためです。天板で防げない横からのガラス破片からも防御します。',
      point3_title: 'なぜ机の脚を強く握るのか？',
      point3_desc: '震度6以上の激しい揺れでは机が滑って飛んでいきます。脚を掴むことで机と一緒に移動できます。'
    },
    en: {
      badge: 'Emergency Education & Drill Simulation Video',
      title: 'How to Protect Yourself: Drop, Cover, and Hold On Video Guide',
      subtitle: 'An educational visual simulation demonstrating how to seek immediate shelter under a study desk during an earthquake in Japan, protecting your head and body from falling hazards.',
      video_tag: 'AI-Generated Animated Simulation',
      drill_tag: 'Interactive 60s Drill Timer Included',
      highlights_title: '3 Core Protection Techniques Demonstrated',
      point1_title: 'Why get under a sturdy desk?',
      point1_desc: 'The solid tabletop absorbs impact and deflects falling lights, ceiling tiles, and hardcover books harmlessly.',
      point2_title: 'Why shield the nape of your neck?',
      point2_desc: 'Protects the vulnerable brainstem and cervical vertebrae from glass shards and lateral impacts.',
      point3_title: 'Why grip the desk leg tightly?',
      point3_desc: 'Severe lateral ground motion slides desks across floors. Gripping the leg keeps your protective shield over you.'
    },
    bn: {
      badge: 'জরুরি দুর্যোগ শিক্ষা অ্যানিমেশন ভিডিও',
      title: 'ভূমিকম্পে জীবন রক্ষার সঠিক কৌশল: ড্রপ, কভার ও হোল্ড অন ভিডিও গাইড',
      subtitle: 'পড়াশোনার সময় বা ক্লাসে ভূমিকম্প শুরু হলে কীভাবে টেবিলের নিচে মাথা ও শরীর সুরক্ষিত রাখবেন—তা সহজে বোঝার জন্য তৈরি অ্যানিমেটেড ভিডিও ও ৬০ সেকেন্ড প্র্যাকটিস টাইমার।',
      video_tag: 'অ্যানিমেটেড সিমুলেশন ভিডিও',
      drill_tag: '৬০ সেকেন্ড ড্রিল টাইমার অন্তর্ভুক্ত',
      highlights_title: 'ভিডিও থেকে শেখার প্রধান ৩টি কৌশল',
      point1_title: 'কেন টেবিলের নিচে যাবেন?',
      point1_desc: 'ওপর থেকে ফ্যান, লাইট বা বইয়ের তাক ভেঙে পড়লে শক্ত কাঠের টেবিল ঢাল হিসেবে কাজ করে এবং আঘাত থেকে শরীর বাঁচায়।',
      point2_title: 'কেন হাত দিয়ে ঘাড় ও মাথা ঢাকবেন?',
      point2_desc: 'ঘাড়ের সংবেদনশীল স্নায়ুরজ্জু (Brainstem) রক্ষা করা সবচেয়ে জরুরি। হাত দিয়ে চেপে রাখলে কাচের গুঁড়ো সরাসরি লাগে না।',
      point3_title: 'কেন টেবিলের পায়া শক্ত করে আঁকড়ে ধরবেন?',
      point3_desc: 'ভূমিকম্পের তীব্র ঝাঁকুনিতে টেবিল পিছলে সরে যেতে পারে। পায়া ধরে রাখলে টেবিল সরে গেলেও আপনি সুরক্ষিত ছাতার নিচে থাকবেন।'
    },
    vi: {
      badge: 'Video giáo dục phòng chống động đất khẩn cấp',
      title: 'Cách tự bảo vệ khi có động đất: Video kỹ thuật Cúi thấp, Che chắn & Giữ chặt',
      subtitle: 'Mô phỏng trực quan cách ẩn nấp an toàn dưới gầm bàn học khi xảy ra động đất, che chắn đầu và cơ thể khỏi vật thể rơi từ trên cao.',
      video_tag: 'Video mô phỏng chuyển động',
      drill_tag: 'Kèm đồng hồ đếm ngược 60 giây',
      highlights_title: '3 Điểm cốt lõi được minh họa trong video',
      point1_title: 'Tại sao phải chui xuống gầm bàn?',
      point1_desc: 'Mặt bàn gỗ kiên cố giúp chắn lại đèn trần, tấm thạch cao và sách nặng rơi xuống, bảo vệ hộp sọ.',
      point2_title: 'Tại sao phải lấy cánh tay che sau gáy?',
      point2_desc: 'Bảo vệ đốt sống cổ và tủy sống nguy kịch khỏi mảnh kính vỡ văng ngang.',
      point3_title: 'Tại sao phải nắm chặt chân bàn?',
      point3_desc: 'Rung chấn mạnh có thể làm bàn bị trượt đi. Nắm chắc chân bàn giúp mái che luôn che chắn phía trên bạn.'
    }
  };

  const t = content[language] || content.ja;

  return (
    <section className="space-y-4">
      {/* Education Video Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-3xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/30 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/40 text-xs font-mono font-bold tracking-wider uppercase">
              <Video className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              <span>{t.badge}</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-900/40 text-blue-300 border border-blue-500/30">
              {t.video_tag}
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-900/40 text-amber-300 border border-amber-500/30">
              {t.drill_tag}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {t.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Embedded Animated Player & 60s Drill Component */}
      <EarthquakeDrillAnimation language={language} />

      {/* Educational Highlights Cards */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{t.highlights_title}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{t.point1_title}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {t.point1_desc}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{t.point2_title}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {t.point2_desc}
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{t.point3_title}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {t.point3_desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
