# SafeGuard Japan (セーフガード・ジャパン)

SafeGuard Japan is a production-grade, multilingual disaster preparedness and emergency assistance web application designed for residents and international visitors living in or traveling across Japan.

It bridges the language barrier during critical emergency events by providing real-time disaster alerts from the Japan Meteorological Agency (JMA), GPS-enabled evacuation shelter search filtered by disaster type (Earthquake, Tsunami, Flood), and a privacy-preserving safety confirmation message generator that operates completely on the user's device with offline PWA support.

---

## 1. Key Features

- **Real-Time JMA Disaster Alerts (`GET /api/alert`)**:
  - Live ingestion from official Japan Meteorological Agency (JMA) feeds.
  - Safe parsing of earthquake intensity (Shindo 震度 1〜7), magnitude, epicenter, and announcement timestamps.
  - 60-second caching (Spring Cache with Caffeine / Express in-memory cache) with 3-second connection timeout and safe fallback to baseline or cached data.
  - Clear distinction between live announcements and cached records; never presents stale data as current.

- **Evacuation Shelter Map & GPS Locator (`GET /api/shelters`)**:
  - Interactive Leaflet.js map with OpenStreetMap tiles.
  - GPS-based search with explicit permission prompt.
  - Graceful fallback when GPS is denied or unavailable: manual coordinate entry and demonstration city presets (Tokyo Shinjuku, Shibuya, Osaka Castle, Fukuoka Hakata, Sendai Aoba).
  - Disaster suitability filtering:
    - **Earthquake** (耐震避難場所 / Designated emergency evacuation grounds)
    - **Tsunami** (津波避難ビル / Tsunami evacuation towers)
    - **Flood** (洪水・高潮避難施設 / Elevated vertical evacuation sites)
  - Accurate distance calculation using the Haversine formula.
  - Walking-time estimation based on standard 80 meters per minute (`(distance_km * 1000) / 80`), clearly labeled as an estimate.
  - Direct walking route navigation links to Google Maps.
  - Offline support: cached shelter list remains fully accessible even when map tiles cannot load.

- **Multilingual Support (4 Languages)**:
  - **Japanese (ja)**
  - **English (en)**
  - **Bengali (bn)**
  - **Vietnamese (vi)**
  - Persistent language preference saved in `localStorage`.
  - Automatic fallback to Japanese when a key or unsupported language code is provided.

- **Device-Side Safety Message Generator (`/safety-status`)**:
  - Predefined multilingual status templates ("I am safe", "I am evacuating to a shelter", "I need assistance", "Please contact me when possible").
  - Optional custom note up to 200 characters with live character counter.
  - Optional GPS Google Maps location link (explicit user consent only).
  - Dual-language output (selected language + Japanese) to assist local Japanese first responders and neighbors.
  - Web Share API integration with automatic fallback to clipboard copying.
  - Zero server tracking: messages are never transmitted to or stored on any backend server.

- **Progressive Web App (PWA) & Offline Capabilities**:
  - Web App Manifest (`manifest.json`) compliant with installability standards.
  - In-app install banner with iOS Safari guidance.
  - Service Worker (`sw.js`) pre-caching static assets, offline emergency phrases, and API caching.
  - Visual online/offline status indicators and cached data timestamps.

- **Security & Privacy by Design**:
  - Read-only database access architecture.
  - Parameterized MyBatis queries using `#{}` to eliminate SQL injection risks.
  - Output escaping with Thymeleaf `th:text` preventing XSS vulnerabilities.
  - No user registration, login, or persistent collection of personal data.

---

## 2. Architecture & Directory Structure

