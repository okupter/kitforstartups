CREATE TABLE `campaigns` (
	`id` varchar(255) NOT NULL,
	`client_id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`active` boolean NOT NULL DEFAULT false,
	`created` bigint NOT NULL,
	`updated` bigint NOT NULL,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `employee_codes` ADD `campaign_id` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `employee_codes` ADD CONSTRAINT `employee_codes_campaign_id_campaigns_id_fk` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_codes` DROP COLUMN `client_id`;--> statement-breakpoint
ALTER TABLE `campaigns` ADD CONSTRAINT `campaigns_client_id_client_id_fk` FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON DELETE no action ON UPDATE no action;