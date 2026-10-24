import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ChevronRight,
  GraduationCap,
  Info,
  Layers,
  Sparkles,
  BookOpen,
  ArrowDownCircle,
  Activity,
  Hand,
  Maximize2,
  Check,
  Share2
} from 'lucide-react';
import { SupportedLanguage } from '../data/phrases';
import { EmergencyEducation } from './EmergencyEducation';

interface EarthquakeGuideViewProps {
  language: SupportedLanguage;
  onBackToDashboard: () => void;
}

export const EarthquakeGuideView: React.FC<EarthquakeGuideViewProps> = ({
  language,
  onBackToDashboard
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [selectedHotspot, setSelectedHotspot] = useState<string>('neck');

  // Multilingual translations for the Earthquake Preparedness Guide
  const t = {
    ja: {
      breadcrumb_home: 'ダッシュボード',
      breadcrumb_current: '地震防災・避難姿勢ガイド',
      hero_badge: '緊急地震速報・初動対応マニュアル',
      hero_title: '地震発生時の身の守り方：ドロップ・カバー・ホールドオン',
      hero_subtitle: '頭部や首への落下物を防ぐための正しい机の下の姿勢を、イラストとアニメーションでわかりやすく解説します。',
      step_indicator: 'ステップで学ぶ基本動作',
      step1_title: '1. DROP (まず姿勢を低く)',
      step1_short: '姿勢を低く',
      step1_desc: '激しい揺れで転倒しないよう、まずはその場で低くかがみ、重心を下げて床に手をつきます。',
      step1_detail: '立ったままでいると強い横揺れで投げ出され、骨折や打撲の危険があります。すぐに床に手をついて姿勢を低くしてください。',
      step2_title: '2. COVER (頭と首を守り机の下へ)',
      step2_short: '頭部を保護',
      step2_desc: '頑丈な机やテーブルの下に入り、落下物（照明器具、天井板、ガラス、本）から最も大切な頭と首を守ります。',
      step2_detail: '机がない場合は、窓ガラスや大型家具から離れた内壁の隅で、クッションや鞄、腕で首の後ろ（延髄）をしっかりと覆います。',
      step3_title: '3. HOLD ON (机の脚を強く握る)',
      step3_short: '机の脚を固定',
      step3_desc: '揺れで机が移動してしまわないよう、片手で机の脚をしっかり固定し、もう片方の腕で首の根元をガードし続けます。',
      step3_detail: '震度5強以上の揺れでは家具が跳ねたり滑ったりします。机が動いた場合は、机と一緒に体を移動させ、机の下にとどまります。',
      step4_title: '4. WAIT (揺れが収まるまで待機)',
      step4_short: '揺れ収束待機',
      step4_desc: '慌てて外に飛び出さず、大きな揺れが完全に止まるまで机の下で安全を確保します。',
      step4_detail: '余震に警戒しながら、周囲のガラス片や落下物に注意して避難経路（ドアの確保）を確認します。',
      posture_diagram_title: '【机の下の正しい防御姿勢】インタラクティブ解剖図',
      posture_diagram_hint: '図中の丸いピンをクリックすると、各部位の保護ポイントが表示されます。',
      hotspot_neck_label: '首・後頭部保護',
      hotspot_neck_title: '腕で後頭部と延髄をがっちり保護',
      hotspot_neck_desc: '片腕で首の後ろ（延髄）を隙間なく覆い、落ちてくるガラス破片や硬い本から急所を守ります。頭頂部は机の天板がブロックします。',
      hotspot_leg_label: '机の脚をホールド',
      hotspot_leg_title: '片手で机の脚を強く固定',
      hotspot_leg_desc: '激しい揺れで机が滑り落ちて頭部がむき出しになるのを防ぐため、しっかりと太い机の脚を握り締めます。',
      hotspot_table_label: '頑丈な天板ブロック',
      hotspot_table_title: '上空からの落下物を跳ね返すシールド',
      hotspot_table_desc: '照明器具、蛍光灯、天井板、本棚の本などが落下しても、机の天板がクッションとなって致命傷を防ぎます。',
      hotspot_body_label: 'コンパクトな丸まり姿勢',
      hotspot_body_title: '膝を抱え、体を机の幅の中に収める',
      hotspot_body_desc: '足や体が机の外にはみ出さないよう、膝を曲げて丸まり、机の足の内側に全身をコンパクトに収めます。',
      compare_title: '正しい姿勢と危険なNG行動の比較',
      correct_heading: '命を守る正しい行動 (DO)',
      mistake_heading: '命を危険にさらすNG行動 (DON\'T)',
      correct_item1: '揺れを感じたら即座に机の下へ入る',
      correct_item2: '腕や鞄で頭部・首の後ろを確実に保護する',
      correct_item3: '机の脚を片手で強く握り、机と一緒に移動する',
      correct_item4: '揺れが完全に止まるまで最低1分間は動かない',
      mistake_item1: '慌てて屋外へ飛び出す（看板や外壁タイルの直撃）',
      mistake_item2: '火を消そうとコンロへ駆け寄る（熱湯や油を浴びる危険）',
      mistake_item3: 'ガラス製のテーブルやキャビネットのそばに隠れる',
      mistake_item4: 'エレベーターや非常階段に殺到する',
      room_guide_title: '場所別・シチュエーション別の身の守り方',
      room_classroom: '教室・勉強机・職場',
      room_classroom_desc: '机の下に入り、脚を握る。窓やプロジェクター、ロッカーから離れる。',
      room_bed: '寝室・ベッド',
      room_bed_desc: 'うつ伏せになり、枕や毛布で頭と首を覆う。暗闇でガラスを踏まないようスリッパを常備。',
      room_kitchen: 'キッチン・台所',
      room_kitchen_desc: '冷蔵庫や食器棚の転倒に注意し、すぐに離れる。揺れが収まるまで火の始末は無理に行わない。',
      room_street: '屋外・街中',
      room_street_desc: 'ブロック塀や自動販売機から離れ、鞄で頭を守りながら広場や頑丈なビルのエントランスへ。',
      room_train: '電車・地下鉄',
      room_train_desc: '吊り革やつり手を両手で強く握り、低い姿勢をとる。勝手に線路へ飛び降りない。',
      live_drill_section_title: 'リアルタイム実演シミュレーション動画',
      live_drill_section_desc: '机の下への退避動作と落下物ブロックの物理シミュレーションを再生します。'
    },
    en: {
      breadcrumb_home: 'Dashboard',
      breadcrumb_current: 'Earthquake Preparedness Guide',
      hero_badge: 'Emergency Earthquake Early Warning Protocol',
      hero_title: 'How to Protect Yourself: Drop, Cover, and Hold On',
      hero_subtitle: 'Visual, step-by-step instructions and interactive animated illustrations demonstrating the exact posture under a study desk during an earthquake in Japan.',
      step_indicator: 'Step-by-Step Core Action',
      step1_title: '1. DROP (Get Down on Hands & Knees)',
      step1_short: 'Drop Low',
      step1_desc: 'Drop onto your hands and knees immediately before the earthquake knocks you off balance.',
      step1_detail: 'Severe seismic shaking (Shindo 5+ to 7) makes standing impossible. Lowering your center of gravity prevents falls, fractures, and loss of control.',
      step2_title: '2. COVER (Head, Neck & Under Desk)',
      step2_short: 'Cover Head',
      step2_desc: 'Crawl completely under a sturdy desk or table. Shield your head and neck from falling objects.',
      step2_detail: 'Over 70% of injuries in modern earthquakes are caused by falling overhead hazards (ceiling tiles, lights, heavy bookshelves, flying glass).',
      step3_title: '3. HOLD ON (Grip Desk Leg Tightly)',
      step3_short: 'Hold On',
      step3_desc: 'Grip one leg of the desk firmly with one hand while keeping your other arm shielding your neck.',
      step3_detail: 'Violent shaking slides furniture across rooms. By clutching the leg, you ensure your protective canopy stays directly over you.',
      step4_title: '4. WAIT (Stay Until Shaking Stops)',
      step4_short: 'Remain Calm',
      step4_desc: 'Do not rush outside. Stay safely under cover until all ground tremors have completely ceased.',
      step4_detail: 'Falling exterior facade bricks, glass, and tiles make rushing outside extremely dangerous. Wait, then inspect exit routes.',
      posture_diagram_title: '【Correct Posture Under Table】Interactive Anatomy Diagram',
      posture_diagram_hint: 'Click the numbered interactive pins on the diagram to inspect critical protection techniques.',
      hotspot_neck_label: 'Neck & Spine Shield',
      hotspot_neck_title: 'Shield Back of Neck with Arm',
      hotspot_neck_desc: 'Keep one forearm pressed tight against the nape of your neck and brainstem. The tabletop guards your scalp; your arm defends against sideways glass shrapnel.',
      hotspot_leg_label: 'Leg Grip',
      hotspot_leg_title: 'Firmly Clutch the Sturdy Desk Leg',
      hotspot_leg_desc: 'Grip the desk leg with your primary hand so the desk cannot slide away during violent lateral accelerations.',
      hotspot_table_label: 'Heavy Tabletop Shield',
      hotspot_table_title: 'Solid Surface Deflecting Overhead Debris',
      hotspot_table_desc: 'Light fixtures, ceiling tiles, and hardcover books bounce harmlessly off the solid tabletop, absorbing impact energy.',
      hotspot_body_label: 'Tucked Body Center',
      hotspot_body_title: 'Fold Knees & Tuck Inwards',
      hotspot_body_desc: 'Curl your torso in a compact fetal-like posture entirely within the desk boundary so no limbs are exposed to falling items.',
      compare_title: 'Posture Comparison: Life-Saving Rules vs Dangerous Mistakes',
      correct_heading: 'Correct Protocol (DO)',
      mistake_heading: 'Fatal Mistakes to Avoid (DON\'T)',
      correct_item1: 'Drop, Cover, and Hold On under a sturdy desk immediately',
      correct_item2: 'Wrap one arm around the back of your neck/head',
      correct_item3: 'Grip the desk leg and move with it if it slides',
      correct_item4: 'Wait under cover until all shaking completely ceases',
      mistake_item1: 'Do NOT run outside during tremors (falling debris hazard)',
      mistake_item2: 'Do NOT rush to turn off kitchen stove while room shakes',
      mistake_item3: 'Do NOT shelter under glass tables or near large windows',
      mistake_item4: 'Do NOT crowd into elevators or stairwells during shaking',
      room_guide_title: 'Room-by-Room & Situation Survival Guide',
      room_classroom: 'Classroom / Study Desk',
      room_classroom_desc: 'Get under the desk, hold the leg, and turn your back to windows and tall lockers.',
      room_bed: 'In Bed',
      room_bed_desc: 'Stay in bed. Turn face-down and pull a thick pillow over your head and neck.',
      room_kitchen: 'Kitchen',
      room_kitchen_desc: 'Move away from top-heavy refrigerators and dish racks. Drop and protect head.',
      room_street: 'Outdoors / Street',
      room_street_desc: 'Move away from brick walls, vending machines, and power poles. Shield head with bag.',
      room_train: 'Train / Subway',
      room_train_desc: 'Hold overhead straps or rails with both hands. Crouch down and brace.',
      live_drill_section_title: 'Animated Physics & Simulation Video',
      live_drill_section_desc: 'Watch the animated drill showing a student executing the maneuver with audio alerts.'
    },
    bn: {
      breadcrumb_home: 'ড্যাশবোর্ড',
      breadcrumb_current: 'ভূমিকম্প প্রস্তুতি গাইড',
      hero_badge: 'জরুরি ভূমিকম্প পূর্বসতর্কতা নির্দেশিকা',
      hero_title: 'ভূমিকম্পে জীবন রক্ষার সঠিক কৌশল: ড্রপ, কভার এবং হোল্ড অন',
      hero_subtitle: 'পড়ার টেবিল বা ডেস্কে পড়াশোনার সময় ভূমিকম্প হলে কীভাবে টেবিলের নিচে মাথা ও শরীর সুরক্ষিত রাখবেন—তার সচিত্র ধাপে ধাপে গাইড।',
      step_indicator: 'ধাপে ধাপে প্রধান করণীয়',
      step1_title: '১. DROP (নিচু হয়ে বসে পড়ুন)',
      step1_short: 'নিচু হোন',
      step1_desc: 'ভূমিকম্পে ছিটকে পড়ে যাওয়া এড়াতে তৎক্ষণাৎ হাঁটু ও হাতের ওপর ভর দিয়ে মেঝেতে বসে পড়ুন।',
      step1_detail: 'তীব্র ঝাঁকুনিতে দাঁড়িয়ে থাকলে শরীর আছড়ে পড়ে হাড় ভাঙার ঝুঁকি থাকে। দ্রুত নিজের ভরকেন্দ্র নিচু করুন।',
      step2_title: '২. COVER (মাথা ঢেকে টেবিলের নিচে ঢুকুন)',
      step2_short: 'মাথা রক্ষা করুন',
      step2_desc: 'মজবুত কাঠের পড়ার টেবিলের নিচে ঢুকে পড়ুন। ছাদ বা তাক থেকে খসে পড়া বস্তু থেকে মাথা ও ঘাড় রক্ষা করুন।',
      step2_detail: 'ভূমিকম্পের ৭০% আঘাত ঘটে ওপর থেকে লাইট, ফ্যান, বইয়ের তাক বা কাচ ভেঙে পড়ার কারণে। শক্ত টেবিল মাথার ঢাল হিসেবে কাজ করে।',
      step3_title: '৩. HOLD ON (টেবিলের পায়া শক্ত করে আঁকড়ে ধরুন)',
      step3_short: 'পায়া ধরে রাখুন',
      step3_desc: 'ঝাঁকুনিতে টেবিল যাতে দূরে সরে না যায়, সেজন্য এক হাতে টেবিলের পায়া শক্ত করে ধরে রাখুন এবং অন্য হাত ঘাড়ে রাখুন।',
      step3_detail: 'ভূমিকম্পের তীব্রতায় ভারী আসবাবও সরে যায়। পায়া ধরে রাখলে টেবিলটি সবসময় আপনার মাথার ওপরেই সুরক্ষিত অবস্থানে থাকবে।',
      step4_title: '৪. WAIT (কম্পন শেষ না হওয়া পর্যন্ত অপেক্ষা করুন)',
      step4_short: 'শান্ত থাকুন',
      step4_desc: 'ভয়ে বাইরে দৌড়াবেন না। যতক্ষণ পর্যন্ত সম্পূর্ণ কম্পন না থামে, ততক্ষণ টেবিলের নিচেই অবস্থান করুন।',
      step4_detail: 'বাইরে দৌড় দিলে দেওয়ালের প্লাস্টার, কাচ বা সাইনবোর্ড মাথায় পড়ার চরম ঝুঁকি থাকে। কম্পন থামলে সাবধানে বের হন।',
      posture_diagram_title: '【টেবিলের নিচে সঠিক ভঙ্গি】ইন্টারেক্টিভ অ্যানাটমি চিত্র',
      posture_diagram_hint: 'চিত্রের ওপরের গোলাকার পয়েন্টগুলোতে ক্লিক করে প্রতিটি অংশের সুরক্ষা কৌশল জানুন।',
      hotspot_neck_label: 'ঘাড় ও মাথার পেছনের অংশ রক্ষা',
      hotspot_neck_title: 'হাত দিয়ে ঘাড় ও ব্রেনস্টেম ঢেকে রাখা',
      hotspot_neck_desc: 'এক হাত দিয়ে শক্ত করে ঘাড়ের পেছনের স্নায়ু ঢেকে রাখুন। মাথার ওপর থাকবে টেবিল এবং হাত কাচের টুকরো থেকে ঘাড় রক্ষা করবে।',
      hotspot_leg_label: 'টেবিলের পায়া ধরা',
      hotspot_leg_title: 'এক হাতে টেবিলের পায়া শক্ত করে ধরে রাখা',
      hotspot_leg_desc: 'মাটির তীব্র ঝাঁকুনিতে পড়ার টেবিল ছিটকে গেলে শরীর অরক্ষিত হয়ে পড়বে। তাই এক হাত দিয়ে পায়া শক্ত করে ধরে রাখুন।',
      hotspot_table_label: 'মজবুত টেবিলের উপরিভাগ',
      hotspot_table_title: 'ওপর থেকে পড়া ভারী বস্তু ঠেকানোর ঢাল',
      hotspot_table_desc: 'সিলিং লাইট, প্লাস্টার, বা বইয়ের তাক ভেঙে পড়লেও টেবিলের শক্ত কাঠ তা আটকে দেয় এবং শরীরের আঘাত রক্ষা করে।',
      hotspot_body_label: 'সংকুচিত শরীর ভঙ্গি',
      hotspot_body_title: 'হাঁটু গুটিয়ে টেবিলের ভেতর নিজেকে রাখা',
      hotspot_body_desc: 'হাত ও পা যেন টেবিলের বাইরে বের হয়ে না থাকে, সেজন্য হাঁটু ভাঁজ করে সম্পূর্ণ শরীর টেবিলের ভেতরে সীমাবদ্ধ রাখুন।',
      compare_title: 'সঠিক আচরণ এবং মারাত্মক ভুলের তুলনা',
      correct_heading: 'সঠিক জীবনরক্ষাকারী আচরণ (যা করবেন)',
      mistake_heading: 'মারাত্মক ভুলসমূহ (যা কখনোই করবেন না)',
      correct_item1: 'কম্পন শুরু হওয়ামাত্র মজবুত টেবিলের নিচে আশ্রয় নিন',
      correct_item2: 'হাত বা নরম কুশন দিয়ে মাথা ও ঘাড়ের পেছনের অংশ ঢেকে রাখুন',
      correct_item3: 'এক হাতে টেবিলের পায়া শক্ত করে ধরে রাখুন',
      correct_item4: 'ভূমিকম্পের কম্পন পুরোপুরি থামা পর্যন্ত অপেক্ষা করুন',
      mistake_item1: 'ভূমিকম্প চলাকালীন আতঙ্কে বাইরে দৌড়াবেন না (ওপর থেকে কাচ ও ইট পড়ার ঝুঁকি)',
      mistake_item2: 'কম্পনের মধ্যে গ্যাসের চুলা বন্ধ করতে রান্নাঘরে ছুটবেন না',
      mistake_item3: 'কাচের তৈরি টেবিল বা জানালার পাশে আশ্রয় নেবেন না',
      mistake_item4: 'লিফট বা ভিড়যুক্ত সিঁড়িতে হুড়োহুড়ি করবেন না',
      room_guide_title: 'বিভিন্ন স্থানে অবস্থানকালীন আত্মরক্ষা গাইড',
      room_classroom: 'ক্লাসরুম / পড়ার টেবিল',
      room_classroom_desc: 'টেবিলের নিচে ঢুকুন, পায়া ধরুন এবং জানালার দিক থেকে পিঠ ফিরিয়ে রাখুন।',
      room_bed: 'বিছানায় থাকলে',
      room_bed_desc: 'বিছানা থেকে নামবেন না। উপুড় হয়ে মোটা বালিশ দিয়ে মাথা ও ঘাড় ঢেকে রাখুন।',
      room_kitchen: 'রান্নাঘরে থাকলে',
      room_kitchen_desc: 'ফ্রিজ ও ঝুলন্ত ক্যাবিনেট থেকে দ্রুত দূরে যান। নিচু হয়ে মাথা রক্ষা করুন।',
      room_street: 'রাস্তায় থাকলে',
      room_street_desc: 'দেওয়াল, বৈদ্যুতিক খুঁটি ও সাইনবোর্ড থেকে দূরে ফাঁকা জায়গায় যান। ব্যাগ মাথায় রাখুন।',
      room_train: 'ট্রেন বা বাসে থাকলে',
      room_train_desc: 'দুই হাত দিয়ে শক্ত করে হ্যান্ডেল ধরে নিচু হয়ে দাঁড়ান। হুট করে লাফ দেবেন না।',
      live_drill_section_title: 'অ্যানিমেটেড সিমুলেশন ভিডিও প্লেয়ার',
      live_drill_section_desc: 'টেবিলের নিচে প্রবেশের ড্রিল এবং বস্তু প্রতিহত করার বাস্তব অ্যানিমেশন দেখুন।'
    },
    vi: {
      breadcrumb_home: 'Bảng điều khiển',
      breadcrumb_current: 'Hướng dẫn phòng tránh động đất',
      hero_badge: 'Quy trình ứng phó khẩn cấp động đất',
      hero_title: 'Cách bảo vệ bản thân khi có động đất: Hạ thấp, Che chắn và Giữ chặt',
      hero_subtitle: 'Hướng dẫn trực quan từng bước với hình minh họa và mô phỏng hoạt hình về tư thế chính xác dưới gầm bàn khi xảy ra động đất.',
      step_indicator: 'Hành động cốt lõi từng bước',
      step1_title: '1. DROP (Hạ thấp trọng tâm)',
      step1_short: 'Hạ thấp',
      step1_desc: 'Nhanh chóng cúi xuống và quỳ bằng tay chân trước khi chấn động làm bạn mất thăng bằng.',
      step1_detail: 'Rung chấn mạnh (Shindo 5+ đến 7) khiến bạn không thể đứng vững. Hạ thấp người giúp tránh ngã gãy xương.',
      step2_title: '2. COVER (Che chắn đầu và cổ dưới gầm bàn)',
      step2_short: 'Che đầu',
      step2_desc: 'Chui hoàn toàn vào dưới gầm bàn vững chắc để bảo vệ đầu và cổ khỏi các vật thể rơi từ trên cao.',
      step2_detail: 'Hơn 70% thương tích do động đất gây ra là do đèn trần, giá sách, kính vỡ và gạch rơi từ trên cao xuống.',
      step3_title: '3. HOLD ON (Giữ chặt chân bàn)',
      step3_short: 'Giữ chặt',
      step3_desc: 'Dùng một tay nắm chặt chân bàn, tay còn lại tiếp tục che chắn bảo vệ phía sau cổ.',
      step3_detail: 'Rung lắc dữ dội có thể làm bàn trượt đi. Nắm chặt chân bàn giúp tấm che chắn luôn ở ngay trên đầu bạn.',
      step4_title: '4. WAIT (Chờ đến khi hết rung lắc)',
      step4_short: 'Giữ bình tĩnh',
      step4_desc: 'Tuyệt đối không hoảng loạn chạy ra ngoài. Ở yên dưới gầm bàn cho đến khi mọi rung lắc hoàn toàn dừng lại.',
      step4_detail: 'Chạy ra ngoài rất dễ bị kính vỡ hoặc gạch ốp tường rơi trúng đầu. Hãy đợi an toàn rồi mới kiểm tra lối thoát hiểm.',
      posture_diagram_title: '【Tư thế chuẩn dưới gầm bàn】Sơ đồ tương tác trực quan',
      posture_diagram_hint: 'Nhấp vào các điểm đánh số trên hình để xem giải thích chi tiết về kỹ thuật bảo vệ.',
      hotspot_neck_label: 'Bảo vệ đầu & cổ',
      hotspot_neck_title: 'Dùng cánh tay bảo vệ gáy và sau đầu',
      hotspot_neck_desc: 'Áp chặt cánh tay vào sau gáy để bảo vệ tủy sống. Mặt bàn bảo vệ đỉnh đầu, cánh tay bảo vệ khỏi mảnh kính văng.',
      hotspot_leg_label: 'Nắm chân bàn',
      hotspot_leg_title: 'Nắm chắc chân bàn bằng tay thuận',
      hotspot_leg_desc: 'Nắm chặt chân bàn để khi sàn nhà rung chuyển dữ dội, bàn không bị trượt mất khỏi bạn.',
      hotspot_table_label: 'Mặt bàn chắn vật rơi',
      hotspot_table_desc: 'Đèn trần, sách hoặc gạch vữa rơi xuống sẽ bật ra khỏi mặt bàn gỗ dày, hấp thụ xung lực nguy hiểm.',
      hotspot_body_label: 'Thu gọn thân thể',
      hotspot_body_title: 'Gập gối và thu gọn vào bên trong',
      hotspot_body_desc: 'Co chân và cuộn tròn người gọn gàng bên trong phạm vi 4 chân bàn để không bộ phận nào bị hở ra ngoài.',
      compare_title: 'So sánh: Hành động đúng cứu mạng vs Sai lầm chết người',
      correct_heading: 'Hành động đúng nên làm (DO)',
      mistake_heading: 'Sai lầm nguy hiểm cần tránh (DON\'T)',
      correct_item1: 'Hạ thấp người và chui ngay xuống dưới gầm bàn vững chắc',
      correct_item2: 'Dùng tay che chặt vùng gáy và sau đầu',
      correct_item3: 'Nắm chặt một chân bàn và di chuyển theo bàn nếu bị trượt',
      correct_item4: 'Ở yên dưới gầm bàn cho đến khi hết rung lắc hoàn toàn',
      mistake_item1: 'KHÔNG hoảng loạn chạy ra ngoài (nguy cơ kính rơi trúng đầu)',
      mistake_item2: 'KHÔNG lao vào bếp khóa van ga khi phòng đang rung lắc',
      mistake_item3: 'KHÔNG trốn dưới bàn kính hoặc đứng gần cửa sổ lớn',
      mistake_item4: 'KHÔNG chen chúc vào thang máy hoặc cầu thang thoát hiểm',
      room_guide_title: 'Hướng dẫn ứng phó theo từng khu vực',
      room_classroom: 'Phòng học / Bàn làm việc',
      room_classroom_desc: 'Chui dưới gầm bàn, nắm chân bàn và quay lưng về phía cửa sổ.',
      room_bed: 'Trong phòng ngủ / Trên giường',
      room_bed_desc: 'Nằm sấp trên giường, dùng gối dày che kín toàn bộ đầu và cổ.',
      room_kitchen: 'Nhà bếp',
      room_kitchen_desc: 'Tránh xa tủ lạnh và giá để bát đĩa. Ngồi thụp xuống bảo vệ đầu.',
      room_street: 'Ngoài đường / Khu công cộng',
      room_street_desc: 'Tránh xa tường gạch, cột điện và máy bán hàng. Dùng balo che đầu.',
      room_train: 'Trên tàu điện / Xe buýt',
      room_train_desc: 'Dùng hai tay nắm chặt quai treo hoặc tay vịn. Hạ thấp người.',
      live_drill_section_title: 'Video Hoạt Hình Mô Phỏng Động Đất',
      live_drill_section_desc: 'Xem mô phỏng hoạt hình học sinh thực hiện tư thế hạ thấp và chui gầm bàn.'
    }
  }[language] || {
    breadcrumb_home: 'Dashboard',
    breadcrumb_current: 'Earthquake Preparedness Guide',
    hero_badge: 'Emergency Earthquake Early Warning Protocol',
    hero_title: 'How to Protect Yourself: Drop, Cover, and Hold On',
    hero_subtitle: 'Visual, step-by-step instructions and interactive animated illustrations demonstrating the exact posture under a study desk during an earthquake in Japan.',
    step_indicator: 'Step-by-Step Core Action',
    step1_title: '1. DROP',
    step1_short: 'Drop Low',
    step1_desc: 'Drop onto your hands and knees.',
    step1_detail: 'Lowering your center of gravity prevents falls.',
    step2_title: '2. COVER',
    step2_short: 'Cover Head',
    step2_desc: 'Crawl completely under a sturdy desk or table.',
    step2_detail: 'Shield head and neck from falling debris.',
    step3_title: '3. HOLD ON',
    step3_short: 'Hold On',
    step3_desc: 'Grip one leg of the desk firmly.',
    step3_detail: 'Move with the desk if it shifts.',
    step4_title: '4. WAIT',
    step4_short: 'Wait for Shaking to Stop',
    step4_desc: 'Stay under cover until shaking stops.',
    step4_detail: 'Never rush outside while shaking.',
    posture_diagram_title: 'Correct Posture Under Table',
    posture_diagram_hint: 'Click the hotspot pins to inspect techniques.',
    hotspot_neck_label: 'Neck Shield',
    hotspot_neck_title: 'Shield Back of Neck',
    hotspot_neck_desc: 'Forearm pressed tight against nape of neck.',
    hotspot_leg_label: 'Leg Grip',
    hotspot_leg_title: 'Clutch Desk Leg',
    hotspot_leg_desc: 'Prevents desk from sliding away.',
    hotspot_table_label: 'Tabletop Shield',
    hotspot_table_title: 'Deflects Debris',
    hotspot_table_desc: 'Bounces falling tiles and books.',
    hotspot_body_label: 'Tucked Body',
    hotspot_body_title: 'Knees Folded Inside',
    hotspot_body_desc: 'Keeps entire body within desk footprint.',
    compare_title: 'Posture Comparison',
    correct_heading: 'Correct Protocol (DO)',
    mistake_heading: 'Fatal Mistakes (DON\'T)',
    correct_item1: 'Drop under table immediately',
    correct_item2: 'Wrap arm around neck',
    correct_item3: 'Grip desk leg tightly',
    correct_item4: 'Wait until shaking stops',
    mistake_item1: 'Do not run outside during shaking',
    mistake_item2: 'Do not rush to stove',
    mistake_item3: 'Do not hide under glass tables',
    mistake_item4: 'Do not crowd into elevators',
    room_guide_title: 'Room-by-Room Guide',
    room_classroom: 'Classroom',
    room_classroom_desc: 'Get under desk, hold leg.',
    room_bed: 'In Bed',
    room_bed_desc: 'Stay in bed, cover with pillow.',
    room_kitchen: 'Kitchen',
    room_kitchen_desc: 'Move away from cabinets.',
    room_street: 'Outdoors',
    room_street_desc: 'Move away from walls, shield head.',
    room_train: 'Train',
    room_train_desc: 'Hold straps tightly, crouch down.',
    live_drill_section_title: 'Animated Drill Video',
    live_drill_section_desc: 'Interactive simulation.'
  };

  const steps = [
    {
      num: 1,
      title: t.step1_title,
      short: t.step1_short,
      desc: t.step1_desc,
      detail: t.step1_detail,
      color: 'amber',
      badge: '0-3 SEC'
    },
    {
      num: 2,
      title: t.step2_title,
      short: t.step2_short,
      desc: t.step2_desc,
      detail: t.step2_detail,
      color: 'red',
      badge: 'IMMEDIATE'
    },
    {
      num: 3,
      title: t.step3_title,
      short: t.step3_short,
      desc: t.step3_desc,
      detail: t.step3_detail,
      color: 'emerald',
      badge: 'SECURE'
    },
    {
      num: 4,
      title: t.step4_title,
      short: t.step4_short,
      desc: t.step4_desc,
      detail: t.step4_detail,
      color: 'blue',
      badge: 'CALM'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Top Breadcrumb & Return Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.breadcrumb_home}</span>
          </button>
          <span>/</span>
          <span className="text-slate-200 font-medium truncate">
            {t.breadcrumb_current}
          </span>
        </div>

        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white text-xs font-semibold transition"
        >
          <span>&larr; {t.breadcrumb_home}</span>
        </button>
      </div>

      {/* Hero Banner with JMA Golden Rule Badge */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/40 border border-red-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/40 text-xs font-mono font-bold tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-red-400 animate-pulse" />
            <span>{t.hero_badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {t.hero_title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {t.hero_subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              #1 JMA Guideline: まず低く・頭を守り・動かない
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
              Drop, Cover, Hold On
            </span>
          </div>
        </div>
      </section>

      {/* Emergency Education Animated Video & 60-Second Practice Drill */}
      <EmergencyEducation language={language} />

      {/* 4-Step Interactive Posture Stepper */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            <span>{t.step_indicator}</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            STEP {activeStep + 1} / 4
          </span>
        </div>

        {/* Stepper Tabs Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map((st, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={st.num}
                onClick={() => setActiveStep(idx)}
                className={`text-left p-4 rounded-2xl transition border ${
                  isActive
                    ? 'bg-slate-900 border-red-500 ring-2 ring-red-500/30 shadow-xl'
                    : 'bg-slate-950/80 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black font-mono ${
                      isActive
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {st.num}
                  </span>
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {st.badge}
                  </span>
                </div>
                <h3 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {st.short}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                  {st.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Step Details Panel */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 block mb-1">
                STEP 0{steps[activeStep].num} ACTION PROTOCOL
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                {steps[activeStep].title}
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={activeStep === 0}
                onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs text-slate-300 transition"
              >
                &larr; Prev
              </button>
              <button
                disabled={activeStep === steps.length - 1}
                onClick={() => setActiveStep((p) => Math.min(steps.length - 1, p + 1))}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-bold text-white transition"
              >
                Next &rarr;
              </button>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
            {steps[activeStep].desc}
          </p>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-white">Why this saves your life: </strong>
              {steps[activeStep].detail}
            </p>
          </div>
        </div>
      </section>

      {/* Visual Posture Diagram (Interactive SVG Anatomy with Hotspots) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-red-400" />
              <span>{t.posture_diagram_title}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t.posture_diagram_hint}
            </p>
          </div>

          {/* Hotspots selector buttons */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedHotspot('neck')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedHotspot === 'neck'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              1. {t.hotspot_neck_label}
            </button>
            <button
              onClick={() => setSelectedHotspot('leg')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedHotspot === 'leg'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              2. {t.hotspot_leg_label}
            </button>
            <button
              onClick={() => setSelectedHotspot('table')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedHotspot === 'table'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              3. {t.hotspot_table_label}
            </button>
            <button
              onClick={() => setSelectedHotspot('body')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedHotspot === 'body'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              4. {t.hotspot_body_label}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Visual SVG Posture Illustration Canvas */}
          <div className="lg:col-span-7 bg-gradient-to-b from-slate-950 to-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
            {/* Ambient lighting */}
            <div className="absolute top-4 left-4 text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-500/40 font-bold uppercase">
              SEISMIC SURVIVAL POSTURE &bull; 震度6強対応姿勢
            </div>

            <svg
              viewBox="0 0 600 400"
              className="w-full h-auto max-h-[380px] select-none"
              aria-label="Correct Earthquake Posture Under Table"
            >
              {/* Classroom / Office floor */}
              <defs>
                <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="woodDesk" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#b45309" />
                  <stop offset="50%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#92400e" />
                </linearGradient>
                <linearGradient id="metalLeg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>
                <filter id="glowDrop" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#ef4444" floodOpacity="0.6" />
                </filter>
              </defs>

              {/* Grid / Room backdrop */}
              <rect x="0" y="0" width="600" height="400" fill="#090d16" />
              <line x1="0" y1="330" x2="600" y2="330" stroke="#334155" strokeWidth="2" />
              <rect x="0" y="330" width="600" height="70" fill="url(#floorGrad)" />

              {/* Falling hazard simulation (deflected by table) */}
              <g opacity="0.8">
                {/* Ceiling fixture bouncing off */}
                <path d="M 230 40 L 260 70 L 240 75 Z" fill="#94a3b8" />
                <path d="M 260 70 L 290 85 L 270 95 Z" fill="#cbd5e1" stroke="#e2e8f0" strokeWidth="1" />
                {/* Broken fluorescent light beam deflecting */}
                <line x1="280" y1="20" x2="310" y2="80" stroke="#fef08a" strokeWidth="3" strokeDasharray="4 2" />
                <path d="M 310 80 L 370 50" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                {/* Deflection impact sparks */}
                <circle cx="310" cy="85" r="7" fill="#f59e0b" opacity="0.4" />
                <circle cx="310" cy="85" r="3" fill="#ffffff" />
                <text x="325" y="80" fill="#f59e0b" fontSize="10" fontWeight="bold">DEFLECTED!</text>
              </g>

              {/* Heavy Study Desk / Table */}
              <g id="tableGroup">
                {/* Left Leg (Background) */}
                <rect x="155" y="110" width="16" height="220" rx="3" fill="#1e293b" stroke="#0f172a" />
                {/* Right Leg (Background) */}
                <rect x="425" y="110" width="16" height="220" rx="3" fill="#1e293b" stroke="#0f172a" />

                {/* Left Leg (Foreground - the one held) */}
                <rect
                  x="180"
                  y="110"
                  width="18"
                  height="220"
                  rx="4"
                  fill="url(#metalLeg)"
                  stroke={selectedHotspot === 'leg' ? '#ef4444' : '#475569'}
                  strokeWidth={selectedHotspot === 'leg' ? '3' : '1.5'}
                />

                {/* Right Leg (Foreground) */}
                <rect x="400" y="110" width="18" height="220" rx="4" fill="url(#metalLeg)" stroke="#475569" strokeWidth="1.5" />

                {/* Thick Table Top (Shield) */}
                <rect
                  x="130"
                  y="90"
                  width="340"
                  height="26"
                  rx="6"
                  fill="url(#woodDesk)"
                  stroke={selectedHotspot === 'table' ? '#ef4444' : '#78350f'}
                  strokeWidth={selectedHotspot === 'table' ? '3' : '1.5'}
                />
                <line x1="135" y1="102" x2="465" y2="102" stroke="#f59e0b" strokeWidth="1.5" opacity="0.4" />
              </g>

              {/* Student Under Table (Correct Posture) */}
              <g id="studentPosture" transform="translate(40, 20)">
                {/* Legs folded compact */}
                {/* Thighs */}
                <path
                  d="M 230 290 Q 210 240 260 220"
                  stroke="#1d4ed8"
                  strokeWidth="24"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Lower legs / shins tucked flat */}
                <path
                  d="M 230 290 L 190 300"
                  stroke="#1e40af"
                  strokeWidth="20"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Feet / Shoes */}
                <ellipse cx="180" cy="302" rx="14" ry="8" fill="#0f172a" />

                {/* Torso curved inward */}
                <path
                  d="M 260 220 Q 280 185 300 210"
                  stroke="#2563eb"
                  strokeWidth="34"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Head tucked low towards chest */}
                <circle
                  cx="315"
                  cy="200"
                  r="22"
                  fill="#fcd34d"
                  stroke={selectedHotspot === 'neck' ? '#ef4444' : '#d97706'}
                  strokeWidth={selectedHotspot === 'neck' ? '3' : '1.5'}
                />
                {/* Hair */}
                <path d="M 300 185 Q 320 178 335 195 Q 315 185 300 185 Z" fill="#1e293b" />

                {/* Arm 1: Wrapped over back of neck/head (Shielding Nape) */}
                <path
                  d="M 285 200 Q 305 180 325 190"
                  stroke="#1d4ed8"
                  strokeWidth="14"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Hand shielding head */}
                <circle cx="328" cy="190" r="7" fill="#fcd34d" />

                {/* Arm 2: Reaching forward, gripping desk leg firmly */}
                <path
                  d="M 275 220 Q 210 210 158 200"
                  stroke="#2563eb"
                  strokeWidth="15"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Hand clutched around desk leg */}
                <ellipse
                  cx="158"
                  cy="200"
                  rx="9"
                  ry="8"
                  fill="#fcd34d"
                  stroke="#d97706"
                  strokeWidth="1"
                />
              </g>

              {/* HOTSPOT 1: Neck & Spine Shield Pin */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedHotspot('neck')}
                filter={selectedHotspot === 'neck' ? 'url(#glowDrop)' : undefined}
              >
                <circle cx="355" cy="210" r="14" fill="#ef4444" opacity="0.9" />
                <circle cx="355" cy="210" r="7" fill="#ffffff" />
                <text x="355" y="214" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">1</text>
              </g>

              {/* HOTSPOT 2: Leg Grip Pin */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedHotspot('leg')}
                filter={selectedHotspot === 'leg' ? 'url(#glowDrop)' : undefined}
              >
                <circle cx="198" cy="220" r="14" fill="#ef4444" opacity="0.9" />
                <circle cx="198" cy="220" r="7" fill="#ffffff" />
                <text x="198" y="224" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">2</text>
              </g>

              {/* HOTSPOT 3: Tabletop Shield Pin */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedHotspot('table')}
                filter={selectedHotspot === 'table' ? 'url(#glowDrop)' : undefined}
              >
                <circle cx="300" cy="103" r="14" fill="#ef4444" opacity="0.9" />
                <circle cx="300" cy="103" r="7" fill="#ffffff" />
                <text x="300" y="107" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">3</text>
              </g>

              {/* HOTSPOT 4: Tucked Body Pin */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedHotspot('body')}
                filter={selectedHotspot === 'body' ? 'url(#glowDrop)' : undefined}
              >
                <circle cx="280" cy="285" r="14" fill="#ef4444" opacity="0.9" />
                <circle cx="280" cy="285" r="7" fill="#ffffff" />
                <text x="280" y="289" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="bold">4</text>
              </g>
            </svg>
          </div>

          {/* Hotspot Inspector Explainer Card */}
          <div className="lg:col-span-5 rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                  {selectedHotspot === 'neck' ? '1' : selectedHotspot === 'leg' ? '2' : selectedHotspot === 'table' ? '3' : '4'}
                </span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                  {selectedHotspot === 'neck' ? t.hotspot_neck_label : selectedHotspot === 'leg' ? t.hotspot_leg_label : selectedHotspot === 'table' ? t.hotspot_table_label : t.hotspot_body_label}
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
                {selectedHotspot === 'neck' && t.hotspot_neck_title}
                {selectedHotspot === 'leg' && t.hotspot_leg_title}
                {selectedHotspot === 'table' && t.hotspot_table_title}
                {selectedHotspot === 'body' && t.hotspot_body_title}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedHotspot === 'neck' && t.hotspot_neck_desc}
                {selectedHotspot === 'leg' && t.hotspot_leg_desc}
                {selectedHotspot === 'table' && t.hotspot_table_desc}
                {selectedHotspot === 'body' && t.hotspot_body_desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>タップして他の部位を切り替え</span>
              <div className="flex items-center gap-1">
                {(['neck', 'leg', 'table', 'body'] as const).map((id) => (
                  <button
                    key={id}
                    onClick={() => setSelectedHotspot(id)}
                    className={`w-6 h-6 rounded text-[11px] font-bold font-mono transition ${
                      selectedHotspot === id ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {id === 'neck' ? '1' : id === 'leg' ? '2' : id === 'table' ? '3' : '4'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: DO vs DON'T (Life-Saving Rules vs Fatal Mistakes) */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>{t.compare_title}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* CORRECT DOs */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold text-base border-b border-slate-800 pb-3">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{t.correct_heading}</span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.correct_item1}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.correct_item2}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.correct_item3}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{t.correct_item4}</span>
              </li>
            </ul>
          </div>

          {/* DANGEROUS DON'Ts */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-red-500/40 shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-red-400 font-bold text-base border-b border-slate-800 pb-3">
              <XCircle className="w-5 h-5 flex-shrink-0" />
              <span>{t.mistake_heading}</span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{t.mistake_item1}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{t.mistake_item2}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{t.mistake_item3}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span>{t.mistake_item4}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Room-by-Room Survival Guide */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <span>{t.room_guide_title}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Classroom */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-xs font-mono font-bold uppercase text-blue-400 mb-1">
              #1 CLASSROOM & WORK
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
              {t.room_classroom}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.room_classroom_desc}
            </p>
          </div>

          {/* Bedroom */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-xs font-mono font-bold uppercase text-purple-400 mb-1">
              #2 BEDROOM
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
              {t.room_bed}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.room_bed_desc}
            </p>
          </div>

          {/* Kitchen */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-xs font-mono font-bold uppercase text-amber-400 mb-1">
              #3 KITCHEN
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
              {t.room_kitchen}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.room_kitchen_desc}
            </p>
          </div>

          {/* Outdoors */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-xs font-mono font-bold uppercase text-emerald-400 mb-1">
              #4 OUTDOORS / STREET
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
              {t.room_street}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.room_street_desc}
            </p>
          </div>

          {/* Train */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <div className="text-xs font-mono font-bold uppercase text-rose-400 mb-1">
              #5 TRANSIT / TRAIN
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
              {t.room_train}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.room_train_desc}
            </p>
          </div>

          {/* Quick Return to Dashboard button card */}
          <div
            onClick={onBackToDashboard}
            className="cursor-pointer p-4 rounded-xl bg-blue-950/40 border border-blue-500/40 hover:bg-blue-900/30 transition flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono font-bold uppercase text-blue-300 block mb-1">
                DISASTER PORTAL
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {t.breadcrumb_home}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                気象庁リアルタイム警報や避難所マップへ戻る
              </p>
            </div>
            <div className="mt-3 flex items-center gap-1 text-xs font-bold text-blue-400">
              <span>{t.breadcrumb_home} &rarr;</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
