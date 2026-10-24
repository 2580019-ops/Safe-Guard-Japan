import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Navigation,
  Compass,
  Footprints,
  Users,
  AlertTriangle,
  Waves,
  Building2,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { SupportedLanguage, UI_TRANSLATIONS } from '../data/phrases';
import { SAMPLE_SHELTERS, ShelterRecord } from '../data/shelters';

export interface ShelterResult {
  id: number;
  name: string;
  nameJa: string;
  nameEn: string | null;
  address: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  estimatedWalkingMinutes: number;
  capacity: number | null;
  suitableFor: {
    earthquake: boolean;
    tsunami: boolean;
    flood: boolean;
  };
  googleMapsUrl: string;
}

interface ShelterMapViewProps {
  language: SupportedLanguage;
  isOnline: boolean;
}

// Preset demonstration locations for testing and GPS fallback
const DEMO_LOCATIONS = [
  { name: '東京都新宿区 (Tokyo Shinjuku)', lat: 35.6895, lon: 139.6917 },
  { name: '東京都渋谷区 (Tokyo Shibuya)', lat: 35.6628, lon: 139.6983 },
  { name: '大阪市中央区 (Osaka Castle)', lat: 34.6873, lon: 135.5262 },
  { name: '福岡市博多区 (Fukuoka Hakata)', lat: 33.5901, lon: 130.4207 },
  { name: '宮城県仙台市 (Sendai Aoba)', lat: 38.2682, lon: 140.8715 }
];

