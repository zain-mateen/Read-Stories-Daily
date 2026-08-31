-- Optional manual migration.
--
-- The app runs all of this automatically on first DB use (ensureSchema()
-- in src/lib/db.ts). Only run this by hand if you want to apply the schema
-- changes before the first request hits the redeployed app.
--
-- Safe to run more than once.

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(500) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 100,
  in_primary_nav TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS post_images (
  id CHAR(32) PRIMARY KEY,
  mime VARCHAR(64) NOT NULL,
  byte_size INT NOT NULL,
  data LONGBLOB NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO categories (slug, name, description, sort_order, in_primary_nav) VALUES
  ('true-stories',          'True Stories',           'Real events, real people — accounts of things that actually happened.',        1, 1),
  ('mystery-suspense',      'Mystery & Suspense',      'Puzzles, disappearances, and slow-burn tension that keeps you guessing.',      2, 1),
  ('horror-stories',        'Horror Stories',          'Tales meant to unsettle — the dark, the eerie, and the genuinely frightening.', 3, 1),
  ('emotional-stories',     'Emotional Stories',       'Stories that hit close to home and stay with you after the last line.',       10, 0),
  ('inspirational-stories', 'Inspirational Stories',   'Ordinary people, hard odds, and the choices that changed everything.',        11, 0),
  ('love-stories',          'Love Stories',            'Romance in all its forms — the beginnings, the endings, and everything between.', 12, 0),
  ('animal-stories',        'Animal Stories',          'Loyalty, rescue, and the bonds between people and the animals they love.',    13, 0),
  ('strange-unbelievable',  'Strange & Unbelievable',  'The bizarre and the barely-credible — stories that sound made up but aren''t.', 14, 0);

-- Add posts.blog_number if this database predates it.
-- (MySQL has no "ADD COLUMN IF NOT EXISTS"; if the column already exists
--  this statement errors harmlessly — just skip it.)
ALTER TABLE posts
  ADD COLUMN blog_number INT NULL,
  ADD UNIQUE KEY uq_blog_number (blog_number);
