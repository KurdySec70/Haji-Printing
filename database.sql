-- ============================================
-- Haji Printing Database Schema and Seed Data
-- Complete SQL File
-- ============================================

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================
-- DROP TABLES (if they exist)
-- ============================================

DROP TABLE IF EXISTS `temporary_invoice_links`;
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS `invoice_settings`;
DROP TABLE IF EXISTS `business_settings`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `failed_jobs`;
DROP TABLE IF EXISTS `job_batches`;
DROP TABLE IF EXISTS `jobs`;
DROP TABLE IF EXISTS `users`;

-- ============================================
-- CREATE TABLES
-- ============================================

-- Users table
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'cashier', 'customer') NOT NULL DEFAULT 'customer',
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_email_unique` (`email`),
    UNIQUE KEY `users_username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Jobs table (for Laravel queue system)
CREATE TABLE `jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `queue` VARCHAR(255) NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `attempts` TINYINT UNSIGNED NOT NULL,
    `reserved_at` INT UNSIGNED NULL,
    `available_at` INT UNSIGNED NOT NULL,
    `created_at` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`id`),
    KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job batches table
CREATE TABLE `job_batches` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `total_jobs` INT NOT NULL,
    `pending_jobs` INT NOT NULL,
    `failed_jobs` INT NOT NULL,
    `failed_job_ids` LONGTEXT NOT NULL,
    `options` MEDIUMTEXT NULL,
    `cancelled_at` INT NULL,
    `created_at` INT NOT NULL,
    `finished_at` INT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Failed jobs table
CREATE TABLE `failed_jobs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(255) NOT NULL,
    `connection` TEXT NOT NULL,
    `queue` TEXT NOT NULL,
    `payload` LONGTEXT NOT NULL,
    `exception` LONGTEXT NOT NULL,
    `failed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Products table
CREATE TABLE `products` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `type` ENUM('pcs', 'kg', 'width*height') NOT NULL,
    `width` DECIMAL(8, 2) NULL,
    `height` DECIMAL(8, 2) NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Transactions table
CREATE TABLE `transactions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(255) NOT NULL,
    `customer_id` BIGINT UNSIGNED NOT NULL,
    `cashier_id` BIGINT UNSIGNED NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `status` ENUM('paid', 'debt') NOT NULL DEFAULT 'debt',
    `type` ENUM('transaction', 'offer') NOT NULL DEFAULT 'transaction',
    `offer_status` ENUM('pending', 'accepted_paid', 'accepted_debt', 'rejected') NULL,
    `notes` TEXT NULL,
    `items` JSON NULL,
    `subtotal` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `discount_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `grand_total` DECIMAL(12, 2) NOT NULL,
    `transaction_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `transactions_order_id_unique` (`order_id`),
    KEY `transactions_customer_id_foreign` (`customer_id`),
    KEY `transactions_cashier_id_foreign` (`cashier_id`),
    CONSTRAINT `transactions_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `transactions_cashier_id_foreign` FOREIGN KEY (`cashier_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Business settings table
CREATE TABLE `business_settings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `company_name` VARCHAR(255) NOT NULL DEFAULT 'Haji Printing',
    `company_slogan` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `primary_phone` VARCHAR(20) NULL,
    `secondary_phone` VARCHAR(20) NULL,
    `email` VARCHAR(255) NULL,
    `address` TEXT NULL,
    `city` VARCHAR(100) NULL,
    `country` VARCHAR(100) NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Invoice settings table
CREATE TABLE `invoice_settings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `header_color` VARCHAR(7) NOT NULL DEFAULT '#f97316',
    `footer_color` VARCHAR(7) NOT NULL DEFAULT '#f97316',
    `table_header_color` VARCHAR(7) NOT NULL DEFAULT '#f97316',
    `primary_font` VARCHAR(50) NOT NULL DEFAULT 'Arial',
    `font_size_base` INT NOT NULL DEFAULT 12,
    `font_weight` VARCHAR(10) NOT NULL DEFAULT '400',
    `logo_width` INT NOT NULL DEFAULT 90,
    `logo_height` INT NOT NULL DEFAULT 90,
    `logo_url` VARCHAR(255) NULL,
    `company_title` VARCHAR(100) NOT NULL DEFAULT 'INVOICE',
    `company_name` VARCHAR(100) NOT NULL DEFAULT 'Haji Printing',
    `company_address` TEXT NULL,
    `company_phone_1` VARCHAR(50) NULL,
    `company_phone_2` VARCHAR(50) NULL,
    `company_email` VARCHAR(100) NULL,
    `company_website` VARCHAR(100) NULL,
    `header_height` INT NOT NULL DEFAULT 60,
    `footer_height` INT NOT NULL DEFAULT 40,
    `show_logo` TINYINT(1) NOT NULL DEFAULT 1,
    `show_company_info` TINYINT(1) NOT NULL DEFAULT 1,
    `show_date_time` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Posts table