export const ShelterMapView: React.FC<ShelterMapViewProps> = ({
  language,
  isOnline
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.ja;

  // Search parameters
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationSource, setLocationSource] = useState<'gps' | 'preset' | 'manual' | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(3);
  const [disasterType, setDisasterType] = useState<'all' | 'earthquake' | 'tsunami' | 'flood'>('all');
  const [shelters, setShelters] = useState<ShelterResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [selectedShelterId, setSelectedShelterId] = useState<number | null>(null);

  // Manual coordinate inputs
  const [manualLat, setManualLat] = useState<string>('35.6895');
  const [manualLon, setManualLon] = useState<string>('139.6917');
  const [showManualInput, setShowManualInput] = useState<boolean>(false);

  // Map reference
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Client-side Haversine calculation for offline fallback
  const calculateHaversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 100) / 100;
  };

  // Perform search query (via backend API if online, or local calculation if offline)
  const fetchShelters = async (lat: number, lon: number, radius: number, type: string) => {
    setIsLoading(true);

    try {
      if (isOnline) {
        const response = await fetch(
          `/api/shelters?latitude=${lat}&longitude=${lon}&radiusKm=${radius}&disasterType=${type}&language=${language}`
        );
        if (response.ok) {
          const result = await response.json();
          setShelters(result.data || []);
          setIsLoading(false);
          return;
        }
      }
      throw new Error('Using offline shelter dataset fallback');
    } catch {
      // Local calculation fallback
      let filtered = SAMPLE_SHELTERS;
      if (type === 'earthquake') filtered = filtered.filter((s) => s.is_earthquake === 1);
      else if (type === 'tsunami') filtered = filtered.filter((s) => s.is_tsunami === 1);
      else if (type === 'flood') filtered = filtered.filter((s) => s.is_flood === 1);

      const processed: ShelterResult[] = filtered
        .map((s) => {
          const dist = calculateHaversine(lat, lon, s.latitude, s.longitude);
          const walkTime = Math.max(1, Math.round((dist * 1000) / 80));
          return {
            id: s.id,
            name: language === 'en' && s.name_en ? s.name_en : s.name_ja,
            nameJa: s.name_ja,
            nameEn: s.name_en,
            address: s.address,
            latitude: s.latitude,
            longitude: s.longitude,
            distanceKm: dist,
            estimatedWalkingMinutes: walkTime,
            capacity: s.capacity,
            suitableFor: {
              earthquake: s.is_earthquake === 1,
              tsunami: s.is_tsunami === 1,
              flood: s.is_flood === 1
            },
            googleMapsUrl: `https://www.google.com/maps/dir/?api=1&origin=${lat},${lon}&destination=${s.latitude},${s.longitude}&travelmode=walking`
          };
        })
        .filter((s) => s.distanceKm <= radius)
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .slice(0, 10);

      setShelters(processed);
      setIsLoading(false);
    }
  };

  // Request GPS Location with user permission
  const handleRequestGPS = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('お使いのブラウザは位置情報（Geolocation）をサポートしていません。');
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lon: longitude });
        setLocationSource('gps');
        setManualLat(latitude.toFixed(6));
        setManualLon(longitude.toFixed(6));
        fetchShelters(latitude, longitude, radiusKm, disasterType);
      },
      (error) => {
        setIsLoading(false);
        let msg = t.gps_denied;
        if (error.code === error.PERMISSION_DENIED) {
          msg = '位置情報の利用が拒否されました。設定で許可するか、下記のデモ都市を選択してください。';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = '位置情報が検出できませんでした。屋外または電波の良い場所でお試しください。';
        } else if (error.code === error.TIMEOUT) {
          msg = '位置情報のリクエストがタイムアウトしました。';
        }
        setGpsError(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Use preset demo city
  const handleSelectDemo = (demo: { name: string; lat: number; lon: number }) => {
    setGpsError(null);
    setUserLocation({ lat: demo.lat, lon: demo.lon });
    setLocationSource('preset');
    setManualLat(demo.lat.toString());
    setManualLon(demo.lon.toString());
    fetchShelters(demo.lat, demo.lon, radiusKm, disasterType);
  };

  // Manual coordinates search
  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);
    if (isNaN(lat) || lat < -90 || lat > 90) {
      setGpsError('緯度は-90から90の間で入力してください。');
      return;
    }
    if (isNaN(lon) || lon < -180 || lon > 180) {
      setGpsError('経度は-180から180の間で入力してください。');
      return;
    }
    setGpsError(null);
    setUserLocation({ lat, lon });
    setLocationSource('manual');
    fetchShelters(lat, lon, radiusKm, disasterType);
  };

  // Auto-load Shinjuku demo initially so user sees immediate value without blocked prompts
  useEffect(() => {
    if (!userLocation) {
      handleSelectDemo(DEMO_LOCATIONS[0]);
    }
  }, []);

  // Update when radius or disasterType changes
  useEffect(() => {
    if (userLocation) {
      fetchShelters(userLocation.lat, userLocation.lon, radiusKm, disasterType);
    }
  }, [radiusKm, disasterType, language]);

  // Leaflet Map Initialization & Updates
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = userLocation?.lat || 35.6895;
      const initialLon = userLocation?.lon || 139.6917;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLon],
        zoom: 14,
        zoomControl: true
      });

      // OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    // Clear previous markers
    markersGroup.clearLayers();

    // Add user marker
    if (userLocation) {
      const userIcon = L.divIcon({
        className: 'user-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center animate-pulse">
              <div class="w-2.5 h-2.5 rounded-full bg-white"></div>
            </div>
            <div class="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const userMarker = L.marker([userLocation.lat, userLocation.lon], { icon: userIcon })
        .bindPopup(
          `<div class="p-1 font-sans text-xs">
            <strong class="text-blue-600 block mb-0.5">現在地 / Selected Location</strong>
            <span>${userLocation.lat.toFixed(4)}, ${userLocation.lon.toFixed(4)}</span>
          </div>`
        );
      markersGroup.addLayer(userMarker);

      // Add search radius circle
      const radiusCircle = L.circle([userLocation.lat, userLocation.lon], {
        radius: radiusKm * 1000,
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 6'
      });
      markersGroup.addLayer(radiusCircle);
    }

    // Add shelter markers
    shelters.forEach((shelter) => {
      let iconColor = '#10b981'; // green for normal/earthquake
      if (shelter.suitableFor.tsunami) iconColor = '#ef4444'; // red for tsunami
      else if (shelter.suitableFor.flood) iconColor = '#f59e0b'; // amber for flood

      const shelterIcon = L.divIcon({
        className: `shelter-pin-${shelter.id}`,
        html: `
          <div class="flex items-center justify-center cursor-pointer transition-transform hover:scale-125">
            <div class="w-8 h-8 rounded-full shadow-xl flex items-center justify-center text-white font-bold text-xs ring-2 ring-white" style="background-color: ${iconColor};">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
      });

      const marker = L.marker([shelter.latitude, shelter.longitude], { icon: shelterIcon })
        .bindPopup(
          `<div class="p-1 font-sans text-xs max-w-[200px]">
            <strong class="text-slate-900 font-bold block mb-1">${shelter.name}</strong>
            <p class="text-slate-600 mb-1">${shelter.address}</p>
            <div class="flex justify-between text-slate-800 font-semibold mb-2">
              <span>${shelter.distanceKm} km</span>
              <span>約 ${shelter.estimatedWalkingMinutes} 分 (徒歩)</span>
            </div>
            <a href="${shelter.googleMapsUrl}" target="_blank" rel="noopener noreferrer" 
               class="inline-block w-full text-center bg-blue-600 text-white font-bold py-1 px-2 rounded hover:bg-blue-700">
              Googleマップで道案内
            </a>
          </div>`
        );

      marker.on('click', () => {
        setSelectedShelterId(shelter.id);
      });

      markersGroup.addLayer(marker);
    });

    // Fit map bounds to encompass user and nearby shelters
    if (userLocation) {
      if (shelters.length > 0) {
        const bounds = L.latLngBounds([[userLocation.lat, userLocation.lon]]);
        shelters.forEach((s) => bounds.extend([s.latitude, s.longitude]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      } else {
        map.setView([userLocation.lat, userLocation.lon], 14);
      }
    }
  }, [userLocation, shelters, radiusKm]);

  // Handle clicking a shelter card to pan and open popup on the map
  const handleSelectShelter = (shelter: ShelterResult) => {
    setSelectedShelterId(shelter.id);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([shelter.latitude, shelter.longitude], 16, { animate: true });
    }
  };

  return (
    <div className="space-y-5">
      {/* Search Header and Location Permission Controls */}
      <section className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <span>{t.shelter_search_title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {t.shelter_search_desc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* GPS Location Button */}
            <button
              onClick={handleRequestGPS}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 transition active:scale-95 disabled:opacity-50"
            >
              <Navigation className="w-4 h-4" />
              <span>{t.btn_use_current_location}</span>
            </button>

            {/* Manual Coords Toggle */}
            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
            >
              <Compass className="w-4 h-4 text-slate-400" />
              <span>{t.manual_coords_btn}</span>
            </button>
          </div>
        </div>

        {/* GPS Error or Explanation Banner */}
        {gpsError && (
          <div className="mt-4 p-3 rounded-xl bg-amber-950/60 border border-amber-600/50 text-xs text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{gpsError}</p>
              <p className="mt-0.5 text-amber-300/80">
                {t.gps_denied}
              </p>
            </div>
          </div>
        )}

        {/* Demo Location Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            {t.demo_locations_label}:
          </span>
          {DEMO_LOCATIONS.map((demo) => {
            const isSelected =
              userLocation?.lat === demo.lat && userLocation?.lon === demo.lon;
            return (
              <button
                key={demo.name}
                onClick={() => handleSelectDemo(demo)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isSelected
                    ? 'bg-blue-600/30 text-blue-300 border border-blue-500'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
              >
                {demo.name}
              </button>
            );
          })}
        </div>

        {/* Manual Latitude & Longitude Form */}
        {showManualInput && (
          <form onSubmit={handleManualSearch} className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <label htmlFor="manual-lat-input" className="text-slate-400 font-medium">緯度 (Lat):</label>
              <input
                id="manual-lat-input"
                type="number"
                step="0.0001"
                min="-90"
                max="90"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                className="w-28 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono"
                required
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <label htmlFor="manual-lon-input" className="text-slate-400 font-medium">経度 (Lon):</label>
              <input
                id="manual-lon-input"
                type="number"
                step="0.0001"
                min="-180"
                max="180"
                value={manualLon}
                onChange={(e) => setManualLon(e.target.value)}
                className="w-28 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
            >
              {t.search_run_btn}
            </button>
          </form>
        )}

        {/* Filters: Disaster Type and Radius */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Disaster Type Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              {t.disaster_filter_label}:
            </span>
            <button
              onClick={() => setDisasterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                disasterType === 'all'
                  ? 'bg-slate-100 text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {t.all_disasters}
            </button>

            <button
              onClick={() => setDisasterType('earthquake')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                disasterType === 'earthquake'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              {t.earthquake_only}
            </button>

            <button
              onClick={() => setDisasterType('tsunami')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                disasterType === 'tsunami'
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              {t.tsunami_only}
            </button>

            <button
              onClick={() => setDisasterType('flood')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                disasterType === 'flood'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              {t.flood_only}
            </button>
          </div>

          {/* Search Radius Selector */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label htmlFor="shelter-radius-input" className="text-xs font-semibold text-slate-400 whitespace-nowrap">
              {t.radius_label}: <strong className="text-white font-mono">{radiusKm} km</strong>
            </label>
            <input
              id="shelter-radius-input"
              type="range"
              min="1"
              max="20"
              step="1"
              value={radiusKm}
              onChange={(e) => setRadiusKm(parseInt(e.target.value, 10))}
              className="w-full md:w-36 accent-blue-500 cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* Main Grid: Map View (Left/Top) & Shelter Cards List (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Map Container */}
        <div className="lg:col-span-7 flex flex-col space-y-2">
          <div className="relative w-full h-[400px] sm:h-[500px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl bg-slate-950">
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* Offline tile limitation banner over map if offline */}
            {!isOnline && (
              <div className="absolute top-3 left-3 right-3 z-20 p-2.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-amber-500/50 text-amber-200 text-xs shadow-lg flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  {t.offline_banner}
                </span>
              </div>
            )}

            {/* Current coordinates overlay */}
            {userLocation && (
              <div className="absolute bottom-3 left-3 z-20 px-2.5 py-1 rounded-lg bg-slate-900/90 text-[11px] font-mono text-slate-300 border border-slate-700 shadow backdrop-blur-sm">
                Lat/Lon: {userLocation.lat.toFixed(4)}, {userLocation.lon.toFixed(4)} ({locationSource})
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400 italic">
            {t.sample_data_warning}
          </p>
        </div>

        {/* Shelters List View */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{t.search_results_title} ({shelters.length} {t.results_unit})</span>
              {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />}
            </h3>
            <span className="text-[11px] text-slate-400">
              {t.walk_speed_note}
            </span>
          </div>

          {shelters.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400">
              <MapPin className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="font-semibold text-sm">{t.no_shelters_found}</p>
              <p className="text-xs text-slate-500 mt-1">
                {t.no_shelters_hint}
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {shelters.map((shelter) => {
                const isSelected = selectedShelterId === shelter.id;
                return (
                  <div
                    key={shelter.id}
                    onClick={() => handleSelectShelter(shelter)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-white leading-snug">
                          {shelter.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {shelter.address}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-extrabold text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30 whitespace-nowrap">
                        {shelter.distanceKm} km
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                      <div className="flex items-center gap-1 text-amber-300 font-semibold">
                        <Footprints className="w-3.5 h-3.5" />
                        <span>徒歩約 {shelter.estimatedWalkingMinutes} 分</span>
                      </div>

                      {shelter.capacity && (
                        <div className="flex items-center gap-1 text-slate-400">
                          <Users className="w-3.5 h-3.5" />
                          <span>定員 {shelter.capacity.toLocaleString()} {t.person_unit}</span>
                        </div>
                      )}
                    </div>

                    {/* Suitability Badges */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {shelter.suitableFor.earthquake && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                            地震
                          </span>
                        )}
                        {shelter.suitableFor.tsunami && (
                          <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30">
                            津波避難ビル
                          </span>
                        )}
                        {shelter.suitableFor.flood && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                            洪水・高潮
                          </span>
                        )}
                      </div>

                      <a
                        href={shelter.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition"
                      >
                        <span>案内</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