```
safeguard-japan/
├── backend/                               # Complete Spring Boot 3 Backend
│   ├── pom.xml                            # Maven build configuration (Java 17)
│   └── src/
│       ├── main/
│       │   ├── java/com/safeguardjapan/
│       │   │   ├── SafeguardJapanApplication.java
│       │   │   ├── client/
│       │   │   │   └── JmaClient.java     # RestClient with 3s timeout
│       │   │   ├── controller/
│       │   │   │   ├── AlertController.java
│       │   │   │   ├── HomeController.java
│       │   │   │   ├── SafetyController.java
│       │   │   │   └── ShelterController.java
│       │   │   ├── mapper/
│       │   │   │   ├── PhraseMapper.java  # MyBatis parameterized SQL
│       │   │   │   └── ShelterMapper.java
│       │   │   ├── model/
│       │   │   │   ├── AlertInfo.java     # Disaster DTO
│       │   │   │   ├── Phrase.java        # Entity
│       │   │   │   ├── Shelter.java       # Entity
│       │   │   │   └── ShelterSearchForm.java # JSR-380 Validation
│       │   │   └── service/
│       │   │       ├── AlertService.java  # 60s Caffeine Cache & Fallback
│       │   │       ├── PhraseService.java
│       │   │       └── ShelterService.java # Haversine & Walking time
│       │   └── resources/
│       │       ├── application.properties
│       │       ├── messages_ja.properties # Multilingual resource bundles
│       │       ├── messages_en.properties
│       │       ├── messages_bn.properties
│       │       ├── messages_vi.properties
│       │       ├── schema.sql             # MariaDB table schema
│       │       ├── seed.sql               # Initial sample data & phrases
│       │       └── templates/             # Thymeleaf templates
│       │           ├── index.html
│       │           ├── alert-info.html
│       │           ├── safety-sent.html
│       │           ├── safety-status.html
│       │           └── shelters.html
│       └── test/java/com/safeguardjapan/
│           ├── model/
│           │   └── ShelterSearchFormTest.java # Validation unit tests
│           └── service/
│               ├── AlertServiceTest.java      # Timeout & language fallback tests
│               └── ShelterServiceTest.java    # Haversine, 80m/min & sorting tests
├── public/
│   ├── icon.svg                           # Brand vector icon
│   ├── manifest.json                      # Web App Manifest
│   └── sw.js                              # PWA Service Worker
├── src/
│   ├── components/
│   │   ├── AlertDetailView.tsx            # JMA alert & Shindo scale guide
│   │   ├── BackendDocsModal.tsx           # Inspectable Spring Boot / DB architecture
│   │   ├── DashboardView.tsx              # Main high-contrast emergency dashboard
│   │   ├── Navbar.tsx                     # Brand, language selector & PWA install
│   │   ├── OfflineBanner.tsx              # Connectivity and cached alert notice
│   │   ├── SafetyStatusView.tsx           # Web Share & clipboard message generator
│   │   └── ShelterMapView.tsx             # Leaflet map with GPS & radius filters
│   ├── data/
│   │   ├── phrases.ts                     # Multilingual dictionaries (ja, en, bn, vi)
│   │   └── shelters.ts                    # Sample shelters matching MariaDB schema
│   ├── hooks/
│   │   └── usePWA.ts                      # Online/offline and PWA install hook
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── server.ts                              # Node.js/Express fullstack server & API
├── package.json
└── tsconfig.json
```

---

## 3. Database Schema (MariaDB)

### `shelters` Table
```sql
CREATE TABLE shelters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_ja VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NULL,
    address VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    is_earthquake TINYINT(1) NOT NULL DEFAULT 1,
    is_tsunami TINYINT(1) NOT NULL DEFAULT 0,
    is_flood TINYINT(1) NOT NULL DEFAULT 0,
    capacity INT NULL,
    INDEX idx_shelter_coords (latitude, longitude),
    INDEX idx_shelter_earthquake (is_earthquake),
    INDEX idx_shelter_tsunami (is_tsunami),
    INDEX idx_shelter_flood (is_flood)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### `phrases` Table
```sql
CREATE TABLE phrases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    text_ja TEXT NOT NULL,
    text_en TEXT NOT NULL,
    text_bn TEXT NOT NULL,
    text_vi TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    INDEX idx_phrase_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

