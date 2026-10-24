export interface ShelterRecord {
  id: number;
  name_ja: string;
  name_en: string | null;
  address: string;
  latitude: number;
  longitude: number;
  is_earthquake: number; // 1 or 0
  is_tsunami: number;    // 1 or 0
  is_flood: number;      // 1 or 0
  capacity: number | null;
}

// Development & demonstration sample data for Tokyo, Osaka, Sendai, and Fukuoka metropolitan areas
// Clearly labeled as sample data per disaster management guidelines
export const SAMPLE_SHELTERS: ShelterRecord[] = [
  // --- Tokyo Area (around Shinjuku / Shibuya / Chiyoda / Koto) ---
  {
    id: 1,
    name_ja: '新宿区立新宿中央公園（広域避難場所）',
    name_en: 'Shinjuku Chuo Park (Regional Evacuation Area)',
    address: '東京都新宿区西新宿2-11',
    latitude: 35.6895,
    longitude: 139.6917,
    is_earthquake: 1,
    is_tsunami: 0,
    is_flood: 0,
    capacity: 12000
  },
  {
    id: 2,
    name_ja: '東京都庁 第一本庁舎 防災救護拠点',
    name_en: 'Tokyo Metropolitan Government Bldg 1 Disaster Station',
    address: '東京都新宿区西新宿2-8-1',
    latitude: 35.6896,
    longitude: 139.6922,
    is_earthquake: 1,
    is_tsunami: 0,
    is_flood: 1,
    capacity: 3500
  },
  {
    id: 3,
    name_ja: '代々木公園（広域避難場所）',
    name_en: 'Yoyogi Park (Wide-Area Evacuation Ground)',
    address: '東京都渋谷区代々木神園町2-1',
    latitude: 35.6717,
    longitude: 139.6949,
    is_earthquake: 1,
    is_tsunami: 0,
    is_flood: 1,
    capacity: 25000
  },
  {
    id: 4,
    name_ja: '渋谷区立神南小学校 避難所',
    name_en: 'Jinnan Elementary School Evacuation Shelter',
    address: '東京都渋谷区宇田川町5-1',
    latitude: 35.6628,
    longitude: 139.6983,
    is_earthquake: 1,
    is_tsunami: 0,
    is_flood: 1,
    capacity: 850
  },
  {
    id: 5,
    name_ja: '日比谷公園 防災指定広場',
    name_en: 'Hibiya Park Disaster Emergency Plaza',
    address: '東京都千代田区日比谷公園1-6',
    latitude: 35.6738,
    longitude: 139.7562,
    is_earthquake: 1,
    is_tsunami: 0,
    is_flood: 0,
    capacity: 8000
  },
  {
    id: 6,
    name_ja: '江東区立深川公園 津波・高潮緊急避難ビル',
    name_en: 'Fukagawa Park Tsunami/High-Tide Emergency Tower',
    address: '東京都江東区富岡1-14',
    latitude: 35.6715,
    longitude: 139.7995,
    is_earthquake: 1,
    is_tsunami: 1,
    is_flood: 1,
    capacity: 1200
  },
  {
    id: 7,
    name_ja: '上野恩賜公園 避難地区',
    name_en: 'Ueno Onshi Park Wide-Area Evacuation Site',
    address: '東京都台東区上野公園・池之端3丁目',
    latitude: 35.7140,
    longitude: 139.7741,
    is_earthquake: 1,
    is_tsunami: 0,
    is_flood: 1,
    capacity: 30000
  },
  {
    id: 8,
    name_ja: '品川区立八潮中学校 津波避難ビル',
    name_en: 'Yashio Junior High Tsunami Shelter',
    address: '東京都品川区八潮5-11-2',
    latitude: 35.6025,
    longitude: 139.7548,
    is_earthquake: 1,
    is_tsunami: 1,
    is_flood: 1,
    capacity: 900
  },
  {
    id: 9,
    name_ja: '豊洲シビックセンター 高層避難施設',
    name_en: 'Toyosu Civic Center High-Rise Flood & Tsunami Shelter',
    address: '東京都江東区豊洲2-2-18',
    latitude: 35.6548,
    longitude: 139.7967,
    is_earthquake: 1,
    is_tsunami: 1,
    is_flood: 1,
    capacity: 1500
  },
  {
    id: 10,
    name_ja: '明治神宮外苑 防災広場',
    name_en: 'Meiji Jingu Gaien Emergency Open Space',
    address: '東京都新宿区霞ヶ丘町1-1',
    latitude: 35.6775,
    longitude: 139.7185,
    is_earthquake: 1,
    is_tsunami: 0,
    is_flood: 0,
    capacity: 18000
  },

  // --- Osaka Area (around Osaka Station / Namba / Bay Area) ---
  {
    id: 11,
    name_ja: '大阪城公園（広域避難場所）',
    name_en: 'Osaka Castle Park (Wide-Area Evacuation Ground)',
    address: '大阪府大阪市中央区大阪城1-1',
    latitude: 34.6873,
    longitude: 135.5262,
    is_earthquake: 1,
    is_tsunami: 0,
    is_flood: 1,
    capacity: 40000
  },
  {
    id: 12,
    name_ja: 'グランフロント大阪 防災一時滞在施設',
    name_en: 'Grand Front Osaka Emergency Temporary Shelter',
    address: '大阪府大阪市北区大深町4-20',
    latitude: 34.7042,
    longitude: 135.4950,
    is_earthquake: 1,
    is_tsunami: 0,
    is_flood: 1,
    capacity: 2000
  },
  {
    id: 13,
    name_ja: '大阪市難波中学校 指定避難所',
    name_en: 'Nanba Junior High School Evacuation Shelter',
    address: '大阪府大阪市浪速区塩草1-4-26',
    latitude: 34.6621,
    longitude: 135.4925,
    is_earthquake: 1,
    is_tsunami: 1,
    is_flood: 1,
    capacity: 750
  },
  {
    id: 14,
    name_ja: '港区民センター 津波避難ビル',
    name_en: 'Minato Ward Citizens Center Tsunami Refuge Building',
    address: '大阪府大阪市港区弁天2-1-5',
    latitude: 34.6698,
    longitude: 135.4619,
    is_earthquake: 1,
    is_tsunami: 1,
    is_flood: 1,
    capacity: 1100
  },
  {
    id: 15,
    name_ja: '天王寺公園 防災広場',
    name_en: 'Tennoji Park Disaster Relief Open Area',
    address: '大阪府大阪市天王寺区茶臼山町1-108',
    latitude: 34.6504,
    longitude: 135.5115,
    is_earthquake: 1,
    is_tsunami: 0,
    is_flood: 0,
    capacity: 15000
  },

  // --- Fukuoka Area (Hakata / Tenjin) ---
  {
    id: 16,
    name_ja: '大濠公園（広域避難場所）',
    name_en: 'Ohori Park Regional Evacuation Ground',
    address: '福岡県福岡市中央区大濠公園1-2',
    latitude: 33.5858,
    longitude: 130.3762,
    is_earthquake: 1,
    is_tsunami: 0,
    is_flood: 0,
    capacity: 22000
  },
  {
    id: 17,
    name_ja: '博多駅前広場 一時滞在施設',
    name_en: 'Hakata Station Plaza Temporary Shelter',
    address: '福岡県福岡市博多区博多駅中央街1-1',
    latitude: 33.5901,
    longitude: 130.4207,
    is_earthquake: 1,
    is_tsunami: 0,
    is_flood: 1,
    capacity: 3000
  },
  {
    id: 18,
    name_ja: '福岡市総合体育館 津波避難拠点',
    name_en: 'Fukuoka City General Gymnasium Tsunami Shelter',
    address: '福岡県福岡市東区香椎照葉6-1-1',
    latitude: 33.6661,
    longitude: 130.4172,
    is_earthquake: 1,
    is_tsunami: 1,
    is_flood: 1,
    capacity: 2500
  },

  // --- Sendai Area (Aoba / Miyagi) ---
  {
    id: 19,
    name_ja: '勾当台公園（広域避難場所）',
    name_en: 'Kotodai Park Wide-Area Evacuation Ground',
    address: '宮城県仙台市青葉区本町3-9-2',
    latitude: 38.2682,
    longitude: 140.8715,
    is_earthquake: 1,
    is_tsunami: 0,
    is_flood: 0,
    capacity: 14000
  },
  {
    id: 20,
    name_ja: '仙台港中央公園 津波避難マウンド施設',
    name_en: 'Sendai Port Central Park Tsunami Evacuation Mound',
    address: '宮城県仙台市宮城野区港2-1',
    latitude: 38.2755,
    longitude: 141.0112,
    is_earthquake: 1,
    is_tsunami: 1,
    is_flood: 1,
    capacity: 1800
  }
];
