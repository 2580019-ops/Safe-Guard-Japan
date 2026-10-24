import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Shield,
  HelpCircle,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Maximize2,
  Timer,
  Award,
  AlertTriangle,
  Flame,
  Activity
} from 'lucide-react';
import { SupportedLanguage } from '../data/phrases';

interface EarthquakeDrillAnimationProps {
  language: SupportedLanguage;
}

// Scenarios available
type ScenarioType = 'desk' | 'living' | 'street';

export const EarthquakeDrillAnimation: React.FC<EarthquakeDrillAnimationProps> = ({
  language
}) => {
  // Mode selection: 'video' (12s animated loop) or 'drill' (60s interactive practice timer)
  const [activeTab, setActiveTab] = useState<'video' | 'drill'>('video');

  // Playback state for 12s animation video
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0); // 0 to 12 seconds
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('desk');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // 60-Second Interactive Drill Timer State
  const DRILL_MAX_SECONDS = 60;
  const [drillSecondsLeft, setDrillSecondsLeft] = useState<number>(DRILL_MAX_SECONDS);
  const [isDrillRunning, setIsDrillRunning] = useState<boolean>(false);
  const [drillCompleted, setDrillCompleted] = useState<boolean>(false);
  const [drillSoundEnabled, setDrillSoundEnabled] = useState<boolean>(true);

  // Audio Context ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rumbleOscRef = useRef<OscillatorNode | null>(null);
  const rumbleGainRef = useRef<GainNode | null>(null);

  const TOTAL_DURATION = 12; // 12 seconds total loop

  // Multilingual scenario texts
  const SCENARIOS = {
    desk: {
      ja: {
        title: '学校・勉強机・オフィスの避難（机の下へ）',
        label: '学校・机の下',
        steps: [
          { time: 0, title: '普段の学習中 / 平常時', desc: '机で勉強や作業を行っている状態です。' },
          { time: 2.5, title: '1. DROP (姿勢を低く！)', desc: '緊急地震速報や揺れを感じたら、まずは姿勢を低くして転倒を防ぎます。' },
          { time: 5.0, title: '2. COVER (頭部を守り机の下へ！)', desc: '頑丈な机の下に潜り込み、落下物（照明、本、ガラス）から頭と首を守ります。' },
          { time: 8.0, title: '3. HOLD ON (机の脚をしっかり固定！)', desc: '激しい揺れで机が移動しないよう、片手で机の脚を強く握り、もう片手で頭部を保護します。' },
          { time: 10.5, title: '揺れが収まるまで待機', desc: '慌てて外に飛び出さず、揺れが完全に止まるまで机の下で安全を確保します。' }
        ]
      },
      en: {
        title: 'Classroom & Study Desk: Drop, Cover & Hold On',
        label: 'School / Desk',
        steps: [
          { time: 0, title: 'Normal Study Session', desc: 'Studying or working normally at a study desk.' },
          { time: 2.5, title: '1. DROP (Get Low on Hands & Knees)', desc: 'When the alert sounds or shaking begins, immediately drop low to prevent falling.' },
          { time: 5.0, title: '2. COVER (Shield Head & Under Desk)', desc: 'Crawl underneath the sturdy desk to protect your head and neck from falling debris.' },
          { time: 8.0, title: '3. HOLD ON (Grip Desk Leg Tightly)', desc: 'Grip one desk leg firmly so the desk cannot slide away during violent shaking.' },
          { time: 10.5, title: 'Wait Until Shaking Stops Completely', desc: 'Do not rush outside. Stay safely under the desk until all tremors cease.' }
        ]
      },
      bn: {
        title: 'ক্লাসরুম ও পড়ার টেবিল: ড্রপ, কভার ও হোল্ড অন',
        label: 'পড়ার টেবিল / স্কুল',
        steps: [
          { time: 0, title: 'স্বাভাবিক পড়াশোনা অবস্থা', desc: 'টেবিলে বসে শান্তভাবে পড়াশোনা বা কাজ করা হচ্ছে।' },
          { time: 2.5, title: '১. DROP (নিচু হয়ে বসে পড়ুন)', desc: 'ভূমিকম্পের ঝাঁকুনি অনুভব করলেই ছিটকে পড়ে যাওয়া এড়াতে মেঝেতে নিচু হয়ে বসুন।' },
          { time: 5.0, title: '২. COVER (মাথা ঢেকে টেবিলের নিচে ঢুকুন)', desc: 'শক্ত পড়ার টেবিলের নিচে ঢুকে হাত দিয়ে ঘাড় ও মাথা ঢাকুন, যেন ওপর থেকে কিছু পড়লেও আঘাত না লাগে।' },
          { time: 8.0, title: '৩. HOLD ON (টেবিলের পা শক্ত করে ধরুন)', desc: 'প্রচণ্ড কম্পনে টেবিল সরে যাওয়া রোধ করতে এক হাতে টেবিলের পা শক্ত করে ধরুন ও অন্য হাত দিয়ে ঘাড় রক্ষা করুন।' },
          { time: 10.5, title: 'কম্পন সম্পূর্ণ থামা পর্যন্ত অপেক্ষা করুন', desc: 'আতঙ্কিত হয়ে বাইরে দৌড়াবেন না। ঘরের ভেতরে টেবিলের নিচে শান্তভাবে অবস্থান করুন।' }
        ]
      },
      vi: {
        title: 'Lớp học & Bàn học: Cúi thấp, Che chắn & Giữ chặt',
        label: 'Trường học / Bàn',
        steps: [
          { time: 0, title: 'Trạng thái học tập bình thường', desc: 'Đang ngồi học hoặc làm việc bình thường tại bàn.' },
          { time: 2.5, title: '1. DROP (Cúi thấp người)', desc: 'Hạ thấp tư thế xuống sàn ngay lập tức để tránh bị ngã do rung lắc dữ dội.' },
          { time: 5.0, title: '2. COVER (Chui vào gầm bàn che đầu)', desc: 'Nhanh chóng chui xuống gầm bàn kiên cố để bảo vệ đầu khỏi các mảnh vỡ và bóng đèn rơi.' },
          { time: 8.0, title: '3. HOLD ON (Giữ chặt chân bàn)', desc: 'Dùng một tay nắm chặt chân bàn để bàn không bị xê dịch, tay còn lại che chắn gáy.' },
          { time: 10.5, title: 'Chờ rung lắc chấm dứt hoàn toàn', desc: 'Không hoảng loạn chạy ra ngoài trong khi động đất đang xảy ra.' }
        ]
      }
    },
    living: {
      ja: {
        title: 'リビング・部屋の中での安全確保',
        label: '部屋・リビング',
        steps: [
          { time: 0, title: '普段のくつろぎ時間', desc: '部屋の中で過ごしている状態です。' },
          { time: 2.5, title: '1. 窓や倒れる家具から離れる', desc: '本棚、大型テレビ、窓ガラスから直ちに離れます。' },
          { time: 5.0, title: '2. クッションや座布団で頭を保護', desc: '近くの座布団やクッション、カバンで頭部を最優先で包み込みます。' },
          { time: 8.0, title: '3. 低い姿勢で揺れが止まるのを待つ', desc: '柱のそばや強度の高い家具の横で小さくなって耐えます。' },
          { time: 10.5, title: '揺れ収束後、火の元と出口の確認', desc: '揺れが完全に止まったら、ドアを開けて避難経路を確保し、火の元を確認します。' }
        ]
      },
      en: {
        title: 'Living Room: Staying Safe from Falling Glass & Cabinets',
        label: 'Living Room',
        steps: [
          { time: 0, title: 'Normal indoor situation', desc: 'Relaxing inside the living room.' },
          { time: 2.5, title: '1. Move away from glass & shelves', desc: 'Quickly distance yourself from bookcases, large TVs, and window glass.' },
          { time: 5.0, title: '2. Protect head with cushion/bag', desc: 'Use sofa cushions, pillows, or a backpack to cover and protect your head.' },
          { time: 8.0, title: '3. Crouch low next to strong walls', desc: 'Curl into a ball near an interior wall or solid pillar until shaking stops.' },
          { time: 10.5, title: 'Check exit doors after tremors stop', desc: 'Once safe, gently open the entrance door to prevent being jammed inside.' }
        ]
      },
      bn: {
        title: 'বাসার বসার ঘর: জানালার কাচ ও আলমারি থেকে দূরে থাকা',
        label: 'বাসা / লিভিং রুম',
        steps: [
          { time: 0, title: 'স্বাভাবিক ঘরোয়া অবস্থা', desc: 'ঘরে স্বাভাবিক সময় কাটানো হচ্ছে।' },
          { time: 2.5, title: '১. কাচ ও ভারী আলমারি থেকে দূরে যান', desc: 'বইয়ের তাক, কাচের জানালা ও ঝুলন্ত ফ্যান থেকে দ্রুত দূরে সরে যান।' },
          { time: 5.0, title: '২. কুশন বা ব্যাগ দিয়ে মাথা ঢাকুন', desc: 'কাছের কুশন, বালিশ বা শক্ত ব্যাগ দিয়ে নিজের মাথা ও ঘাড় সম্পূর্ণ ঢেকে ফেলুন।' },
          { time: 8.0, title: '৩. নিচু হয়ে কুঁকড়ে বসে থাকুন', desc: 'ঘরের শক্ত দেয়ালের পাশে বা সোফার আড়ালে নিচু হয়ে কম্পন শেষ হওয়া পর্যন্ত অপেক্ষা করুন।' },
          { time: 10.5, title: 'কম্পন থামলে বের হওয়ার দরজা খুলে রাখুন', desc: 'কম্পন থামার পর সদর দরজা সামান্য খুলে রাখুন যেন দেয়াল হেলে গিয়ে দরজা আটকে না যায়।' }
        ]
      },
      vi: {
        title: 'Phòng khách: Tránh xa kính và tủ kệ rơi',
        label: 'Phòng khách',
        steps: [
          { time: 0, title: 'Sinh hoạt bình thường trong nhà', desc: 'Đang ở trong phòng khách.' },
          { time: 2.5, title: '1. Tránh xa cửa kính và tủ cao', desc: 'Rời xa kệ sách, tivi lớn và cửa sổ kính có thể nứt vỡ.' },
          { time: 5.0, title: '2. Dùng gối hoặc ba lô che đầu', desc: 'Dùng gối đệm hoặc túi xách để bảo vệ vùng đầu và cổ.' },
          { time: 8.0, title: '3. Ngồi sát vào góc tường kiên cố', desc: 'Thu người lại ở vị trí an toàn cho đến khi hết rung lắc.' },
          { time: 10.5, title: 'Mở hé cửa sau khi rung chấn dừng', desc: 'Mở cửa chính để đảm bảo lối thoát hiểm không bị kẹt méo mó.' }
        ]
      }
    },
    street: {
      ja: {
        title: '街中・屋外（看板やガラスの落下防止）',
        label: '街中・屋外',
        steps: [
          { time: 0, title: '屋外を歩行中', desc: '街路や道路を歩いている状態です。' },
          { time: 2.5, title: '1. ビルの壁際・電柱から離れる', desc: '看板や窓ガラスの破片が上空から降り注ぐ危険があります。' },
          { time: 5.0, title: '2. 手持ちのカバンで頭上を守る', desc: 'カバンやリュックを両手で頭上に掲げ、直撃を防ぎます。' },
          { time: 8.0, title: '3. 広場やオープンスペースへ移動', desc: '落下物のない公園や広い歩道へ移動し、低く構えます。' },
          { time: 10.5, title: 'ブロック塀・自動販売機の倒壊に警戒', desc: '古い塀やブロック、自販機の倒壊に注意しながら安全を確保します。' }
        ]
      },
      en: {
        title: 'Outdoor & Streets: Protecting from Falling Signboards & Glass',
        label: 'Outdoors / Street',
        steps: [
          { time: 0, title: 'Walking along the street', desc: 'Walking through a town or city street.' },
          { time: 2.5, title: '1. Step away from tall building walls', desc: 'Beware of shattering glass facades and hanging neon signboards falling.' },
          { time: 5.0, title: '2. Hold your bag directly over head', desc: 'Raise your backpack, bag, or coat over your head with both hands.' },
          { time: 8.0, title: '3. Move towards open spaces', desc: 'Head towards a park or wide open street away from falling hazards.' },
          { time: 10.5, title: 'Beware of collapsing block walls', desc: 'Keep clear of concrete block walls and heavy vending machines that may fall.' }
        ]
      },
      bn: {
        title: 'রাস্তাঘাট ও উন্মুক্ত স্থান: সাইনবোর্ড ও কাচ পড়া থেকে আত্মরক্ষা',
        label: 'রাস্তাঘাট / বাইরে',
        steps: [
          { time: 0, title: 'বাইরে রাস্তায় হাঁটার সময়', desc: 'শহরের রাস্তায় স্বাভাবিকভাবে হাঁটা হচ্ছে।' },
          { time: 2.5, title: '১. বহুতল ভবনের দেয়াল থেকে সরুন', desc: 'উঁচু ভবনের কাচ বা সাইনবোর্ড ভেঙে নিচে পড়ার চরম ঝুঁকি থাকে।' },
          { time: 5.0, title: '২. হাতব্যাগ দিয়ে মাথা ঢেকে রাখুন', desc: 'কাছের স্কুলব্যাগ, হ্যান্ডব্যাগ বা জ্যাকেট দুই হাত দিয়ে মাথার ওপর চেপে ধরুন।' },
          { time: 8.0, title: '৩. উন্মুক্ত মাঠ বা চত্বরে যান', desc: 'যেখানে ওপর থেকে কিছু পড়ার সুযোগ নেই এমন খোলা মাঠ বা চত্বরে নিচু হয়ে দাঁড়ান।' },
          { time: 10.5, title: 'পুরোনো দেয়াল ও ভেন্ডিং মেশিন এড়িয়ে চলুন', desc: 'ইটের পুরোনো সীমানা প্রাচীর ও বৈদ্যুতিক খুঁটি হেলে পড়তে পারে, সাবধান থাকুন।' }
        ]
      },
      vi: {
        title: 'Đường phố & Ngoài trời: Tránh biển quảng cáo và kính rơi',
        label: 'Ngoài trời / Đường phố',
        steps: [
          { time: 0, title: 'Đang đi bộ ngoài đường', desc: 'Đang di chuyển trên đường phố.' },
          { time: 2.5, title: '1. Tránh xa các tòa nhà cao tầng', desc: 'Kính vỡ và biển hiệu có thể rơi xuống từ trên cao.' },
          { time: 5.0, title: '2. Dùng túi xách che kín đỉnh đầu', desc: 'Giơ balo hoặc áo khoác lên che đầu bằng cả hai tay.' },
          { time: 8.0, title: '3. Di chuyển đến khoảng đất trống', desc: 'Tiến về công viên hoặc khoảng sân rộng không có vật thể rơi.' },
          { time: 10.5, title: 'Cảnh giác với tường bao và máy bán hàng', desc: 'Tránh xa tường gạch bê tông cũ và cột điện có thể đổ sập.' }
        ]
      }
    }
  };

  const currentScenarioData = SCENARIOS[activeScenario][language] || SCENARIOS[activeScenario].ja;

  // Sound generator using Web Audio API
  const playSoundEffect = (type: 'alarm' | 'rumble' | 'deflect' | 'tick' | 'fanfare' | 'phase') => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (type === 'alarm') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'tick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } else if (type === 'phase') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.42);
      } else if (type === 'fanfare') {
        // Melodic victory chime for completing the 60s drill
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = ctx.currentTime + idx * 0.12;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);
          gain.gain.setValueAtTime(0.2, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.42);
        });
      } else if (type === 'deflect') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.16);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Start / Stop persistent earthquake rumble sound
  useEffect(() => {
    if (!soundEnabled || !isPlaying) {
      if (rumbleOscRef.current) {
        try {
          rumbleOscRef.current.stop();
          rumbleOscRef.current.disconnect();
        } catch {
          // ignore
        }
        rumbleOscRef.current = null;
      }
      return;
    }

    const isEarthquakePhase = currentTime >= 2.5 && currentTime < 10.5;

    if (isEarthquakePhase) {
      if (!rumbleOscRef.current) {
        try {
          if (!audioCtxRef.current) {
            const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            audioCtxRef.current = new AudioContextClass();
          }
          const ctx = audioCtxRef.current;
          if (ctx.state === 'suspended') {
            ctx.resume();
          }
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(45, ctx.currentTime);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          rumbleOscRef.current = osc;
          rumbleGainRef.current = gain;
        } catch {
          // ignore
        }
      }
    } else {
      if (rumbleOscRef.current) {
        try {
          rumbleOscRef.current.stop();
          rumbleOscRef.current.disconnect();
        } catch {
          // ignore
        }
        rumbleOscRef.current = null;
      }
    }

    return () => {
      if (rumbleOscRef.current) {
        try {
          rumbleOscRef.current.stop();
          rumbleOscRef.current.disconnect();
        } catch {
          // ignore
        }
        rumbleOscRef.current = null;
      }
    };
  }, [soundEnabled, isPlaying, currentTime]);

  // Main animation 12s loop interval
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 50; // ms
    const increment = (intervalTime / 1000) * playbackSpeed;

    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + increment;
        if (next >= TOTAL_DURATION) {
          return 0; // loop
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  // 60-Second Interactive Drill Countdown Timer Effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isDrillRunning && drillSecondsLeft > 0) {
      interval = setInterval(() => {
        setDrillSecondsLeft((prev) => {
          const next = prev - 1;
          if (drillSoundEnabled && next > 0) {
            // Milestone sounds at 55s, 45s, 10s
            if (next === 55 || next === 45 || next === 10) {
              playSoundEffect('phase');
            } else {
              playSoundEffect('tick');
            }
          }
          if (next <= 0) {
            setIsDrillRunning(false);
            setDrillCompleted(true);
            if (drillSoundEnabled) {
              playSoundEffect('fanfare');
            }
            return 0;
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDrillRunning, drillSecondsLeft, drillSoundEnabled]);

  // Drill Start / Reset handlers
  const handleStartDrill = () => {
    if (drillSecondsLeft === 0) {
      setDrillSecondsLeft(DRILL_MAX_SECONDS);
      setDrillCompleted(false);
    }
    setIsDrillRunning(true);
    setDrillCompleted(false);
    if (drillSoundEnabled) {
      playSoundEffect('alarm');
    }
  };

  const handlePauseDrill = () => {
    setIsDrillRunning(false);
  };

  const handleResetDrill = () => {
    setIsDrillRunning(false);
    setDrillSecondsLeft(DRILL_MAX_SECONDS);
    setDrillCompleted(false);
  };

  // Determine drill stage and coaching instructions based on seconds left
  const drillElapsed = DRILL_MAX_SECONDS - drillSecondsLeft;
  const drillProgressPct = Math.round((drillElapsed / DRILL_MAX_SECONDS) * 100);

  const getDrillPhaseInfo = () => {
    if (drillCompleted || drillSecondsLeft === 0) {
      return {
        phase: 5,
        badge: 'DRILL COMPLETED (訓練完了)',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50',
        title: {
          ja: '🎉 60秒ドリル完了！安全確保成功',
          en: '🎉 60s Drill Completed! Safe Posture Held!',
          bn: '🎉 ৬০ সেকেন্ডের ড্রিল সফল! আপনি সুরক্ষিত!',
          vi: '🎉 Hoàn thành bài tập 60 giây an toàn!'
        }[language],
        desc: {
          ja: '素晴らしい！強い地震の主要動（40〜60秒間）を机の下で安全に耐え切りました。',
          en: 'Excellent! You held safe cover for the full 60-second primary seismic shockwave window.',
          bn: 'চমৎকার! ভূমিকম্পের তীব্র ঝাঁকুনির ৬০ সেকেন্ড আপনি টেবিলের নিচে নিরাপদে কাটিয়েছেন।',
          vi: 'Xuất sắc! Bạn đã giữ đúng tư thế trong suốt 60 giây chấn động mạnh nhất.'
        }[language],
        action: {
          ja: '周囲の安全を確認し、火の元や避難口をチェックしてください。',
          en: 'Slowly check surroundings for broken glass, gas leaks, and clear exit doors.',
          bn: 'ধীরে ধীরে আশপাশ দেখুন, কাচ বা আগুন আছে কিনা এবং সদর দরজা সামান্য খুলে রাখুন।',
          vi: 'Quan sát cẩn thận mảnh kính vỡ và mở hé cửa thoát hiểm.'
        }[language]
      };
    }

    if (drillElapsed < 5) {
      // 0 - 5 seconds
      return {
        phase: 1,
        badge: 'STEP 1: DROP (まず低く！)',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
        title: {
          ja: '1. DROP: すぐに床へ姿勢を低く！',
          en: '1. DROP: Get Down on Hands & Knees Immediately!',
          bn: '১. DROP: দ্রুত হাঁটু ও হাতের ওপর ভর দিয়ে মেঝেতে বসুন!',
          vi: '1. DROP: Hạ thấp trọng tâm người ngay lập tức!'
        }[language],
        desc: {
          ja: '激しい横揺れが来る前に、床に手足をついて転倒を防ぎます。立ち上がってはいけません！',
          en: 'Drop to hands and knees before violent lateral acceleration knocks you over. Never stay standing!',
          bn: 'তীব্র ঝাঁকুনিতে আছড়ে পড়া এড়াতে মাটিতে বসে পড়ুন। দাঁড়িয়ে থাকবেন না!',
          vi: 'Hạ thấp người xuống sàn để không bị ngã chấn thương. Tuyệt đối không đứng!'
        }[language],
        action: {
          ja: '重心を下げて机に素早く近づく',
          en: 'Lower center of gravity, approach study desk',
          bn: 'শরীরের ভারসাম্য নিচু করে টেবিলের দিকে যান',
          vi: 'Hạ thấp người, nhanh chóng bò đến gầm bàn'
        }[language]
      };
    } else if (drillElapsed < 15) {
      // 5 - 15 seconds
      return {
        phase: 2,
        badge: 'STEP 2: COVER (頭部・首を守る)',
        badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
        title: {
          ja: '2. COVER: 机の下に入り、腕で首の後ろを守る！',
          en: '2. COVER: Crawl Under Desk & Shield Nape of Neck!',
          bn: '২. COVER: টেবিলের নিচে ঢুকে এক হাত দিয়ে ঘাড় ও মাথা ঢাকুন!',
          vi: '2. COVER: Chui xuống gầm bàn và dùng tay che gáy!'
        }[language],
        desc: {
          ja: '机の下に入り、片腕の前腕で首の後ろ（延髄）をしっかりと覆います。照明や本が落ちてきても机が防ぎます。',
          en: 'Get entirely under the desk. Press one forearm tight against your neck and skull to shield vital brainstem nerves.',
          bn: 'টেবিলের নিচে ঢুকে পড়ুন। এক হাতের কনুই দিয়ে ঘাড় ও মাথার পেছনের অংশ শক্ত করে চেপে রাখুন।',
          vi: 'Chui gọn vào dưới gầm bàn. Áp chặt cánh tay vào gáy để bảo vệ tủy sống khỏi mảnh vỡ.'
        }[language],
        action: {
          ja: '落下物から最優先で頭部と首を守る',
          en: 'Protect brainstem and skull under tabletop',
          bn: 'ওপর থেকে খসে পড়া বস্তু থেকে মাথা রক্ষা করুন',
          vi: 'Bảo vệ đầu và gáy dưới mặt bàn kiên cố'
        }[language]
      };
    } else if (drillElapsed < 50) {
      // 15 - 50 seconds: Peak shaking
      return {
        phase: 3,
        badge: 'STEP 3: HOLD ON (机の脚を強く握る)',
        badgeColor: 'bg-red-500/20 text-red-300 border-red-500/50',
        title: {
          ja: '3. HOLD ON: 机の脚を掴み、体が外に出ないよう保持！',
          en: '3. HOLD ON: Grip Desk Leg Tightly & Stay Compact!',
          bn: '৩. HOLD ON: টেবিলের পায়া শক্ত করে ধরুন এবং শরীর গুটিয়ে রাখুন!',
          vi: '3. HOLD ON: Giữ chặt chân bàn và cuộn tròn người!'
        }[language],
        desc: {
          ja: '強い揺れで机が移動しないよう、片手で机の脚を強く握ります。机が動いた場合は机と一緒に移動します。',
          en: 'Violent shaking slides furniture across rooms! Clutch the desk leg firmly so your protective wooden shelter moves with you.',
          bn: 'প্রচণ্ড কম্পনে টেবিল ছিটকে যাওয়া আটকাতে এক হাতে টেবিলের পা শক্ত করে আঁকড়ে ধরে রাখুন!',
          vi: 'Rung lắc mạnh có thể hất văng bàn. Nắm chặt chân bàn để mái che kiên cố luôn ở trên đầu bạn.'
        }[language],
        action: {
          ja: '机の脚を強く握り、揺れが収まるまで耐え続ける',
          en: 'Maintain tight leg grip and compact tucked posture',
          bn: 'টেবিলের পায়া ধরে কুঁকড়ে বসে থাকুন',
          vi: 'Nắm chắc chân bàn và giữ nguyên tư thế'
        }[language]
      };
    } else {
      // 50 - 60 seconds: Subsiding
      return {
        phase: 4,
        badge: 'STEP 4: WAIT (揺れ収束待機)',
        badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
        title: {
          ja: '4. WAIT: 揺れが収まるまで机の下にとどまる！',
          en: '4. WAIT: Remain Under Cover Until Shaking Stops!',
          bn: '৪. WAIT: কম্পন না থামা পর্যন্ত টেবিলের নিচেই অবস্থান করুন!',
          vi: '4. WAIT: Tiếp tục ở yên dưới gầm bàn!'
        }[language],
        desc: {
          ja: '主要な揺れが収まってきています。慌てて外に出ず、あと数秒間そのまま待機してください。',
          en: 'Tremors are subsiding, but secondary ceiling tiles and glass may still fall. Stay tucked under cover.',
          bn: 'ঝাঁকুনি কমছে, কিন্তু হুট করে টেবিল থেকে বের হবেন না। আলগা কাচ বা লাইট খসে পড়তে পারে।',
          vi: 'Chấn động đang yếu dần. Đừng vội chui ra ngoài vì mảnh vỡ vẫn có thể tiếp tục rơi.'
        }[language],
        action: {
          ja: '焦らず安全を確認しながらカウントダウン終了を待つ',
          en: 'Wait out the final seconds before emerging safely',
          bn: 'শান্ত থাকুন এবং কাউন্টডাউন শেষ হওয়া পর্যন্ত অপেক্ষা করুন',
          vi: 'Bình tĩnh chờ hết thời gian đếm ngược'
        }[language]
      };
    }
  };

  const drillPhase = getDrillPhaseInfo();

  // Animation calculation for 12s loop
  const progressPercent = (currentTime / TOTAL_DURATION) * 100;
  const isShaking = currentTime >= 2.5 && currentTime < 10.5;
  const shakeIntensity = isShaking
    ? Math.sin(currentTime * 30) * (currentTime < 5 ? 3 : 7)
    : 0;

  // Derive visual posture states
  let studentState: 'studying' | 'drop' | 'under_desk' | 'hold_on' | 'safe_wait' = 'studying';
  if (currentTime < 2.5) {
    studentState = 'studying';
  } else if (currentTime < 5.0) {
    studentState = 'drop';
  } else if (currentTime < 8.0) {
    studentState = 'under_desk';
  } else if (currentTime < 10.5) {
    studentState = 'hold_on';
  } else {
    studentState = 'safe_wait';
  }

  const lampAngle = isShaking ? Math.sin(currentTime * 12) * 18 : 0;

  // Circular timer circumference
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (drillProgressPct / 100) * circumference;

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Header / Mode Switcher Bar */}
      <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <GraduationCap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                {language === 'bn'
                  ? 'ভূমিকম্প জরুরি শিক্ষা ও প্র্যাকটিস ভিডিও'
                  : language === 'vi'
                  ? 'Video giáo dục & Thực hành phòng chống động đất'
                  : language === 'en'
                  ? 'Emergency Education Video & Practice Drill'
                  : '地震防災教育アニメーション＆実技ドリル'}
              </h2>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-600/20 text-red-400 border border-red-500/30 uppercase">
                JMA Protocol
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'bn'
                ? 'পড়ার টেবিলে পড়াশোনার সময় ভূমিকম্প হলে কীভাবে টেবিলের নিচে মাথা ও শরীর বাঁচাবেন'
                : language === 'vi'
                ? 'Mô phỏng tư thế cúi thấp, che chắn và giữ chặt dưới gầm bàn học'
                : language === 'en'
                ? 'Visual demonstration of "Drop, Cover, and Hold On" under a sturdy study desk'
                : '学習机の下に潜り込み、頭部と首を守る動作の実演と60秒訓練タイマー'}
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'video'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>
              {language === 'bn'
                ? 'ভিডিও অ্যানিমেশন (১২ সে.)'
                : language === 'vi'
                ? 'Video mô phỏng (12s)'
                : language === 'en'
                ? 'Animation Video (12s)'
                : '実演アニメ動画 (12秒)'}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('drill')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'drill'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Timer className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {language === 'bn'
                ? '৬০ সেকেন্ড ড্রিল টাইমার'
                : language === 'vi'
                ? 'Bài tập 60 giây'
                : language === 'en'
                ? '60s Practice Drill'
                : '60秒実技ドリル'}
            </span>
          </button>
        </div>
      </div>

      {/* Main View Area: Video Simulation or 60s Drill */}
      {activeTab === 'video' ? (
        <div className="p-4 sm:p-6 space-y-4">
          {/* Scenario Selector Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>
                {language === 'bn'
                  ? 'দৃশ্যপট নির্বাচন করুন:'
                  : language === 'vi'
                  ? 'Chọn tình huống:'
                  : language === 'en'
                  ? 'Select Scenario:'
                  : 'シチュエーション選択:'}
              </span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(['desk', 'living', 'street'] as ScenarioType[]).map((scKey) => {
                const sc = SCENARIOS[scKey][language] || SCENARIOS[scKey].ja;
                return (
                  <button
                    key={scKey}
                    onClick={() => {
                      setActiveScenario(scKey);
                      setCurrentTime(0);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                      activeScenario === scKey
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    {sc.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Video Player Canvas Box */}
          <div
            className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[460px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner"
            style={{
              transform: `translate(${shakeIntensity}px, ${shakeIntensity * 0.4}px)`,
              transition: isShaking ? 'none' : 'transform 0.2s ease-out'
            }}
          >
            {/* Seismic Shaking Status Badge */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <div
                className={`px-3 py-1 rounded-full text-xs font-black font-mono tracking-wider uppercase border flex items-center gap-1.5 ${
                  isShaking
                    ? 'bg-red-600/90 text-white border-red-400 animate-bounce'
                    : 'bg-slate-800/80 text-emerald-400 border-slate-700'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isShaking ? 'bg-white animate-ping' : 'bg-emerald-400'
                  }`}
                />
                <span>{isShaking ? 'EARTHQUAKE / 地震発生中' : 'NORMAL / 平常時'}</span>
              </div>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-black/60 text-slate-300 text-[11px] font-mono border border-slate-700 backdrop-blur-sm">
                Scenario: {currentScenarioData.label}
              </span>
            </div>

            {/* Falling Hazard Warning Overlay */}
            {isShaking && (
              <div className="absolute top-4 right-4 z-20 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold">
                {language === 'bn'
                  ? 'উপর থেকে বস্তু খসে পড়ছে'
                  : language === 'vi'
                  ? 'Nguy cơ mảnh vỡ rơi từ trên cao'
                  : language === 'en'
                  ? 'Falling Debris Hazard'
                  : '落下物の危険'}
              </div>
            )}

            {/* SVG Animated Scene based on activeScenario */}
            <svg
              viewBox="0 0 600 400"
              className="w-full h-full max-w-[700px] object-contain"
            >
              {/* Wall Background & Floor */}
              <rect x="0" y="0" width="600" height="290" fill="#0f172a" />
              <rect x="0" y="290" width="600" height="110" fill="#1e293b" />

              {/* Floor perspective lines */}
              <line x1="0" y1="290" x2="600" y2="290" stroke="#334155" strokeWidth="3" />
              <line x1="120" y1="290" x2="60" y2="400" stroke="#334155" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="300" y1="290" x2="300" y2="400" stroke="#334155" strokeWidth="1.5" strokeOpacity="0.4" />
              <line x1="480" y1="290" x2="540" y2="400" stroke="#334155" strokeWidth="1.5" strokeOpacity="0.4" />

              {/* Classroom Chalkboard / Poster on Wall */}
              <rect x="50" y="40" width="180" height="100" rx="6" fill="#134e4a" stroke="#042f2e" strokeWidth="4" />
              <text x="140" y="75" fill="#5eead4" fontSize="13" fontWeight="bold" textAnchor="middle">
                防災の基本 / SAFE
              </text>
              <text x="140" y="98" fill="#ccfbf1" fontSize="11" textAnchor="middle">
                1. 低く (DROP)
              </text>
              <text x="140" y="116" fill="#ccfbf1" fontSize="11" textAnchor="middle">
                2. 頭を守り (COVER)
              </text>
              <text x="140" y="132" fill="#ccfbf1" fontSize="11" textAnchor="middle">
                3. 動かない (HOLD ON)
              </text>

              {/* Window on right wall with outdoors view */}
              <rect x="420" y="40" width="130" height="110" rx="4" fill="#0369a1" stroke="#38bdf8" strokeWidth="3" />
              <line x1="485" y1="40" x2="485" y2="150" stroke="#38bdf8" strokeWidth="2" />
              <line x1="420" y1="95" x2="550" y2="95" stroke="#38bdf8" strokeWidth="2" />
              <polygon points="450,95 485,60 520,95" fill="#e0f2fe" opacity="0.6" />

              {/* Hanging Ceiling Lamp (sways when shaking) */}
              <g
                transform={`translate(300, 0) rotate(${lampAngle})`}
                style={{ transformOrigin: 'top center' }}
              >
                <line x1="0" y1="0" x2="0" y2="90" stroke="#94a3b8" strokeWidth="2" />
                <polygon points="-25,90 25,90 35,115 -35,115" fill="#f59e0b" />
                <circle cx="0" cy="115" r="10" fill="#fef3c7" />
                <polygon points="-60,280 60,280 20,115 -20,115" fill="#fef3c7" opacity="0.08" />
              </g>

              {/* Falling Debris Particles during earthquake */}
              {isShaking && (
                <g>
                  {/* Falling book */}
                  <rect
                    x="260"
                    y={`${120 + ((currentTime * 120) % 150)}`}
                    width="24"
                    height="14"
                    rx="2"
                    fill="#ef4444"
                    transform={`rotate(${((currentTime * 180) % 360)}, 272, 127)`}
                  />
                  {/* Ceiling tile fragments */}
                  <polygon
                    points="340,140 355,145 348,155"
                    fill="#cbd5e1"
                    transform={`translate(0, ${((currentTime * 140) % 150)})`}
                  />
                  <polygon
                    points="210,130 225,138 215,146"
                    fill="#94a3b8"
                    transform={`translate(0, ${((currentTime * 110) % 150)})`}
                  />
                </g>
              )}

              {/* --- STUDY DESK (Sturdy Wooden Classroom / Office Desk) --- */}
              <g id="desk-group">
                {/* Back table legs */}
                <rect x="235" y="210" width="12" height="95" fill="#78350f" />
                <rect x="365" y="210" width="12" height="95" fill="#78350f" />

                {/* Table Top Surface with Thickness */}
                <rect x="200" y="200" width="210" height="20" rx="4" fill="#b45309" stroke="#fef3c7" strokeWidth="1.5" />
                <rect x="200" y="216" width="210" height="6" fill="#92400e" />

                {/* Front Table Legs */}
                <rect x="215" y="218" width="14" height="95" fill="#92400e" stroke="#451a03" strokeWidth="1" />
                <rect x="380" y="218" width="14" height="95" fill="#92400e" stroke="#451a03" strokeWidth="1" />

                {/* Sturdy Crossbar support */}
                <rect x="225" y="255" width="160" height="8" fill="#78350f" opacity="0.8" />

                {/* Items on top of desk (fall off when shaking starts) */}
                {!isShaking && studentState === 'studying' ? (
                  <g id="desk-items">
                    <rect x="230" y="186" width="35" height="8" rx="1" fill="#3b82f6" />
                    <rect x="232" y="178" width="32" height="8" rx="1" fill="#10b981" />
                    <rect x="350" y="180" width="16" height="20" rx="2" fill="#64748b" />
                    <line x1="355" y1="180" x2="352" y2="165" stroke="#ef4444" strokeWidth="2" />
                    <line x1="360" y1="180" x2="363" y2="168" stroke="#f59e0b" strokeWidth="2" />
                  </g>
                ) : null}
              </g>

              {/* --- STUDENT / PERSON CHARACTER ANIMATION --- */}
              {/* State 1: STUDYING (Sitting on chair beside desk) */}
              {studentState === 'studying' && (
                <g id="student-studying" transform="translate(270, 200)">
                  <rect x="25" y="40" width="8" height="70" fill="#475569" />
                  <rect x="15" y="38" width="45" height="8" fill="#334155" />
                  <rect x="52" y="0" width="6" height="50" fill="#475569" />
                  <rect x="10" y="45" width="12" height="55" fill="#1e3a8a" rx="4" />
                  <rect x="22" y="45" width="12" height="55" fill="#1e3a8a" rx="4" />
                  <ellipse cx="20" cy="25" rx="16" ry="24" fill="#2563eb" />
                  <circle cx="16" cy="-6" r="14" fill="#fed7aa" />
                  <path d="M 4 -12 Q 16 -22 28 -12 Q 30 -4 28 4 L 4 4 Z" fill="#1e293b" />
                  <path d="M 12 18 L -15 0" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
                </g>
              )}

              {/* State 2: DROP (Quickly lowering posture to the ground) */}
              {studentState === 'drop' && (
                <g id="student-drop" transform="translate(250, 240)">
                  <ellipse cx="40" cy="35" rx="28" ry="16" fill="#2563eb" />
                  <ellipse cx="65" cy="40" rx="16" ry="12" fill="#1e3a8a" />
                  <line x1="20" y1="35" x2="15" y2="65" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="10" cy="20" r="14" fill="#fed7aa" />
                  <path d="M -2 14 Q 10 4 22 14 Q 24 22 22 30 L -2 30 Z" fill="#1e293b" />
                  <path d="M 8 -5 L 8 8 M 2 -1 L 8 8 L 14 -1" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )}

              {/* State 3: COVER (Crawl underneath desk, protecting head) */}
              {studentState === 'under_desk' && (
                <g id="student-cover" transform="translate(270, 235)">
                  <ellipse cx="30" cy="38" rx="32" ry="18" fill="#2563eb" />
                  <ellipse cx="58" cy="42" rx="18" ry="14" fill="#1e3a8a" />
                  <path d="M 10 35 Q 0 10 18 12" fill="none" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" />
                  <circle cx="12" cy="22" r="13" fill="#fed7aa" />
                  <path d="M 0 16 Q 12 6 24 16 L 24 30 L 0 30 Z" fill="#1e293b" />
                  <circle cx="28" cy="30" r="42" fill="#10b981" opacity="0.12" />
                </g>
              )}

              {/* State 4: HOLD ON (Grip desk leg with one hand, protect neck with other) */}
              {(studentState === 'hold_on' || studentState === 'safe_wait') && (
                <g id="student-hold-on" transform="translate(265, 235)">
                  <ellipse cx="32" cy="38" rx="32" ry="18" fill="#2563eb" />
                  <ellipse cx="60" cy="42" rx="18" ry="14" fill="#1e3a8a" />
                  <path d="M 15 35 L -45 35" fill="none" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="-50" cy="35" r="7" fill="#fed7aa" stroke="#c2410c" strokeWidth="2" />
                  <path d="M 18 35 Q 8 10 22 12" fill="none" stroke="#fed7aa" strokeWidth="7" strokeLinecap="round" />
                  <circle cx="14" cy="20" r="13" fill="#fed7aa" />
                  <path d="M 2 14 Q 14 4 26 14 L 26 28 L 2 28 Z" fill="#1e293b" />
                  <g transform="translate(35, 10)">
                    <circle cx="0" cy="0" r="16" fill="#10b981" />
                    <path d="M -6 -1 L -2 4 L 7 -5" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </g>
              )}

              {/* Debris hitting the top of the desk and bouncing off */}
              {isShaking && (
                <g>
                  <circle cx="280" cy="200" r="12" fill="#f59e0b" opacity="0.4" />
                  <path d="M 270 190 L 290 190 L 285 180 Z" fill="#ef4444" />
                  <text x="280" y="180" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">
                    DEFLECTED!
                  </text>
                </g>
              )}
            </svg>

            {/* In-video subtitle bar */}
            <div className="absolute bottom-2 left-4 right-4 z-20 bg-black/80 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-slate-700/80 text-center">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 block mb-0.5">
                {studentState === 'studying' && '0.0s — NORMAL SITUATION'}
                {studentState === 'drop' && '2.5s — STEP 1: DROP (まず低く)'}
                {studentState === 'under_desk' && '5.0s — STEP 2: COVER (頭部保護)'}
                {studentState === 'hold_on' && '8.0s — STEP 3: HOLD ON (脚を固定)'}
                {studentState === 'safe_wait' && '10.5s — STEP 4: WAIT FOR STOP (収束待機)'}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white truncate sm:whitespace-normal">
                {studentState === 'studying' && (currentScenarioData.steps[0]?.desc || 'Studying normally')}
                {studentState === 'drop' && (currentScenarioData.steps[1]?.desc || 'Drop down low')}
                {studentState === 'under_desk' && (currentScenarioData.steps[2]?.desc || 'Cover head under desk')}
                {studentState === 'hold_on' && (currentScenarioData.steps[3]?.desc || 'Hold onto desk leg')}
                {studentState === 'safe_wait' && (currentScenarioData.steps[4]?.desc || 'Wait under cover')}
              </p>
            </div>
          </div>

          {/* Video Scrubber & Playback Controls */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>
                {Math.floor(currentTime)}s / {TOTAL_DURATION}s
              </span>
              <span className="font-semibold text-slate-300">
                {studentState === 'studying' && 'Step 0: 平常時 / Normal'}
                {studentState === 'drop' && 'Step 1: DROP (まず低く)'}
                {studentState === 'under_desk' && 'Step 2: COVER (頭部保護)'}
                {studentState === 'hold_on' && 'Step 3: HOLD ON (脚を固定)'}
                {studentState === 'safe_wait' && 'Step 4: SAFE (収束待機)'}
              </span>
            </div>
            {/* Interactive Scrub Bar */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                setCurrentTime(ratio * TOTAL_DURATION);
              }}
              className="relative w-full h-2.5 bg-slate-800 rounded-full cursor-pointer overflow-hidden group"
            >
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 rounded-full transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
              <span className="absolute left-[20%] top-0 bottom-0 w-0.5 bg-white/40" title="2.5s: Drop" />
              <span className="absolute left-[41%] top-0 bottom-0 w-0.5 bg-white/40" title="5.0s: Cover" />
              <span className="absolute left-[66%] top-0 bottom-0 w-0.5 bg-white/40" title="8.0s: Hold On" />
            </div>
          </div>

          {/* Buttons Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>一時停止 / Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>再生 / Play</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setCurrentTime(0);
                  setIsPlaying(true);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="最初から再生 (Replay)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Sound Toggle */}
              <button
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  if (next) playSoundEffect('alarm');
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  soundEnabled
                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                    : 'bg-slate-850 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title="警報・揺れの効果音 (Sound effects)"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4 text-amber-400" />
                    <span>Sound ON</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Sound OFF</span>
                  </>
                )}
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-medium">速度:</span>
              {[0.75, 1, 1.25].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2 py-1 rounded text-xs font-mono font-bold transition ${
                    playbackSpeed === spd
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* 3 Golden Rules summary cards below the video */}
          <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>DROP (まず低く)</span>
              </div>
              <p className="text-slate-300">
                {language === 'bn'
                  ? 'হঠাৎ কম্পনে ছিটকে পড়া এড়াতে দ্রুত নিচু হয়ে মেঝেতে বসুন।'
                  : language === 'vi'
                  ? 'Hạ thấp trọng tâm cơ thể để tránh bị ngã.'
                  : language === 'en'
                  ? 'Drop down onto your hands and knees to prevent falling.'
                  : '姿勢を低くして転倒とケガを防ぎます。'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-1.5 font-bold text-blue-400 mb-1">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>COVER (頭を守る)</span>
              </div>
              <p className="text-slate-300">
                {language === 'bn'
                  ? 'টেবিলের নিচে মাথা ও শরীর ঢুকিয়ে রাখুন, যাতে ওপর থেকে কিছু পড়লে রক্ষা পান।'
                  : language === 'vi'
                  ? 'Chui xuống gầm bàn để tránh mảnh vỡ và vật thể rơi trúng đầu.'
                  : language === 'en'
                  ? 'Cover your head and neck under a sturdy table or desk.'
                  : '頑丈な机の下に入り、落下物の直撃を回避します。'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>HOLD ON (動かない)</span>
              </div>
              <p className="text-slate-300">
                {language === 'bn'
                  ? 'কম্পন চলাকালীন টেবিলের পা শক্ত করে ধরে থাকুন, বাইরে দৌড়াবেন না।'
                  : language === 'vi'
                  ? 'Giữ chặt chân bàn cho đến khi rung lắc dừng hẳn.'
                  : language === 'en'
                  ? 'Hold on to the desk leg firmly until shaking stops.'
                  : '机が移動しないよう脚を掴み、揺れが収まるまで待ちます。'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* 60-Second Interactive Practice Drill Timer Component */
        <div className="p-5 sm:p-7 space-y-6 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            {/* Circular Countdown Ring */}
            <div className="relative flex-shrink-0 flex items-center justify-center">
              <svg className="w-48 h-48 transform -rotate-90">
                {/* Background Track */}
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="#1e293b"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Animated Progress Ring */}
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke={drillCompleted ? '#10b981' : drillElapsed < 5 ? '#f59e0b' : drillElapsed < 15 ? '#f43f5e' : drillElapsed < 50 ? '#ef4444' : '#3b82f6'}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-500 ease-linear"
                />
              </svg>

              {/* Inside Clock Display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                  {drillSecondsLeft}
                  <span className="text-base text-slate-400 font-sans ml-0.5">s</span>
                </span>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
                  {isDrillRunning ? 'ACTIVE DRILL' : drillCompleted ? 'COMPLETED' : 'PRACTICE'}
                </span>
                <span className="text-[10px] font-bold text-blue-400 mt-1">
                  {drillProgressPct}% ELAPSED
                </span>
              </div>
            </div>

            {/* Real-time Dynamic Phase Coaching Card */}
            <div className="flex-1 w-full space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${drillPhase.badgeColor}`}>
                  {drillPhase.badge}
                </span>
                {/* Sound Toggle for Drill */}
                <button
                  onClick={() => setDrillSoundEnabled(!drillSoundEnabled)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                  title="Audio cues"
                >
                  {drillSoundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{drillSoundEnabled ? 'Chimes ON' : 'Muted'}</span>
                </button>
              </div>

              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                {drillPhase.title}
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {drillPhase.desc}
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
                <span>
                  <strong className="text-amber-300">Action: </strong>
                  {drillPhase.action}
                </span>
              </div>
            </div>
          </div>

          {/* Drill Control Buttons */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 border-t border-slate-800">
            {!isDrillRunning ? (
              <button
                onClick={handleStartDrill}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-lg shadow-red-600/30 transition active:scale-95"
              >
                <Play className="w-4 h-4" />
                <span>
                  {drillSecondsLeft === DRILL_MAX_SECONDS
                    ? language === 'bn'
                      ? '৬০ সেকেন্ড প্র্যাকটিস শুরু করুন'
                      : language === 'vi'
                      ? 'Bắt đầu bài tập 60 giây'
                      : language === 'en'
                      ? 'Start 60s Practice Drill'
                      : '60秒実技練習スタート'
                    : language === 'bn'
                    ? 'পুনরায় শুরু করুন (Resume)'
                    : language === 'vi'
                    ? 'Tiếp tục'
                    : language === 'en'
                    ? 'Resume Drill'
                    : '練習再開'}
                </span>
              </button>
            ) : (
              <button
                onClick={handlePauseDrill}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-sm shadow-lg shadow-amber-600/30 transition active:scale-95"
              >
                <Pause className="w-4 h-4" />
                <span>
                  {language === 'bn'
                    ? 'বিরতি দিন (Pause)'
                    : language === 'vi'
                    ? 'Tạm dừng'
                    : language === 'en'
                    ? 'Pause Drill'
                    : '一時停止'}
                </span>
              </button>
            )}

            <button
              onClick={handleResetDrill}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>
                {language === 'bn'
                  ? 'রিসেট (Reset 60s)'
                  : language === 'vi'
                  ? 'Đặt lại'
                  : language === 'en'
                  ? 'Reset Timer'
                  : 'リセット'}
              </span>
            </button>

            {/* Why 60 seconds scientific explanation note */}
            <div className="ml-auto text-[11px] text-slate-400 flex items-center gap-1.5 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800/80">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>
                {language === 'bn'
                  ? 'কেন ৬০ সেকেন্ড? জাপানের মূল ভূমিকম্প সাধারণত ৪০ থেকে ৬০ সেকেন্ড স্থায়ী হয়।'
                  : language === 'vi'
                  ? 'Tại sao 60s? Rung chấn chính ở Nhật kéo dài từ 40-60 giây.'
                  : language === 'en'
                  ? 'Why 60s? Primary earthquake shaking in Japan typically lasts 40–60 seconds.'
                  : 'なぜ60秒？ 大地震の激しい主要動は通常40〜60秒間継続するためです。'}
              </span>
            </div>
          </div>

          {/* Interactive Posture Checklist for the User while Drilling */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>
                {language === 'bn'
                  ? 'ড্রিল চলাকালীন চেকলিস্ট (আপনার অবস্থান যাচাই করুন):'
                  : language === 'vi'
                  ? 'Danh sách kiểm tra tư thế của bạn:'
                  : language === 'en'
                  ? 'Active Posture Self-Check During Drill:'
                  : '訓練中の姿勢セルフチェック項目:'}
              </span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  {language === 'bn'
                    ? 'হাঁটু গুটিয়ে নিচু হওয়া'
                    : language === 'vi'
                    ? 'Quỳ gối hạ thấp người'
                    : language === 'en'
                    ? 'Knees tucked low'
                    : '重心を低くかがむ'}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  {language === 'bn'
                    ? 'টেবিলের নিচে মাথা রাখা'
                    : language === 'vi'
                    ? 'Đầu hoàn toàn dưới gầm'
                    : language === 'en'
                    ? 'Head under tabletop'
                    : '頭部が机の真下にある'}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  {language === 'bn'
                    ? 'এক হাতে ঘাড় ঢেকে রাখা'
                    : language === 'vi'
                    ? 'Cánh tay che kín gáy'
                    : language === 'en'
                    ? 'Arm shielding neck'
                    : '腕で首の根元を保護'}
                </span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  {language === 'bn'
                    ? 'অন্য হাতে পায়া শক্ত করে ধরা'
                    : language === 'vi'
                    ? 'Nắm chặt chân bàn'
                    : language === 'en'
                    ? 'Hand clutching leg'
                    : '片手で机の脚を強く把持'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
