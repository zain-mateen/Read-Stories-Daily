-- Read Stories Daily — blog posts table.
-- Run this once in phpMyAdmin (Import tab) before running seed.sql.

CREATE TABLE IF NOT EXISTS posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_role VARCHAR(255) NOT NULL,
  author_avatar VARCHAR(500) NOT NULL,
  published_date DATE NOT NULL,
  read_time VARCHAR(50) NOT NULL,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  image VARCHAR(500) NOT NULL,
  content LONGTEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_published_date (published_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
