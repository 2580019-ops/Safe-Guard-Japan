import { SupportedLanguage } from './phrases';

export interface ShindoItem {
  level: string;
  name: string;
  desc: string;
  color: string;
}

export interface EvacuationLevelItem {
  level: string;
  name: string;
  action: string;
  badge: string;
}

export interface AlertDetailTranslation {
  pageTitle: string;
  sourceBadge: string;
  epicenterLabel: string;
  intensityLabel: string;
  magnitudeLabel: string;
  timeLabel: string;
  recommendedActionLabel: string;
  shindoSectionTitle: string;
  shindoSectionDesc: string;
  shindoList: ShindoItem[];
  evacuationSectionTitle: string;
  evacuationSectionDesc: string;
  evacuationList: EvacuationLevelItem[];
  jmaSpecsTitle: string;
  jmaSpecsBody1: string;
  jmaSpecsBody2: string;
}

export const ALERT_DETAIL_TRANSLATIONS: Record<SupportedLanguage, AlertDetailTranslation> = {
  ja: {
    pageTitle: '気象庁 最新震度・警報詳細情報',
    sourceBadge: '気象庁（JMA）公式データ',
    epicenterLabel: '震源・対象地域',
    intensityLabel: '観測最大震度',
    magnitudeLabel: '地震規模 (マグニチュード)',
    timeLabel: '発表時刻 (JST)',
    recommendedActionLabel: '推奨緊急行動 / Recommended Action',
    shindoSectionTitle: '日本の気象庁震度階級（Shindo Scale）解説',
    shindoSectionDesc:
      '日本国内では地震の揺れの大きさを「震度（0〜7の10階級）」で表します。マグニチュード（M）が地震そのもののエネルギーを表すのに対し、震度は各地点での揺れの激しさを表します。',
    shindoList: [
      {
        level: '震度 7',
        name: '激震',
        desc: '耐震性の高い建物でも傾いたり倒壊するものがある。立っていることができず、這わないと動けない。',
        color: 'bg-purple-950 text-purple-300 border-purple-500/40'
      },
      {
        level: '震度 6強 / 6弱',
        name: '烈震',
        desc: '立っていることが困難。固定していない家具のほとんどが移動・転倒する。壁のタイルや窓ガラスが破損落下する。',
        color: 'bg-red-950 text-red-300 border-red-500/40'
      },
      {
        level: '震度 5強 / 5弱',
        name: '強震',
        desc: '物につかまらないと歩くことが難しい。棚にある食器類や本が落ちる。固定していない家具が動く。',
        color: 'bg-amber-950 text-amber-300 border-amber-500/40'
      },
      {
        level: '震度 4 / 3',
        name: '中震',
        desc: 'ほとんどの人が揺れを感じる。電灯などの吊り下げ物が大きく揺れる。眠っている人の大半が目を覚ます。',
        color: 'bg-yellow-950 text-yellow-300 border-yellow-500/40'
      },
      {
        level: '震度 2 / 1',
        name: '軽微・微震',
        desc: '屋内で静かにしている人の大半が感じる。日常生活に大きな支障はありません。',
        color: 'bg-slate-900 text-slate-300 border-slate-700'
      }
    ],
    evacuationSectionTitle: '日本の避難情報・警戒レベル（警戒レベル 1〜5）',
    evacuationSectionDesc:
      '市町村から発令される避難指示等は5段階の警戒レベルで周知されます。レベル4発令で対象地域の全員が避難を完了する必要があります。',
    evacuationList: [
      {
        level: '警戒レベル 5',
        name: '緊急安全確保 (Emergency Safety Assurance)',
        action: '命の危険。直ちに命を守る最善の行動（上の階や頑丈な建物へ垂直避難）をとってください。',
        badge: 'bg-purple-600 text-white'
      },
      {
        level: '警戒レベル 4',
        name: '避難指示 (Evacuation Order)',
        action: '危険な場所から全員直ちに立ち退き避難してください。避難所へ移動できない場合は垂直避難を行ってください。',
        badge: 'bg-red-600 text-white'
      },
      {
        level: '警戒レベル 3',
        name: '高齢者等避難 (Evacuate the Elderly)',
        action: '高齢者や障がいのある方、避難に時間を要する方は危険な場所から速やかに避難を開始してください。',
        badge: 'bg-amber-500 text-slate-950'
      },
      {
        level: '警戒レベル 2',
        name: '大雨・洪水注意報 (Advisory)',
        action: '避難所やハザードマップ、避難経路を再確認してください。',
        badge: 'bg-yellow-500 text-slate-950'
      },
      {
        level: '警戒レベル 1',
        name: '早期注意情報 (Early Warning)',
        action: '最新の気象情報や今後の警報発表に留意してください。',
        badge: 'bg-blue-600 text-white'
      }
    ],
    jmaSpecsTitle: '気象庁（JMA）公式データ連携仕様',
    jmaSpecsBody1:
      '本アプリケーションの防災情報は、気象庁が配信する公的JSONデータフィード（https://www.jma.go.jp/bosai/quake/data/list.json）に接続して安全に取得しています。',
    jmaSpecsBody2:
      'Spring Boot / Express バックエンドにて 3秒タイムアウト制御および 60秒のインメモリキャッシュを実施し、万が一のネットワーク障害時も最新キャッシュまたは平常時ベースラインを即座に安全返却します。'
  },
  en: {
    pageTitle: 'JMA Disaster Alerts & Seismic Intensity Details',
    sourceBadge: 'Japan Meteorological Agency (JMA)',
    epicenterLabel: 'Epicenter / Region',
    intensityLabel: 'Observed Max Intensity',
    magnitudeLabel: 'Magnitude (Scale)',
    timeLabel: 'Announcement Time (JST)',
    recommendedActionLabel: 'Recommended Emergency Action',
    shindoSectionTitle: 'Japan JMA Seismic Intensity Scale (Shindo Scale) Guide',
    shindoSectionDesc:
      'In Japan, earthquake strength is measured using the "Shindo" scale (10 tiers from 0 to 7). While Magnitude (M) measures the overall energy released by the earthquake, Shindo measures the actual degree of ground shaking experienced at specific locations.',
    shindoList: [
      {
        level: 'Shindo 7',
        name: 'Violent Shaking',
        desc: 'Even high-grade earthquake-resistant buildings can tilt or collapse. People cannot stand and can only move by crawling.',
        color: 'bg-purple-950 text-purple-300 border-purple-500/40'
      },
      {
        level: 'Shindo 6+ / 6-',
        name: 'Severe Shaking',
        desc: 'Impossible to remain standing without holding on. Most unsecured furniture shifts or topples over. Window panes and wall tiles crack and fall.',
        color: 'bg-red-950 text-red-300 border-red-500/40'
      },
      {
        level: 'Shindo 5+ / 5-',
        name: 'Strong Shaking',
        desc: 'Difficult to walk without holding onto stable furniture or walls. Dishes on shelves and books fall down. Unsecured furniture moves.',
        color: 'bg-amber-950 text-amber-300 border-amber-500/40'
      },
      {
        level: 'Shindo 4 / 3',
        name: 'Moderate Shaking',
        desc: 'Felt by almost everyone indoors and outdoors. Hanging objects such as lamps sway noticeably. Most sleeping individuals wake up.',
        color: 'bg-yellow-950 text-yellow-300 border-yellow-500/40'
      },
      {
        level: 'Shindo 2 / 1',
        name: 'Slight Shaking',
        desc: 'Felt by people resting quietly indoors. Causes little or no disruption to daily routines.',
        color: 'bg-slate-900 text-slate-300 border-slate-700'
      }
    ],
    evacuationSectionTitle: 'Japan Evacuation Levels & Warning System (Levels 1–5)',
    evacuationSectionDesc:
      'Municipalities issue emergency evacuation announcements across 5 standardized alert levels. Once Level 4 is issued, all residents in dangerous zones must complete evacuation immediately.',
    evacuationList: [
      {
        level: 'Alert Level 5',
        name: 'Emergency Safety Assurance',
        action: 'Immediate life threat! Take emergency survival action immediately (e.g., vertical evacuation to higher floors of sturdy buildings).',
        badge: 'bg-purple-600 text-white'
      },
      {
        level: 'Alert Level 4',
        name: 'Evacuation Order',
        action: 'All people in danger zones must evacuate immediately to designated evacuation shelters or safer higher ground.',
        badge: 'bg-red-600 text-white'
      },
      {
        level: 'Alert Level 3',
        name: 'Evacuate the Elderly',
        action: 'Elderly individuals, persons with disabilities, and anyone requiring extra evacuation time should start moving to shelters now.',
        badge: 'bg-amber-500 text-slate-950'
      },
      {
        level: 'Alert Level 2',
        name: 'Heavy Rain / Flood Advisory',
        action: 'Review evacuation shelter locations, local hazard maps, and family evacuation routes.',
        badge: 'bg-yellow-500 text-slate-950'
      },
      {
        level: 'Alert Level 1',
        name: 'Early Warning Information',
        action: 'Pay close attention to upcoming meteorological reports and changing weather updates.',
        badge: 'bg-blue-600 text-white'
      }
    ],
    jmaSpecsTitle: 'Official JMA Disaster Data Integration Specifications',
    jmaSpecsBody1:
      'SafeGuard Japan connects to the Japan Meteorological Agency public JSON feeds (https://www.jma.go.jp/bosai/quake/data/list.json) to retrieve verified real-time disaster alerts.',
    jmaSpecsBody2:
      'Our Spring Boot and Express backends enforce a 3-second connection timeout with 60-second in-memory caching (Spring Cache / Caffeine), guaranteeing rapid response times and safe baseline fallbacks during outages.'
  },
  bn: {
    pageTitle: 'জেএমএ (JMA) দুর্যোগ সতর্কতা ও ভূমিকম্প তীব্রতা বিবরণ',
    sourceBadge: 'জাপান আবহাওয়া সংস্থা (JMA) অফিসিয়াল তথ্য',
    epicenterLabel: 'উপকেন্দ্র / আক্রান্ত এলাকা',
    intensityLabel: 'পরিমাপকৃত সর্বোচ্চ তীব্রতা (শিন্দো)',
    magnitudeLabel: 'ভূমিকম্পের মাত্রা (ম্যাগনিটিউড)',
    timeLabel: 'ঘোষণার সময় (জাপান মান সময় / JST)',
    recommendedActionLabel: 'প্রস্তাবিত জরুরি পদক্ষেপ (Emergency Actions)',
    shindoSectionTitle: 'জাপানের আবহাওয়া সংস্থা (JMA) ভূমিকম্প তীব্রতা স্কেল (শিন্দো স্কেল / Shindo Scale) ব্যাখ্যা',
    shindoSectionDesc:
      'জাপানে ভূমিকম্পের তীব্রতা "শিন্দো" স্কেল (০ থেকে ৭ পর্যন্ত ১০টি স্তর) দ্বারা পরিমাপ করা হয়। ম্যাগনিটিউড (M) যেখানে ভূমিকম্পের মোট শক্তি প্রকাশ করে, সেখানে শিন্দো স্কেল নির্দেশ করে নির্দিষ্ট স্থানে মাটির কম্পন কতটা মারাত্মক ও ধ্বংসাত্মক ছিল।',
    shindoList: [
      {
        level: 'শিন্দো ৭ (Shindo 7)',
        name: 'বিধ্বংসী চরম কম্পন',
        desc: 'উচ্চমানের ভূমিকম্প-প্রতিরোধী ভবনও হেলে পড়তে বা ধসে পড়তে পারে। দাঁড়িয়ে থাকা সম্পূর্ণ অসম্ভব, শুধুমাত্র হামাগুড়ি দিয়ে নড়াচড়া করা যায়। আসবাবপত্র বাতাসে উড়ে যেতে পারে।',
        color: 'bg-purple-950 text-purple-300 border-purple-500/40'
      },
      {
        level: 'শিন্দো ৬ উচ্চ / ৬ নিম্ন (Shindo 6+ / 6-)',
        name: 'ভয়াবহ মারাত্মক কম্পন',
        desc: 'ধরে না রেখে দাঁড়িয়ে থাকা অসম্ভব। সুরক্ষিতভাবে আটকানো নেই এমন প্রায় সব আসবাবপত্র উল্টে যায় বা সরে যায়। জানালার কাচ ও দেয়ালের টাইলস ভেঙে নিচে পড়ে।',
        color: 'bg-red-950 text-red-300 border-red-500/40'
      },
      {
        level: 'শিন্দো ৫ উচ্চ / ৫ নিম্ন (Shindo 5+ / 5-)',
        name: 'শক্তিশালী কম্পন',
        desc: 'দেয়াল বা শক্ত আসবাবপত্র না ধরে হাঁটা অত্যন্ত কঠিন। আলমারির বই ও থালাবাসন নিচে পড়ে যায়। অসংরক্ষিত ভারী আসবাব সরে যায়।',
        color: 'bg-amber-950 text-amber-300 border-amber-500/40'
      },
      {
        level: 'শিন্দো ৪ / ৩ (Shindo 4 / 3)',
        name: 'মাঝারি কম্পন',
        desc: 'ঘরের ভেতরে এবং বাইরে থাকা প্রায় সকলেই কম্পন স্পষ্টভাবে টের পান। ঝুলন্ত বৈদ্যুতিক বাতি ও পাখা ব্যাপকভাবে দুলতে থাকে। ঘুমন্ত মানুষের অধিকাংশই জেগে ওঠেন।',
        color: 'bg-yellow-950 text-yellow-300 border-yellow-500/40'
      },
      {
        level: 'শিন্দো ২ / ১ (Shindo 2 / 1)',
        name: 'মৃদু কম্পন',
        desc: 'ঘরের ভেতরে শান্তভাবে অবস্থানরত মানুষ সামান্য কম্পন টের পান। দৈনন্দিন স্বাভাবিক চলাচলে কোনো ব্যাঘাত ঘটে না।',
        color: 'bg-slate-900 text-slate-300 border-slate-700'
      }
    ],
    evacuationSectionTitle: 'জাপানের দুর্যোগ সতর্কতা ও জরুরি স্থানান্তর স্তর (সতর্কতা স্তর ১〜৫)',
    evacuationSectionDesc:
      'জাপানের স্থানীয় প্রশাসন ও পৌরসভা দুর্যোগের তীব্রতা অনুযায়ী ৫টি মানসম্মত সতর্কতা স্তরে জরুরি নির্দেশনা জারি করে। "স্তর ৪" ঘোষিত হলে ঝুঁকিপূর্ণ অঞ্চলের সকল মানুষকে অবিলম্বে আশ্রয়কেন্দ্রে স্থানান্তর সম্পন্ন করতে হবে।',
    evacuationList: [
      {
        level: 'সতর্কতা স্তর ৫ (Level 5)',
        name: 'জরুরি জীবনরক্ষা নিশ্চিতকরণ (Emergency Safety Assurance)',
        action: 'জীবন চরম বিপন্ন! জীবন বাঁচাতে অবিলম্বে সর্বোচ্চ ব্যবস্থা নিন (যেমন: শক্ত ভবনের ২য় বা ৩য় তলায় উল্লম্ব আশ্রয় নিন)।',
        badge: 'bg-purple-600 text-white'
      },
      {
        level: 'সতর্কতা স্তর ৪ (Level 4)',
        name: 'জরুরি স্থানান্তর নির্দেশ (Evacuation Order)',
        action: 'ঝুঁকিপূর্ণ এলাকার সকল মানুষ অবিলম্বে নির্ধারিত জরুরি আশ্রয়কেন্দ্রে বা নিরাপদ উঁচু স্থানে চলে যান।',
        badge: 'bg-red-600 text-white'
      },
      {
        level: 'সতর্কতা স্তর ৩ (Level 3)',
        name: 'প্রবীণ ও বিশেষ ব্যক্তিদের স্থানান্তর (Evacuate the Elderly)',
        action: 'বয়োবৃদ্ধ, প্রতিবন্ধী, শিশু এবং যাদের সরতে বেশি সময় প্রয়োজন তারা অবিলম্বে আশ্রয়কেন্দ্রের উদ্দেশ্যে রওনা দিন।',
        badge: 'bg-amber-500 text-slate-950'
      },
      {
        level: 'সতর্কতা স্তর ২ (Level 2)',
        name: 'ভারী বৃষ্টি / বন্যা পূর্বাভাস (Advisory)',
        action: 'আপনার নিকটস্থ জরুরি আশ্রয়কেন্দ্র, হ্যাজার্ড ম্যাপ ও সরিয়ে নেওয়ার পথ পুনরায় যাচাই করে প্রস্তুত থাকুন।',
        badge: 'bg-yellow-500 text-slate-950'
      },
      {
        level: 'সতর্কতা স্তর ১ (Level 1)',
        name: 'প্রারম্ভিক সতর্কতা তথ্য (Early Warning)',
        action: 'আবহাওয়া দপ্তরের সর্বশেষ পূর্বাভাস ও সম্ভাব্য দুর্যোগ বুলেটিনের ওপর নিয়মিত চোখ রাখুন।',
        badge: 'bg-blue-600 text-white'
      }
    ],
    jmaSpecsTitle: 'জাপান আবহাওয়া সংস্থা (JMA) অফিসিয়াল তথ্য সংযোগ স্পেসিফিকেশন',
    jmaSpecsBody1:
      'সেফগার্ড জাপান (SafeGuard Japan) সরাসরি জাপান আবহাওয়া সংস্থা (JMA)-এর প্রকাশ্য JSON ডেটা ফিড (https://www.jma.go.jp/bosai/quake/data/list.json) থেকে যাচাইকৃত রিয়েল-টাইম তথ্য সংগ্রহ করে।',
    jmaSpecsBody2:
      'আমাদের স্প্রিং বুট ও এক্সপ্রেস ব্যাকএন্ডে ৩-সেকেন্ডের টাইমআউট নিয়ন্ত্রণ এবং ৬০-সেকেন্ডের মেমোরি ক্যাশ (Caffeine Cache) অন্তর্ভুক্ত রয়েছে, যা দুর্যোগের সময় দ্রুত ও নিরবচ্ছিন্ন ডেটা প্রদর্শন নিশ্চিত করে।'
  },
  vi: {
    pageTitle: 'Cảnh báo thiên tai JMA & Chi tiết độ chấn động',
    sourceBadge: 'Dữ liệu chính thức từ Cục Khí tượng Nhật Bản (JMA)',
    epicenterLabel: 'Tâm chấn / Khu vực bị ảnh hưởng',
    intensityLabel: 'Độ rung chấn tối đa quan sát được (Shindo)',
    magnitudeLabel: 'Độ lớn động đất (Magnitude)',
    timeLabel: 'Thời gian thông báo (Giờ Nhật Bản / JST)',
    recommendedActionLabel: 'Hành động khẩn cấp khuyến nghị',
    shindoSectionTitle: 'Hướng dẫn thang đo độ chấn động Shindo của Cục Khí tượng Nhật Bản (JMA)',
    shindoSectionDesc:
      'Tại Nhật Bản, mức độ rung lắc của động đất được đo bằng thang "Shindo" (10 cấp độ từ 0 đến 7). Trong khi Magnitude (M) biểu thị tổng năng lượng phát ra từ tâm chấn, thì thang Shindo biểu thị mức độ rung chấn thực tế cảm nhận được tại từng địa điểm cụ thể.',
    shindoList: [
      {
        level: 'Shindo 7',
        name: 'Rung chấn cực mạnh / Tàn phá',
        desc: 'Ngay cả các tòa nhà chịu chấn động cao cũng có thể bị nghiêng hoặc sụp đổ. Con người không thể đứng vững, chỉ có thể di chuyển bằng cách bò.',
        color: 'bg-purple-950 text-purple-300 border-purple-500/40'
      },
      {
        level: 'Shindo 6 mạnh / 6 yếu',
        name: 'Rung chấn dữ dội',
        desc: 'Không thể đứng vững nếu không bám víu. Hầu hết đồ nội thất không cố định bị xê dịch hoặc lật đổ. Cửa kính và gạch ốp tường nứt vỡ rơi xuống.',
        color: 'bg-red-950 text-red-300 border-red-500/40'
      },
      {
        level: 'Shindo 5 mạnh / 5 yếu',
        name: 'Rung chấn mạnh',
        desc: 'Khó đi lại nếu không bám vào tường hoặc đồ nội thất vững chắc. Sách và bát đĩa trên kệ rơi xuống. Đồ nội thất không cố định bị xê dịch.',
        color: 'bg-amber-950 text-amber-300 border-amber-500/40'
      },
      {
        level: 'Shindo 4 / 3',
        name: 'Rung chấn vừa phải',
        desc: 'Hầu hết mọi người ở trong nhà và ngoài trời đều cảm nhận rõ rệt. Đèn treo và quạt lắc lư mạnh. Hầu hết người đang ngủ bị đánh thức.',
        color: 'bg-yellow-950 text-yellow-300 border-yellow-500/40'
      },
      {
        level: 'Shindo 2 / 1',
        name: 'Rung chấn nhẹ',
        desc: 'Người ở trạng thái yên tĩnh trong nhà cảm nhận được rung lắc nhẹ. Không gây ảnh hưởng đến sinh hoạt hàng ngày.',
        color: 'bg-slate-900 text-slate-300 border-slate-700'
      }
    ],
    evacuationSectionTitle: 'Các cấp độ cảnh báo sơ tán khẩn cấp tại Nhật Bản (Cấp độ 1〜5)',
    evacuationSectionDesc:
      'Chính quyền địa phương tại Nhật Bản ban hành thông báo sơ tán theo 5 cấp độ cảnh báo tiêu chuẩn. Khi "Cấp độ 4" được ban bố, tất cả người dân trong khu vực nguy hiểm phải hoàn thành sơ tán ngay lập tức.',
    evacuationList: [
      {
        level: 'Cảnh báo Cấp độ 5',
        name: 'Đảm bảo an toàn khẩn cấp (Emergency Safety Assurance)',
        action: 'Nguy hiểm đến tính mạng! Lập tức thực hiện hành động tốt nhất để bảo vệ mạng sống (ví dụ: sơ tán thẳng đứng lên tầng cao hơn của tòa nhà kiên cố).',
        badge: 'bg-purple-600 text-white'
      },
      {
        level: 'Cảnh báo Cấp độ 4',
        name: 'Lệnh sơ tán (Evacuation Order)',
        action: 'Tất cả người dân trong khu vực nguy hiểm phải lập tức sơ tán đến các nơi trú ẩn khẩn cấp được chỉ định hoặc vùng đất cao an toàn.',
        badge: 'bg-red-600 text-white'
      },
      {
        level: 'Cảnh báo Cấp độ 3',
        name: 'Sơ tán người cao tuổi (Evacuate the Elderly)',
        action: 'Người cao tuổi, người khuyết tật và những người cần nhiều thời gian sơ tán nên bắt đầu di chuyển đến nơi trú ẩn an toàn ngay bây giờ.',
        badge: 'bg-amber-500 text-slate-950'
      },
      {
        level: 'Cảnh báo Cấp độ 2',
        name: 'Khuyến cáo mưa lớn / Lũ lụt (Advisory)',
        action: 'Kiểm tra lại vị trí nơi trú ẩn khẩn cấp, bản đồ hiểm họa (Hazard Map) và lộ trình sơ tán của gia đình.',
        badge: 'bg-yellow-500 text-slate-950'
      },
      {
        level: 'Cảnh báo Cấp độ 1',
        name: 'Thông tin cảnh báo sớm (Early Warning)',
        action: 'Chú ý theo dõi các bản tin thời tiết và dự báo thiên tai mới nhất từ cơ quan khí tượng.',
        badge: 'bg-blue-600 text-white'
      }
    ],
    jmaSpecsTitle: 'Quy cách tích hợp dữ liệu thiên tai chính thức từ JMA',
    jmaSpecsBody1:
      'SafeGuard Japan kết nối trực tiếp với nguồn dữ liệu JSON công khai của Cục Khí tượng Nhật Bản (https://www.jma.go.jp/bosai/quake/data/list.json) để nhận thông tin cảnh báo thiên tai theo thời gian thực.',
    jmaSpecsBody2:
      'Hệ thống backend Spring Boot và Express thực thi kiểm soát timeout 3 giây cùng bộ nhớ đệm 60 giây (Caffeine Cache), đảm bảo phản hồi tức thì và duy trì an toàn khi có sự cố mạng.'
  }
};
