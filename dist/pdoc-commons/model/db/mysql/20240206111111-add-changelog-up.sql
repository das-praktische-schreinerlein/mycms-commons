-- ------------------------------------
-- add changelog
-- ------------------------------------

ALTER TABLE page ADD COLUMN IF NOT EXISTS pg_createdat DATE;
ALTER TABLE page ADD COLUMN IF NOT EXISTS pg_updatedat DATE;
ALTER TABLE page ADD COLUMN IF NOT EXISTS pg_updateversion INTEGER;
