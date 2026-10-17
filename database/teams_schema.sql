CREATE TABLE IF NOT EXISTS agent_teams (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NULL,
  strategy ENUM('sequential','parallel','debate','hierarchical','consensus') NOT NULL DEFAULT 'hierarchical',
  max_concurrency INT NOT NULL DEFAULT 4,
  require_review BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS agent_team_members (
  id VARCHAR(64) PRIMARY KEY,
  team_id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  agent_id VARCHAR(255) NOT NULL,
  role ENUM('lead','planner','researcher','coder','reviewer','tester','tool','custom') NOT NULL,
  instructions TEXT NULL,
  status ENUM('idle','working','blocked','completed','failed') NOT NULL DEFAULT 'idle',
  capabilities JSON NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_team_member_team FOREIGN KEY (team_id) REFERENCES agent_teams(id) ON DELETE CASCADE,
  INDEX idx_team_members_team (team_id)
);

CREATE TABLE IF NOT EXISTS agent_team_tasks (
  id VARCHAR(64) PRIMARY KEY,
  team_id VARCHAR(64) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  dependencies JSON NOT NULL,
  assigned_member_id VARCHAR(64) NULL,
  status ENUM('queued','running','review','completed','failed') NOT NULL DEFAULT 'queued',
  result JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_team_task_team FOREIGN KEY (team_id) REFERENCES agent_teams(id) ON DELETE CASCADE,
  CONSTRAINT fk_team_task_member FOREIGN KEY (assigned_member_id) REFERENCES agent_team_members(id) ON DELETE SET NULL,
  INDEX idx_team_tasks_team_status (team_id, status)
);

CREATE TABLE IF NOT EXISTS agent_team_runs (
  id VARCHAR(64) PRIMARY KEY,
  team_id VARCHAR(64) NOT NULL,
  objective TEXT NOT NULL,
  task_ids JSON NOT NULL,
  status ENUM('planning','running','review','completed','failed') NOT NULL DEFAULT 'planning',
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  CONSTRAINT fk_team_run_team FOREIGN KEY (team_id) REFERENCES agent_teams(id) ON DELETE CASCADE,
  INDEX idx_team_runs_team_status (team_id, status)
);
