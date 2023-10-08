CREATE TABLE `employee` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255),
	`client_id` varchar(255) NOT NULL,
	`first_name` varchar(255) NOT NULL,
	`last_name` varchar(255) NOT NULL,
	CONSTRAINT `employee_id` PRIMARY KEY(`id`),
	CONSTRAINT `employee_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `employee_profile` (
	`id` varchar(255) NOT NULL,
	`employee_id` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`address_2` varchar(255),
	`city` varchar(255) NOT NULL,
	`state` varchar(255) NOT NULL,
	`zip` varchar(255) NOT NULL,
	`phone` varchar(255) NOT NULL,
	`phone_2` varchar(255),
	`email` varchar(255) NOT NULL,
	CONSTRAINT `employee_profile_id` PRIMARY KEY(`id`),
	CONSTRAINT `employee_profile_employee_id_unique` UNIQUE(`employee_id`)
);
--> statement-breakpoint
ALTER TABLE `employee` ADD CONSTRAINT `employee_user_id_auth_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee` ADD CONSTRAINT `employee_client_id_client_id_fk` FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_profile` ADD CONSTRAINT `employee_profile_employee_id_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;