*Note: In production, configure read-only credentials for the application:*
```sql
GRANT SELECT ON safeguard_db.* TO 'safeguard_app'@'%' IDENTIFIED BY 'safeguard_secret_pass';
FLUSH PRIVILEGES;
```

---

## 4. API Endpoints

### 1. `GET /api/alert`
Returns real-time or cached JMA disaster information.
- **Parameters**: `language` (`ja`, `en`, `bn`, `vi`, default: `ja`)
- **Response**:
```json
{
  "status": "success",
  "language": "en",
  "data": {
    "alertType": "earthquake",
    "title": "JMA Seismic Intensity Information",
    "affectedArea": "Chiba-ken Hokuto-bu",
    "intensity": "最大震度 3",
    "magnitude": "M4.2",
    "announcementTime": "2026-10-21T08:45:00+09:00",
    "severity": "advisory",
    "instructions": "Conditions are calm. Review emergency supplies.",
    "source": "Japan Meteorological Agency (JMA)",
    "isCached": false,
    "cachedAt": "2026-10-21T08:50:00.000Z"
  }
}
```

### 2. `GET /api/shelters`
Returns nearby evacuation shelters filtered by radius and disaster type.
- **Parameters**:
  - `latitude`: `-90.0` to `90.0` (required)
  - `longitude`: `-180.0` to `180.0` (required)
  - `radiusKm`: `1` to `20` (optional, default `3`)
  - `disasterType`: `all` | `earthquake` | `tsunami` | `flood` (optional, default `all`)
  - `language`: `ja` | `en` | `bn` | `vi` (optional, default `ja`)
- **Response**:
```json
{
  "status": "success",
  "count": 2,
  "isSampleData": true,
  "data": [
    {
      "id": 1,
      "name": "Shinjuku Chuo Park (Regional Evacuation Area)",
      "address": "東京都新宿区西新宿2-11",
      "latitude": 35.6895,
      "longitude": 139.6917,
      "distanceKm": 0.04,
      "estimatedWalkingMinutes": 1,
      "capacity": 12000,
      "suitableFor": {
        "earthquake": true,
        "tsunami": false,
        "flood": false
      },
      "googleMapsUrl": "https://www.google.com/maps/dir/?api=1&origin=35.6896,139.6922&destination=35.6895,139.6917&travelmode=walking"
    }
  ]
}
```

---

## 5. Local Execution Instructions

### Running the Live Full-Stack App (Express + Vite)
```bash
# 1. Install dependencies
npm install

# 2. Start development server (Port 3000)
npm run dev

# 3. Build for production
npm run build
npm start
```

### Running the Spring Boot Backend (Java 17 & MariaDB)
```bash
# 1. Start MariaDB and seed schema
mysql -u root -p safeguard_db < backend/src/main/resources/schema.sql
mysql -u root -p safeguard_db < backend/src/main/resources/seed.sql

# 2. Run Spring Boot tests
cd backend
mvn test

# 3. Run Spring Boot Application
mvn spring-boot:run
```

---

## 6. External APIs, Limitations & Deployment Settings

1. **JMA Open Data Service**:
   - URL: `https://www.jma.go.jp/bosai/quake/data/list.json`
   - Access: Free public REST feed without API key requirement.
   - Limitation: Rates should be respected. The backend enforces a 60-second in-memory cache to minimize external queries and avoid rate limits.
2. **Geolocation Permissions**:
   - Geolocation requires an HTTPS origin in modern browsers.
   - If GPS permission is denied by the user, manual coordinates or demo city buttons are immediately provided.
3. **OpenStreetMap Tiles**:
   - Tile server: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`.
   - When offline, cached shelter listings and coordinates remain accessible; map tile limitations are explicitly communicated to the user.
