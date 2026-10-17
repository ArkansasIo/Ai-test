USE ai_test;

-- Application maintenance jobs. Execute through MySQL Event Scheduler or an
-- external cron runner. Keeping the SQL here makes the schedule auditable.

CREATE EVENT IF NOT EXISTS ev_cleanup_old_messages
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP + INTERVAL 1 DAY
DO
  DELETE FROM messages WHERE created_at < (CURRENT_TIMESTAMP - INTERVAL 180 DAY);

CREATE EVENT IF NOT EXISTS ev_refresh_job_schedule
ON SCHEDULE EVERY 15 MINUTE
DO
  UPDATE scheduled_jobs
  SET next_run_at = DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 MINUTE)
  WHERE enabled = TRUE;

CREATE EVENT IF NOT EXISTS ev_cleanup_orphan_memories
ON SCHEDULE EVERY 1 DAY
DO
  DELETE FROM memories WHERE user_id IS NOT NULL
    AND user_id NOT IN (SELECT id FROM users);