CREATE TABLE `posts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `image_path` VARCHAR(255) NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Temporary invoice links table
CREATE TABLE `temporary_invoice_links` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `temp_id` VARCHAR(255) NOT NULL,
    `transaction_data` JSON NOT NULL,
    `expires_at` TIMESTAMP NOT NULL,
    `is_used` TINYINT(1) NOT NULL DEFAULT 0,
    `access_count` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `temporary_invoice_links_temp_id_unique` (`temp_id`),
    KEY `temporary_invoice_links_temp_id_expires_at_index` (`temp_id`, `expires_at`),
    KEY `temporary_invoice_links_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- CREATE INDEXES
-- ============================================

-- Indexes for transactions table
ALTER TABLE `transactions`
    ADD KEY `transactions_customer_status_index` (`customer_id`, `status`),
    ADD KEY `transactions_created_at_index` (`created_at`),
    ADD KEY `transactions_status_index` (`status`),
    ADD KEY `transactions_order_id_search_index` (`order_id`),
    ADD KEY `transactions_date_status_index` (`transaction_date`, `status`),
    ADD KEY `transactions_customer_date_index` (`customer_id`, `transaction_date`),
    ADD KEY `transactions_amount_index` (`grand_total`);

-- Indexes for users table
ALTER TABLE `users`
    ADD KEY `users_role_index` (`role`),
    ADD KEY `users_email_role_index` (`email`, `role`),
    ADD KEY `users_role_name_index` (`role`, `name`),
    ADD KEY `users_phone_index` (`phone`);

-- Indexes for products table
ALTER TABLE `products`
    ADD KEY `products_name_index` (`name`),
    ADD KEY `products_type_index` (`type`),
    ADD KEY `products_type_name_index` (`type`, `name`),
    ADD KEY `products_price_name_index` (`price`, `name`),
    ADD KEY `products_created_name_index` (`created_at`, `name`),
    ADD KEY `products_price_range_index` (`price`);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- SEED DATA
-- ============================================

-- Insert admin user
INSERT INTO `users` (`name`, `email`, `username`, `phone`, `password`, `role`, `created_at`, `updated_at`) VALUES
('ahmed', 'example@gmail.com', 'ahmed', NULL, '$2y$12$f9dQXUrJqWchKzV8mRRNjOnDYL4te/NReu/IiOyhNyIlXoUTYRitS', 'admin', NOW(), NOW());

-- Insert invoice settings
INSERT INTO `invoice_settings` (
    `header_color`,
    `footer_color`,
    `table_header_color`,
    `primary_font`,
    `font_size_base`,
    `font_weight`,
    `logo_width`,
    `logo_height`,
    `logo_url`,
    `company_title`,
    `company_name`,
    `company_address`,
    `company_phone_1`,
    `company_phone_2`,
    `company_email`,
    `company_website`,
    `header_height`,
    `footer_height`,
    `show_logo`,
    `show_company_info`,
    `show_date_time`,
    `created_at`,
    `updated_at`
) VALUES (
    '#f97316',
    '#f97316',
    '#f97316',
    'Arial',
    12,
    '400',
    90,
    90,
    NULL,
    'INVOICE',
    'Haji Printing',
    'Erbil-Ehsa Street, Near Sarhad Stationery',
    '0751 446 39 59',
    '0751 447 39 59',
    'info@hajiprinting.com',
    'www.hajiprinting.com',
    60,
    40,
    1,
    1,
    1,
    NOW(),
    NOW()
);

-- ============================================
-- END OF SQL FILE
-- ============================================
