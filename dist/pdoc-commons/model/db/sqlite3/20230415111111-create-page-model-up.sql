-- ------------------------------------
-- create page-model
-- ------------------------------------

CREATE TABLE IF NOT EXISTS page (
  pg_id INTEGER PRIMARY KEY,
  pg_key VARCHAR(255) NOT NULL,
  pg_langkey VARCHAR(255) NOT NULL,
  pg_name VARCHAR(255) NOT NULL,
  pg_css TEXT,
  pg_descmd TEXT,
  pg_heading TEXT,
  pg_image VARCHAR(255),
  pg_teaser VARCHAR(255),
  pg_theme VARCHAR(255),
  pg_subtype VARCHAR(255),
  CONSTRAINT page__pg_pk UNIQUE (pg_key, pg_langkey)
);

CREATE TABLE IF NOT EXISTS page_props (
  pp_id INTEGER PRIMARY KEY,
  pg_id INTEGER NOT NULL,
  pp_name VARCHAR(255) NOT NULL,
  pp_value VARCHAR(255),
  CONSTRAINT page_props_pg_pk UNIQUE (pg_id, pp_name),
  CONSTRAINT page_props_pg_fk_1 FOREIGN KEY (pg_id) REFERENCES page (pg_id) ON DELETE CASCADE
);

--    blocked: number;
--    dateshow: Date;
--    playlists: string;
--    subtype: string;
--    flags?: string[];
--    keywords: string;
--    subSectionIds: string;
