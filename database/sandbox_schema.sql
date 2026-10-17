CREATE DATABASE IF NOT EXISTS ai_test;
USE ai_test;

CREATE TABLE IF NOT EXISTS sandbox_environments (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  parent_id CHAR(36) NULL,
  status ENUM('creating','ready','running','stopped','failed','destroyed') NOT NULL DEFAULT 'creating',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sandbox_parent (parent_id),
  INDEX idx_sandbox_status (status),
  CONSTRAINT fk_sandbox_parent FOREIGN KEY (parent_id) REFERENCES sandbox_environments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS virtual_environments (
  id CHAR(36) PRIMARY KEY,
  sandbox_id CHAR(36) NOT NULL,
  name VARCHAR(128) NOT NULL,
  runtime VARCHAR(32) NOT NULL,
  image VARCHAR(255) NOT NULL,
  workdir VARCHAR(255) NOT NULL,
  environment_json JSON NOT NULL,
  cpu_cores DECIMAL(4,2) NOT NULL DEFAULT 1,
  memory_mb INT UNSIGNED NOT NULL DEFAULT 512,
  disk_mb INT UNSIGNED NOT NULL DEFAULT 1024,
  timeout_ms INT UNSIGNED NOT NULL DEFAULT 30000,
  max_processes INT UNSIGNED NOT NULL DEFAULT 16,
  network_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_virtual_sandbox (sandbox_id),
  CONSTRAINT fk_virtual_sandbox FOREIGN KEY (sandbox_id) REFERENCES sandbox_environments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sandbox_executions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sandbox_id CHAR(36) NOT NULL,
  virtual_environment_id CHAR(36) NOT NULL,
  command_text TEXT NOT NULL,
  args_json JSON NULL,
  exit_code INT NULL,
  stdout MEDIUMTEXT NULL,
  stderr MEDIUMTEXT NULL,
  duration_ms BIGINT UNSIGNED NULL,
  timed_out BOOLEAN NOT NULL DEFAULT FALSE,
  success BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_execution_sandbox_created (sandbox_id, created_at),
  CONSTRAINT fk_execution_sandbox FOREIGN KEY (sandbox_id) REFERENCES sandbox_environments(id) ON DELETE CASCADE,
  CONSTRAINT fk_execution_virtual FOREIGN KEY (virtual_environment_id) REFERENCES virtual_environments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sandbox_audit_log (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sandbox_id CHAR(36) NULL,
  user_id CHAR(36) NULL,
  action VARCHAR(64) NOT NULL,
  details_json JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sandbox_audit (sandbox_id, created_at),
  INDEX idx_sandbox_user (user_id, created_at)
);
