-- =============================================
-- cafe24 MySQL 테이블 생성 SQL
-- phpMyAdmin 또는 MySQL 클라이언트에서 실행
-- =============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- 1. 사용자 테이블
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE,
  `first_name` VARCHAR(255),
  `last_name` VARCHAR(255),
  `phone` VARCHAR(50),
  `profile_image_url` VARCHAR(1024),
  `is_admin` INT DEFAULT 0,
  `password_hash` VARCHAR(255),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. 세션 테이블
CREATE TABLE IF NOT EXISTS `sessions` (
  `sid` VARCHAR(128) NOT NULL PRIMARY KEY,
  `sess` JSON NOT NULL,
  `expire` DATETIME NOT NULL,
  INDEX `IDX_session_expire` (`expire`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. 게시글 테이블
CREATE TABLE IF NOT EXISTS `posts` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `author_id` VARCHAR(36) NOT NULL,
  `ganji` TEXT,
  `section` TEXT DEFAULT 'madang',
  `media_urls` JSON,
  `youtube_urls` JSON,
  `text_style` TEXT,
  `likes` INT DEFAULT 0,
  `dislikes` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. 댓글 테이블
CREATE TABLE IF NOT EXISTS `comments` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `post_id` INT NOT NULL,
  `parent_id` INT,
  `content` LONGTEXT NOT NULL,
  `author_id` VARCHAR(36) NOT NULL,
  `media_urls` JSON,
  `youtube_urls` JSON,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`),
  FOREIGN KEY (`author_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. 게시글 투표 테이블
CREATE TABLE IF NOT EXISTS `post_votes` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `post_id` INT NOT NULL,
  `user_id` VARCHAR(36) NOT NULL,
  `vote_type` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. 메시지 테이블
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `sender_id` VARCHAR(36) NOT NULL,
  `receiver_id` VARCHAR(36) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `is_read` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. 사이트 설정 테이블
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(255) NOT NULL UNIQUE,
  `value` LONGTEXT NOT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. 마당 카테고리 테이블
CREATE TABLE IF NOT EXISTS `madang_categories` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `parent_id` INT,
  `level` INT DEFAULT 1,
  `name` TEXT NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT,
  `sort_order` INT DEFAULT 0,
  `is_active` INT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. 페이지 콘텐츠 테이블
CREATE TABLE IF NOT EXISTS `page_contents` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `page_slug` VARCHAR(255) NOT NULL UNIQUE,
  `title` TEXT NOT NULL,
  `content` LONGTEXT,
  `custom_css` LONGTEXT,
  `custom_js` LONGTEXT,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(36),
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. 페이지 레이아웃 테이블
CREATE TABLE IF NOT EXISTS `page_layouts` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` TEXT NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `layout_json` LONGTEXT NOT NULL,
  `html_content` LONGTEXT,
  `custom_css` LONGTEXT,
  `is_published` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(36),
  FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. 코드 스니펫 테이블
CREATE TABLE IF NOT EXISTS `code_snippets` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` TEXT NOT NULL,
  `description` TEXT,
  `language` TEXT NOT NULL,
  `category` TEXT,
  `code` LONGTEXT NOT NULL,
  `tags` JSON,
  `is_public` INT DEFAULT 1,
  `created_by` VARCHAR(36),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. 사이트 로고 테이블
CREATE TABLE IF NOT EXISTS `site_logos` (
  `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` TEXT NOT NULL,
  `object_path` TEXT NOT NULL,
  `is_active` INT DEFAULT 0,
  `created_by` VARCHAR(36),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 완료! 총 12개 테이블이 생성되었습니다.
-- =============================================

-- =============================================
-- 관리자 계정 초기 설정 (oraeteo@gmail.com / nero2014)
-- =============================================
INSERT INTO `users` (`id`, `email`, `first_name`, `last_name`, `phone`, `is_admin`, `password_hash`, `created_at`, `updated_at`)
VALUES (
  '44256201',
  'oraeteo@gmail.com',
  'ajee',
  'kang',
  '01024385087',
  1,
  'c54563a3eeef60619a615d7aee1854650960239b60bea415a515dfab7f8879cf8cfbb9d703bfc3eea84690d934be7a1b1b0bda6f119207c72e99a183f25c840b.b552e862775adc4a02fbb9e8ebd54cee',
  NOW(),
  NOW()
) ON DUPLICATE KEY UPDATE
  `is_admin` = 1,
  `password_hash` = VALUES(`password_hash`),
  `updated_at` = NOW();

-- 사이트 URL 설정
INSERT INTO `site_settings` (`key`, `value`) VALUES ('siteUrl', 'https://oraem.cafe24app.com')
ON DUPLICATE KEY UPDATE `value` = VALUES(`value`);
