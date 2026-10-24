import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { SAMPLE_SHELTERS, ShelterRecord } from './src/data/shelters.js';
import { SAMPLE_PHRASES, SupportedLanguage, UI_TRANSLATIONS } from './src/data/phrases.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory 60-second cache mimicking Spring Cache with Caffeine
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
let cachedAlert: CacheEntry<any> | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

// Haversine formula to calculate geographic distance in km
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100; // 2 decimal places
}

// JMA Client with 3-second timeout and 60-second cache
async function fetchJmaDisasterAlert(language: SupportedLanguage) {
  const now = Date.now();
  if (cachedAlert && now - cachedAlert.timestamp < CACHE_TTL_MS) {
    return {
      ...cachedAlert.data,
      isCached: true,
      cachedAt: new Date(cachedAlert.timestamp).toISOString()
    };
  }

  // 3-second timeout controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    // Official JMA endpoint for latest earthquake occurrences
    // https://www.jma.go.jp/bosai/quake/data/list.json
    const response = await fetch('https://www.jma.go.jp/bosai/quake/data/list.json', {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SafeGuardJapan/1.0 (Disaster Preparedness Portal)'
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`JMA server responded with status: ${response.status}`);
    }

    const quakes = (await response.json()) as any[];
    if (Array.isArray(quakes) && quakes.length > 0) {
      const latest = quakes[0];
      const maxInt = latest.maxInt || latest.shindo || '1';
      const anm = latest.anm || '地震速報';
      const place = latest.hypocenter?.name || latest.anm || '日本近海 / Domestic Japan';
      const mag = latest.hypocenter?.magnitude ? `M${latest.hypocenter.magnitude}` : '';
      const announcementTime = latest.at || latest.rdt || new Date().toISOString();

      const intensityNum = parseInt(maxInt.replace(/[^0-9]/g, '') || '1', 10);
      let severity: 'critical' | 'warning' | 'advisory' | 'info' = 'info';
      if (intensityNum >= 5) severity = 'critical';
      else if (intensityNum >= 4) severity = 'warning';
      else if (intensityNum >= 2) severity = 'advisory';

      const alertData = {
        alertType: 'earthquake',
        titleJa: '気象庁 地震速報（震度情報）',
        titleEn: 'JMA Seismic Intensity Report',
        titleBn: 'জেএমএ ভূমিকম্প তীব্রতা প্রতিবেদন',
        titleVi: 'Báo cáo độ rung chấn động đất JMA',
        affectedArea: place,
        intensity: `最大震度 ${maxInt}`,
        magnitude: mag,
        announcementTime,
        severity,
        source: '気象庁 (Japan Meteorological Agency)',
        rawId: latest.eid || latest.ctt || 'jma-latest'
      };

      cachedAlert = {
        data: alertData,
        timestamp: now
      };

      return {
        ...alertData,
        isCached: false,
        cachedAt: new Date(now).toISOString()
      };
    }
    throw new Error('JMA response was empty or malformed');
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn('JMA live fetch timed out or failed. Falling back to cache:', err.message);

    // If cachedAlert exists from an earlier successful fetch, return it with isCached: true
    if (cachedAlert) {
      return {
        ...cachedAlert.data,
        isCached: true,
        cachedAt: new Date(cachedAlert.timestamp).toISOString(),
        warning: 'Live JMA fetch temporarily unavailable. Serving latest cached observation.'
      };
    }

    // Default verified baseline information when offline or without internet
    const baseline = {
      alertType: 'info',
      titleJa: '現在、気象庁からの緊急警報はありません',
      titleEn: 'No Major Active JMA Emergency Alerts',
      titleBn: 'বর্তমানে কোনো প্রধান জরুরি সতর্কতা নেই',
      titleVi: 'Hiện không có cảnh báo khẩn cấp lớn nào từ JMA',
      affectedArea: '全国 (Nationwide)',
      intensity: '平常時 (Normal)',
      magnitude: 'N/A',
      announcementTime: new Date().toISOString(),
      severity: 'info',
      source: 'Japan Meteorological Agency (JMA Offline Baseline)',
      isCached: true,
      cachedAt: new Date().toISOString(),
      warning: 'Live connection unavailable. Displaying baseline status.'
    };
    return baseline;
  }
}

