USE ai_test;

CREATE TABLE IF NOT EXISTS languages (
  id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(16) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  native_name VARCHAR(100),
  script VARCHAR(80),
  direction ENUM('ltr','rtl') NOT NULL DEFAULT 'ltr',
  enabled BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS dictionary_entries (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  language_id SMALLINT UNSIGNED NOT NULL,
  lemma VARCHAR(512) NOT NULL,
  normalized_lemma VARCHAR(512) NOT NULL,
  part_of_speech VARCHAR(80),
  pronunciation VARCHAR(512),
  definition TEXT,
  etymology TEXT,
  source VARCHAR(120) NOT NULL DEFAULT 'wiktionary',
  source_id VARCHAR(255),
  metadata JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE,
  INDEX idx_dictionary_lookup (language_id, normalized_lemma),
  FULLTEXT INDEX ft_dictionary_text (lemma, definition)
);

CREATE TABLE IF NOT EXISTS dictionary_translations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entry_id BIGINT UNSIGNED NOT NULL,
  target_language_id SMALLINT UNSIGNED NOT NULL,
  translation VARCHAR(512) NOT NULL,
  notes TEXT,
  FOREIGN KEY (entry_id) REFERENCES dictionary_entries(id) ON DELETE CASCADE,
  FOREIGN KEY (target_language_id) REFERENCES languages(id) ON DELETE CASCADE,
  INDEX idx_translation_target (target_language_id, translation)
);

CREATE TABLE IF NOT EXISTS dictionary_examples (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entry_id BIGINT UNSIGNED NOT NULL,
  example_text TEXT NOT NULL,
  translation TEXT,
  source VARCHAR(255),
  FOREIGN KEY (entry_id) REFERENCES dictionary_entries(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dictionary_imports (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  source_name VARCHAR(120) NOT NULL,
  source_url VARCHAR(1024),
  source_version VARCHAR(120),
  language_code VARCHAR(16),
  file_name VARCHAR(512),
  status ENUM('queued','running','completed','failed') NOT NULL DEFAULT 'queued',
  records_read BIGINT UNSIGNED NOT NULL DEFAULT 0,
  records_written BIGINT UNSIGNED NOT NULL DEFAULT 0,
  error_message TEXT,
  started_at DATETIME NULL,
  completed_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
