import React, { useState } from 'react';
import {
  X,
  Database,
  Server,
  FileCode,
  ShieldCheck,
  CheckCircle,
  Copy,
  Terminal,
  Cpu
} from 'lucide-react';

interface BackendDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendDocsModal: React.FC<BackendDocsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'schema' | 'mybatis' | 'tests'>('architecture');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6 backdrop-blur-md">
      <div className="relative w-full max-w-5xl h-[88vh] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>SafeGuard Japan — Spring Boot 3 & MariaDB Architecture</span>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  Java 17 / MyBatis
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Backend specification, read-only database design, caching, and unit test suites
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-800 bg-slate-950/50 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'architecture'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Architecture & Specs</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'schema'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>MariaDB Schema & Seed</span>
          </button>

          <button
            onClick={() => setActiveTab('mybatis')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'mybatis'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>MyBatis Mappers & Security</span>
          </button>

          <button
            onClick={() => setActiveTab('tests')}
            className={`pb-3 px-3 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tests'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>JUnit 5 Tests & Validation</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {activeTab === 'architecture' && (
            <div className="space-y-5 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-blue-400 font-bold block mb-1">
                    FRAMEWORK & RUNTIME
                  </span>
                  <p className="font-semibold text-white">Java 17 LTS</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Spring Boot 3.2.3, Spring MVC REST, Thymeleaf, Spring Validation (JSR-380).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-emerald-400 font-bold block mb-1">
                    PERSISTENCE & SECURITY
                  </span>
                  <p className="font-semibold text-white">MariaDB & MyBatis 3.0</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Read-only user permissions, parameterized #{} SQL, zero user tracking or account tables.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-xs text-amber-400 font-bold block mb-1">
                    EXTERNAL INTEGRATION
                  </span>
                  <p className="font-semibold text-white">JMA Open Data + Caffeine</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Spring RestClient with 3-sec connection timeout and 60-second Caffeine cache.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white mb-2">Package Structure (`com.safeguardjapan`)</h4>
                <ul className="text-xs font-mono space-y-1.5 text-slate-300">
                  <li>📁 controller: HomeController, AlertController, ShelterController, SafetyController</li>
                  <li>📁 service: AlertService, ShelterService, PhraseService</li>
                  <li>📁 client: JmaClient (Spring RestClient with 3s timeout)</li>
                  <li>📁 mapper: ShelterMapper, PhraseMapper (MyBatis parameterized queries)</li>
                  <li>📁 model: Shelter, Phrase, AlertInfo (DTO), ShelterSearchForm (Validation)</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="font-bold text-white mb-2">REST Endpoints Implemented</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded bg-slate-900 flex items-center justify-between">
                    <span className="font-mono text-emerald-400 font-bold">GET /api/alert?language=ja|en|bn|vi</span>
                    <span className="text-slate-400">JMA live quake & alert with 60s Caffeine cache</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 flex items-center justify-between">
                    <span className="font-mono text-emerald-400 font-bold">GET /api/shelters?latitude=...&longitude=...&radiusKm=...&disasterType=...</span>
                    <span className="text-slate-400">Haversine distance, 80m/min walk time, top 10 shelters</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  File: /backend/src/main/resources/schema.sql & seed.sql
                </span>
                <button
                  onClick={() =>
                    copyCode(
                      `CREATE TABLE shelters (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  name_ja VARCHAR(255) NOT NULL,\n  name_en VARCHAR(255) NULL,\n  address VARCHAR(255) NOT NULL,\n  latitude DECIMAL(10, 7) NOT NULL,\n  longitude DECIMAL(10, 7) NOT NULL,\n  is_earthquake TINYINT(1) NOT NULL DEFAULT 1,\n  is_tsunami TINYINT(1) NOT NULL DEFAULT 0,\n  is_flood TINYINT(1) NOT NULL DEFAULT 0,\n  capacity INT NULL\n);`,
                      'schema'
                    )
                  }
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1"
                >
                  {copiedSnippet === 'schema' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy SQL</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`-- MariaDB Shelters Table
CREATE TABLE shelters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_ja VARCHAR(255) NOT NULL COMMENT 'Japanese shelter name',
    name_en VARCHAR(255) NULL COMMENT 'English shelter name (nullable)',
    address VARCHAR(255) NOT NULL COMMENT 'Shelter address in Japan',
    latitude DECIMAL(10, 7) NOT NULL COMMENT 'Latitude (-90.0 to 90.0)',
    longitude DECIMAL(10, 7) NOT NULL COMMENT 'Longitude (-180.0 to 180.0)',
    is_earthquake TINYINT(1) NOT NULL DEFAULT 1,
    is_tsunami TINYINT(1) NOT NULL DEFAULT 0,
    is_flood TINYINT(1) NOT NULL DEFAULT 0,
    capacity INT NULL,
    INDEX idx_shelter_coords (latitude, longitude),
    INDEX idx_shelter_earthquake (is_earthquake),
    INDEX idx_shelter_tsunami (is_tsunami),
    INDEX idx_shelter_flood (is_flood)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Multilingual Phrases Table (ja, en, bn, vi)
CREATE TABLE phrases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    text_ja TEXT NOT NULL,
    text_en TEXT NOT NULL,
    text_bn TEXT NOT NULL,
    text_vi TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    INDEX idx_phrase_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`}
              </pre>
            </div>
          )}

          {activeTab === 'mybatis' && (
            <div className="space-y-4">
              <span className="text-xs text-slate-400 font-mono">
                File: /backend/src/main/java/com/safeguardjapan/mapper/ShelterMapper.java
              </span>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`@Mapper
public interface ShelterMapper {

    /**
     * Parameterized read-only candidate query.
     * Prevents SQL injection via MyBatis #{} bindings.
     */
    @Select("<script>" +
            "SELECT id, name_ja, name_en, address, latitude, longitude, " +
            "is_earthquake, is_tsunami, is_flood, capacity " +
            "FROM shelters " +
            "WHERE 1=1 " +
            "<if test=\\"disasterType == 'earthquake'\\"> AND is_earthquake = 1 </if>" +
            "<if test=\\"disasterType == 'tsunami'\\"> AND is_tsunami = 1 </if>" +
            "<if test=\\"disasterType == 'flood'\\"> AND is_flood = 1 </if>" +
            "</script>")
    List<Shelter> findCandidateShelters(@Param("disasterType") String disasterType);
}`}
              </pre>
            </div>
          )}

          {activeTab === 'tests' && (
            <div className="space-y-4">
              <span className="text-xs text-slate-400 font-mono">
                File: /backend/src/test/java/com/safeguardjapan/service/ShelterServiceTest.java
              </span>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
{`@Test
@DisplayName("Should accurately calculate Haversine distance between Tokyo station and Shinjuku")
void testHaversineDistanceCalculation() {
    // Tokyo Station (35.681236, 139.767125) to Shinjuku Station (35.689606, 139.700571) ~ 6.09 km
    double distance = shelterService.calculateHaversineDistance(35.681236, 139.767125, 35.689606, 139.700571);
    assertThat(distance).isCloseTo(6.09, offset(0.2));
}

@Test
@DisplayName("Should estimate walking time at 80 meters per minute")
void testWalkingTimeEstimation() {
    // 0.8 km = 800m -> 800 / 80 = 10 minutes
    int minutes = shelterService.estimateWalkingTimeMinutes(0.8);
    assertThat(minutes).isEqualTo(10);
}`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