// API: GET /api/alert
app.get('/api/alert', async (req: Request, res: Response) => {
  const langParam = (req.query.language as string) || 'ja';
  const language: SupportedLanguage = ['ja', 'en', 'bn', 'vi'].includes(langParam)
    ? (langParam as SupportedLanguage)
    : 'ja'; // fallback to Japanese if invalid

  try {
    const alertResult = await fetchJmaDisasterAlert(language);

    // Match localized instructions based on severity
    let instructions = '';
    if (alertResult.severity === 'critical') {
      const p = SAMPLE_PHRASES.find((item) => item.key === 'earthquake_action');
      instructions = p ? p[`text_${language}` as keyof typeof p] as string : '';
    } else {
      const dict = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.ja;
      instructions = dict.normal_conditions_text;
    }

    // Localized title
    let title = alertResult.titleJa;
    if (language === 'en') title = alertResult.titleEn;
    else if (language === 'bn') title = alertResult.titleBn;
    else if (language === 'vi') title = alertResult.titleVi;

    res.json({
      status: 'success',
      language,
      data: {
        ...alertResult,
        title,
        instructions
      }
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve disaster information',
      error: error.message
    });
  }
});

// API: GET /api/shelters
app.get('/api/shelters', (req: Request, res: Response) => {
  const { latitude, longitude, radiusKm, disasterType, language } = req.query;

  // Validation
  if (latitude === undefined || longitude === undefined) {
    return res.status(400).json({
      status: 'error',
      message: 'Latitude and Longitude query parameters are required.'
    });
  }

  const lat = parseFloat(latitude as string);
  const lon = parseFloat(longitude as string);

  if (isNaN(lat) || lat < -90 || lat > 90) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid latitude. Must be between -90 and 90.'
    });
  }

  if (isNaN(lon) || lon < -180 || lon > 180) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid longitude. Must be between -180 and 180.'
    });
  }

  let radius = 3; // default 3km
  if (radiusKm !== undefined) {
    radius = parseFloat(radiusKm as string);
    if (isNaN(radius) || radius < 1 || radius > 20) {
      return res.status(400).json({
        status: 'error',
        message: 'Search radius must be between 1 and 20 km.'
      });
    }
  }

  const dType = (disasterType as string) || 'all';
  const validDisasters = ['all', 'earthquake', 'tsunami', 'flood'];
  if (!validDisasters.includes(dType)) {
    return res.status(400).json({
      status: 'error',
      message: `Invalid disasterType. Allowed values: ${validDisasters.join(', ')}`
    });
  }

  const lang: SupportedLanguage = ['ja', 'en', 'bn', 'vi'].includes(language as string)
    ? (language as SupportedLanguage)
    : 'ja';

  // Filter shelters from MariaDB-like dataset
  let candidates: ShelterRecord[] = SAMPLE_SHELTERS;

  if (dType === 'earthquake') {
    candidates = candidates.filter((s) => s.is_earthquake === 1);
  } else if (dType === 'tsunami') {
    candidates = candidates.filter((s) => s.is_tsunami === 1);
  } else if (dType === 'flood') {
    candidates = candidates.filter((s) => s.is_flood === 1);
  }

  // Calculate distance, sort by nearest, filter within radius, top 10
  const processed = candidates
    .map((shelter) => {
      const dist = calculateHaversineDistance(lat, lon, shelter.latitude, shelter.longitude);
      // Walking time at standard 80 meters per minute: minutes = (distance_km * 1000) / 80
      const walkingMinutes = Math.max(1, Math.round((dist * 1000) / 80));

      // Localized name: use English if requested and available, else Japanese fallback
      const displayName =
        lang === 'en' && shelter.name_en ? shelter.name_en : shelter.name_ja;

      return {
        id: shelter.id,
        name: displayName,
        nameJa: shelter.name_ja,
        nameEn: shelter.name_en,
        address: shelter.address,
        latitude: shelter.latitude,
        longitude: shelter.longitude,
        distanceKm: dist,
        estimatedWalkingMinutes: walkingMinutes,
        capacity: shelter.capacity,
        suitableFor: {
          earthquake: shelter.is_earthquake === 1,
          tsunami: shelter.is_tsunami === 1,
          flood: shelter.is_flood === 1
        },
        googleMapsUrl: `https://www.google.com/maps/dir/?api=1&origin=${lat},${lon}&destination=${shelter.latitude},${shelter.longitude}&travelmode=walking`
      };
    })
    .filter((s) => s.distanceKm <= radius)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 10);

  return res.json({
    status: 'success',
    count: processed.length,
    searchParams: {
      latitude: lat,
      longitude: lon,
      radiusKm: radius,
      disasterType: dType,
      language: lang
    },
    isSampleData: true,
    dataNotice: 'Shelter coordinates and capacities are development sample records. Follow local government instructions during actual evacuation.',
    data: processed
  });
});

// API: GET /api/phrases (to populate offline translations and safety message templates)
app.get('/api/phrases', (req: Request, res: Response) => {
  const lang = (req.query.language as SupportedLanguage) || 'ja';
  res.json({
    status: 'success',
    data: SAMPLE_PHRASES,
    translations: UI_TRANSLATIONS[lang] || UI_TRANSLATIONS.ja
  });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SafeGuard Japan] Full-stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
