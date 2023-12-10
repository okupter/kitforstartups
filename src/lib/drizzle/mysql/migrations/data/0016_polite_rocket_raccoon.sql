ALTER TABLE `employee` ADD `is_commissionable` tinyint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `sale` DROP COLUMN `is_commissionable`;