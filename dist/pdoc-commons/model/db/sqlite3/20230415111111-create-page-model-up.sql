-- ------------------------------------
-- create page-model
-- ------------------------------------

CREATE TABLE IF NOT EXISTS page (
  pg_id INTEGER PRIMARY KEY,
  pg_key VARCHAR(255) NOT NULL,
  pg_name VARCHAR(255) NOT NULL,
  pg_css TEXT,
  pg_descmd TEXT,
  pg_heading TEXT,
  pg_image VARCHAR(255),
  pg_subsectionids VARCHAR(500),
  pg_teaser VARCHAR(255),
  pg_theme VARCHAR(255),
  pg_subtype VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS props (
  pr_id integer PRIMARY KEY,
  pr_name varchar(255)  DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS page_props (
  ppr_id integer PRIMARY KEY,
  pg_id int(11) NOT NULL DEFAULT '0',
  pr_id int(11) NOT NULL DEFAULT '0',
  CONSTRAINT page_props_ibfk_1 FOREIGN KEY (pg_id) REFERENCES page (pd_id) ON DELETE CASCADE,
  CONSTRAINT page_props_ibfk_2 FOREIGN KEY (pr_id) REFERENCES props (pr_id) ON DELETE CASCADE
);
