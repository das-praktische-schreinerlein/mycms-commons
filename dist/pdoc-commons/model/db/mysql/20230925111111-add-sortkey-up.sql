-- ------------------------------------
-- add sortkey
-- ------------------------------------

ALTER TABLE page ADD COLUMN IF NOT EXISTS pg_sortkey VARCHAR(255);
