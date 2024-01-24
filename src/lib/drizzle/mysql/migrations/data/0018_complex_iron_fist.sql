CREATE TABLE `overriding_employee` (
	`id` varchar(255) NOT NULL,
	`employee_id` varchar(255) NOT NULL,
	`overrides_employee_id` varchar(255) NOT NULL,
	CONSTRAINT `overriding_employee_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `overriding_employee` ADD CONSTRAINT `overriding_employee_employee_id_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `overriding_employee` ADD CONSTRAINT `overriding_employee_overrides_employee_id_employee_id_fk` FOREIGN KEY (`overrides_employee_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;