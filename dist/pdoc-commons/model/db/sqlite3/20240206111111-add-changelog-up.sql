-- ------------------------------------
-- add changelog
-- ------------------------------------

ALTER TABLE page ADD COLUMN pg_createdat DATE;
ALTER TABLE page ADD COLUMN pg_updatedat DATE;
ALTER TABLE page ADD COLUMN pg_updateversion INTEGER;
