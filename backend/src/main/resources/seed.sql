-- SafeGuard Japan - Seed Data
-- NOTICE: All shelter records below are development/test sample data for demonstration.
-- Always verify actual emergency evacuation sites with your local Japanese municipality.

-- Seed Phrases for Safety Confirmation and Disaster Guidance
INSERT INTO phrases (id, category, text_ja, text_en, text_bn, text_vi, sort_order) VALUES
(1, 'safety_status', '私は無事です。怪我はありません。', 'I am safe. No injuries.', 'আমি নিরাপদ আছি। কোনো আঘাত নেই।', 'Tôi an toàn. Không bị thương.', 1),
(2, 'safety_status', '現在、避難所へ移動・避難しています。', 'I am currently evacuating to a shelter.', 'আমি এখন আশ্রয়কেন্দ্রে সরিয়ে যাচ্ছি।', 'Tôi đang sơ tán đến nơi trú ẩn an toàn.', 2),
(3, 'safety_status', '救援や手助けが必要です。', 'I need assistance / emergency help.', 'আমার সাহায্য বা উদ্ধার সহায়তা প্রয়োজন।', 'Tôi cần hỗ trợ / cứu hộ khẩn cấp.', 3),
(4, 'safety_status', '可能になり次第、連絡してください。', 'Please contact me when possible.', 'সম্ভব হলে আমার সাথে যোগাযোগ করুন।', 'Xin hãy liên lạc với tôi khi có thể.', 4),
(10, 'emergency_actions', 'まず頭部を守り、机の下などに隠れてください。揺れが収まるまで慌てて外に飛び出さないでください。', 'Drop, Cover, and Hold On. Protect your head under sturdy furniture. Do not rush outside while shaking.', 'মাথা রক্ষা করুন, মজবুত টেবিলের নিচে আশ্রয় নিন। কম্পন চলাকালীন বাইরে দৌড়াবেন না।', 'Cúi xuống, che chắn đầu dưới bàn vững chắc. Giữ chặt cho đến khi rung lắc dừng lại, không hoảng loạn chạy ra ngoài.', 10),
(11, 'emergency_actions', '津波警報発令中。海岸や河口から直ちに離れ、高台または津波避難ビルの3階以上に避難してください。', 'Tsunami Warning in effect! Immediately leave coastal areas and move to high ground or upper floors (3F+) of reinforced buildings.', 'সুনামি সতর্কতা জারি! সাথে সাথে উপকূলীয় এলাকা ছেড়ে উঁচু স্থানে অথবা শক্ত ভবনের ৩য় তলায় যান।', 'Cảnh báo sóng thần! Lập tức rời xa vùng ven biển và bờ sông, di chuyển lên vùng đất cao hoặc tầng 3 trở lên.', 11),
(12, 'emergency_actions', '大雨・河川氾濫の恐れがあります。低い土地や川から離れ、頑丈な建物の2階以上に垂直避難してください。', 'Heavy rain/flood danger. Move away from rivers and lowlands. Seek vertical evacuation to 2nd floor or higher.', 'ভারী বৃষ্টি ও বন্যার ঝুঁকি। নদী ও নিচু জায়গা থেকে দূরে থাকুন। উঁচু ভবনে উল্লম্বভাবে আশ্রয় নিন।', 'Nguy cơ mưa lớn và ngập lụt. Tránh xa các vùng trũng và bờ sông, sơ tán lên tầng 2 trở lên.', 12),
(20, 'disaster_types', '地震', 'Earthquake', 'ভূমিকম্প', 'Động đất', 20),
(21, 'disaster_types', '津波', 'Tsunami', 'সুনামি', 'Sóng thần', 21),
(22, 'disaster_types', '洪水・浸水', 'Flood / Inundation', 'বন্যা / জলমগ্নতা', 'Lũ lụt / Ngập úng', 22);

