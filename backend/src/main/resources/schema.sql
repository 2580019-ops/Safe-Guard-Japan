-- SafeGuard Japan (セーフガード・ジャパン)
-- MariaDB Database Schema
-- Read-only application user permissions recommended: GRANT SELECT ON safeguard_db.* TO 'safeguard_app'@'%';

DROP TABLE IF EXISTS shelters;
DROP TABLE IF EXISTS phrases;

-- Evacuation Shelters Table
CREATE TABLE shelters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_ja VARCHAR(255) NOT NULL COMMENT 'Japanese shelter name',
    name_en VARCHAR(255) NULL COMMENT 'English shelter name (nullable)',
    address VARCHAR(255) NOT NULL COMMENT 'Shelter address in Japan',
    latitude DECIMAL(10, 7) NOT NULL COMMENT 'Latitude (-90.0 to 90.0)',
    longitude DECIMAL(10, 7) NOT NULL COMMENT 'Longitude (-180.0 to 180.0)',
    is_earthquake TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Designated for earthquake evacuation (1=yes, 0=no)',
    is_tsunami TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Designated for tsunami / coastal surge (1=yes, 0=no)',
    is_flood TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Designated for flood / river overflow (1=yes, 0=no)',
    capacity INT NULL COMMENT 'Estimated sheltering capacity in persons',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_shelter_coords (latitude, longitude),
    INDEX idx_shelter_earthquake (is_earthquake),
    INDEX idx_shelter_tsunami (is_tsunami),
    INDEX idx_shelter_flood (is_flood)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Multilingual Emergency Phrases and Action Guidelines Table
CREATE TABLE phrases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(50) NOT NULL COMMENT 'Category: safety_status, emergency_actions, disaster_types, labels',
    text_ja TEXT NOT NULL COMMENT 'Japanese phrase text',
    text_en TEXT NOT NULL COMMENT 'English phrase text',
    text_bn TEXT NOT NULL COMMENT 'Bengali phrase text',
    text_vi TEXT NOT NULL COMMENT 'Vietnamese phrase text',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_phrase_category (category),
    INDEX idx_phrase_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
