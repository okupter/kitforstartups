CREATE TABLE `employee_notes` (
	`id` varchar(255) NOT NULL,
	`employee_id` varchar(255) NOT NULL,
	`note` text NOT NULL,
	`created` bigint NOT NULL,
	CONSTRAINT `employee_notes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `employee_notes` ADD CONSTRAINT `employee_notes_employee_id_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;