-- Seed Sample Shelters (Tokyo, Osaka, Fukuoka, Sendai)
INSERT INTO shelters (id, name_ja, name_en, address, latitude, longitude, is_earthquake, is_tsunami, is_flood, capacity) VALUES
(1, '新宿区立新宿中央公園（広域避難場所）', 'Shinjuku Chuo Park (Regional Evacuation Area)', '東京都新宿区西新宿2-11', 35.6895000, 139.6917000, 1, 0, 0, 12000),
(2, '東京都庁 第一本庁舎 防災救護拠点', 'Tokyo Metropolitan Government Bldg 1 Disaster Station', '東京都新宿区西新宿2-8-1', 35.6896000, 139.6922000, 1, 0, 1, 3500),
(3, '代々木公園（広域避難場所）', 'Yoyogi Park (Wide-Area Evacuation Ground)', '東京都渋谷区代々木神園町2-1', 35.6717000, 139.6949000, 1, 0, 1, 25000),
(4, '渋谷区立神南小学校 避難所', 'Jinnan Elementary School Evacuation Shelter', '東京都渋谷区宇田川町5-1', 35.6628000, 139.6983000, 1, 0, 1, 850),
(5, '日比谷公園 防災指定広場', 'Hibiya Park Disaster Emergency Plaza', '東京都千代田区日比谷公園1-6', 35.6738000, 139.7562000, 1, 0, 0, 8000),
(6, '江東区立深川公園 津波・高潮緊急避難ビル', 'Fukagawa Park Tsunami/High-Tide Emergency Tower', '東京都江東区富岡1-14', 35.6715000, 139.7995000, 1, 1, 1, 1200),
(7, '上野恩賜公園 避難地区', 'Ueno Onshi Park Wide-Area Evacuation Site', '東京都台東区上野公園・池之端3丁目', 35.7140000, 139.7741000, 1, 0, 1, 30000),
(8, '品川区立八潮中学校 津波避難ビル', 'Yashio Junior High Tsunami Shelter', '東京都品川区八潮5-11-2', 35.6025000, 139.7548000, 1, 1, 1, 900),
(9, '豊洲シビックセンター 高層避難施設', 'Toyosu Civic Center High-Rise Flood & Tsunami Shelter', '東京都江東区豊洲2-2-18', 35.6548000, 139.7967000, 1, 1, 1, 1500),
(10, '明治神宮外苑 防災広場', 'Meiji Jingu Gaien Emergency Open Space', '東京都新宿区霞ヶ丘町1-1', 35.6775000, 139.7185000, 1, 0, 0, 18000),
(11, '大阪城公園（広域避難場所）', 'Osaka Castle Park (Wide-Area Evacuation Ground)', '大阪府大阪市中央区大阪城1-1', 34.6873000, 135.5262000, 1, 0, 1, 40000),
(12, 'グランフロント大阪 防災一時滞在施設', 'Grand Front Osaka Emergency Temporary Shelter', '大阪府大阪市北区大深町4-20', 34.7042000, 135.4950000, 1, 0, 1, 2000),
(13, '大阪市難波中学校 指定避難所', 'Nanba Junior High School Evacuation Shelter', '大阪府大阪市浪速区塩草1-4-26', 34.6621000, 135.4925000, 1, 1, 1, 750),
(14, '港区民センター 津波避難ビル', 'Minato Ward Citizens Center Tsunami Refuge Building', '大阪府大阪市港区弁天2-1-5', 34.6698000, 135.4619000, 1, 1, 1, 1100),
(15, '天王寺公園 防災広場', 'Tennoji Park Disaster Relief Open Area', '大阪府大阪市天王寺区茶臼山町1-108', 34.6504000, 135.5115000, 1, 0, 0, 15000),
(16, '大濠公園（広域避難場所）', 'Ohori Park Regional Evacuation Ground', '福岡県福岡市中央区大濠公園1-2', 33.5858000, 130.3762000, 1, 0, 0, 22000),
(17, '博多駅前広場 一時滞在施設', 'Hakata Station Plaza Temporary Shelter', '福岡県福岡市博多区博多駅中央街1-1', 33.5901000, 130.4207000, 1, 0, 1, 3000),
(18, '福岡市総合体育館 津波避難拠点', 'Fukuoka City General Gymnasium Tsunami Shelter', '福岡県福岡市東区香椎照葉6-1-1', 33.6661000, 130.4172000, 1, 1, 1, 2500),
(19, '勾当台公園（広域避難場所）', 'Kotodai Park Wide-Area Evacuation Ground', '宮城県仙台市青葉区本町3-9-2', 38.2682000, 140.8715000, 1, 0, 0, 14000),
(20, '仙台港中央公園 津波避難マウンド施設', 'Sendai Port Central Park Tsunami Evacuation Mound', '宮城県仙台市宮城野区港2-1', 38.2755000, 141.0112000, 1, 1, 1, 1800);
