CREATE TABLE `employee_codes` (
	`id` varchar(255) NOT NULL,
	`employee_id` varchar(255) NOT NULL,
	`employee_code` varchar(255) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT false,
	CONSTRAINT `employee_codes_id` PRIMARY KEY(`id`),
	CONSTRAINT `employee_codes_employee_id_employee_code_unique` UNIQUE(`employee_id`,`employee_code`)
);
--> statement-breakpoint
ALTER TABLE `employee_codes` ADD CONSTRAINT `employee_codes_employee_id_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;