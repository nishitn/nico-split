PRAGMA foreign_keys=OFF;
--> statement-breakpoint
INSERT INTO `user` (`id`, `name`, `email`, `email_verified`, `image`, `created_at`, `updated_at`)
SELECT
  'legacy-owner',
  'Legacy Owner',
  'legacy-owner@local.invalid',
  0,
  NULL,
  CAST(unixepoch('now') * 1000 AS integer),
  CAST(unixepoch('now') * 1000 AS integer)
WHERE NOT EXISTS (SELECT 1 FROM `user`)
  AND EXISTS (
    SELECT 1 FROM `accounts`
    UNION ALL
    SELECT 1 FROM `categories`
    UNION ALL
    SELECT 1 FROM `chapters`
  );
--> statement-breakpoint
CREATE TABLE `__new_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`label` text NOT NULL,
	`type` text NOT NULL,
	`icon_name` text NOT NULL,
	`currency` text NOT NULL,
	`balance` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_accounts` (`id`, `user_id`, `label`, `type`, `icon_name`, `currency`, `balance`)
SELECT
	`id`,
	(SELECT `id` FROM `user` ORDER BY `created_at` LIMIT 1),
	`label`,
	`type`,
	`icon_name`,
	`currency`,
	`balance`
FROM `accounts`;
--> statement-breakpoint
DROP TABLE `accounts`;
--> statement-breakpoint
ALTER TABLE `__new_accounts` RENAME TO `accounts`;
--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`label` text NOT NULL,
	`type` text NOT NULL,
	`icon_name` text NOT NULL,
	`parent_id` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_categories` (`id`, `user_id`, `label`, `type`, `icon_name`, `parent_id`)
SELECT
	`id`,
	(SELECT `id` FROM `user` ORDER BY `created_at` LIMIT 1),
	`label`,
	`type`,
	`icon_name`,
	`parent_id`
FROM `categories`;
--> statement-breakpoint
DROP TABLE `categories`;
--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;
--> statement-breakpoint
CREATE TABLE `__new_chapters` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`label` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_chapters` (`id`, `user_id`, `label`)
SELECT
	`id`,
	(SELECT `id` FROM `user` ORDER BY `created_at` LIMIT 1),
	`label`
FROM `chapters`;
--> statement-breakpoint
DROP TABLE `chapters`;
--> statement-breakpoint
ALTER TABLE `__new_chapters` RENAME TO `chapters`;
--> statement-breakpoint
CREATE INDEX `accounts_user_id_idx` ON `accounts` (`user_id`);
--> statement-breakpoint
CREATE INDEX `categories_user_id_idx` ON `categories` (`user_id`);
--> statement-breakpoint
CREATE INDEX `chapters_user_id_idx` ON `chapters` (`user_id`);
--> statement-breakpoint
CREATE TABLE `user_friends` (
	`user_id` text NOT NULL,
	`friend_user_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `friend_user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`friend_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `user_friends_user_id_idx` ON `user_friends` (`user_id`);
--> statement-breakpoint
CREATE INDEX `user_friends_friend_user_id_idx` ON `user_friends` (`friend_user_id`);
--> statement-breakpoint
PRAGMA foreign_keys=ON;
