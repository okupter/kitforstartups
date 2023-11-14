CREATE TABLE `expense_item` (
	`id` varchar(255) NOT NULL,
	`client_id` varchar(255) NOT NULL,
	`expense_report_id` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`amount` double NOT NULL DEFAULT 0,
	`date_incurred` bigint NOT NULL,
	`receipt_url` varchar(1024),
	CONSTRAINT `expense_item_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expense_report` (
	`id` varchar(255) NOT NULL,
	`employee_id` varchar(255) NOT NULL,
	`client_id` varchar(255) NOT NULL,
	`paystub_id` varchar(255) NOT NULL,
	`submission_date` bigint NOT NULL,
	`approval_status` enum('pending','approved','rejected') NOT NULL,
	`approval_date` bigint,
	`approval_notes` text,
	`total_amount` double NOT NULL DEFAULT 0,
	`created` bigint NOT NULL,
	`updated` bigint NOT NULL,
	`deleted` bigint,
	CONSTRAINT `expense_report_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payroll_cycle` (
	`id` varchar(255) NOT NULL,
	`client_id` varchar(255) NOT NULL,
	`start_date` bigint NOT NULL,
	`end_date` bigint NOT NULL,
	`payment_date` bigint NOT NULL,
	`created` bigint NOT NULL,
	`updated` bigint NOT NULL,
	`deleted` bigint,
	CONSTRAINT `payroll_cycle_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `paystub` (
	`id` varchar(255) NOT NULL,
	`employee_id` varchar(255) NOT NULL,
	`client_id` varchar(255) NOT NULL,
	`payroll_cycle_id` varchar(255) NOT NULL,
	`campaign_id` varchar(255) NOT NULL,
	`total_sales` bigint NOT NULL,
	`total_overrides` bigint NOT NULL,
	`piece_rate` double NOT NULL,
	`gross_pay` double NOT NULL,
	`net_pay` double NOT NULL,
	`tax_deductions` double NOT NULL DEFAULT 0,
	`other_deductions` double NOT NULL DEFAULT 0,
	`created` bigint NOT NULL,
	`updated` bigint NOT NULL,
	`deleted` bigint,
	CONSTRAINT `paystub_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sale` (
	`id` varchar(255) NOT NULL,
	`employee_id` varchar(255) NOT NULL,
	`client_id` varchar(255) NOT NULL,
	`paystub_id` varchar(255) NOT NULL,
	`campaign_id` varchar(255) NOT NULL,
	`sale_date` bigint NOT NULL,
	`sale_amount` double NOT NULL DEFAULT 0,
	`is_complete` tinyint NOT NULL DEFAULT 0,
	`status_description` enum('pending','approved','rejected') NOT NULL,
	`created` bigint NOT NULL,
	`updated` bigint NOT NULL,
	`deleted` bigint,
	CONSTRAINT `sale_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sale_override` (
	`id` varchar(255) NOT NULL,
	`employee_id` varchar(255) NOT NULL,
	`client_id` varchar(255) NOT NULL,
	`sale_id` varchar(255) NOT NULL,
	`originating_employee_id` varchar(255) NOT NULL,
	`beneficiary_employee_id` varchar(255) NOT NULL,
	`override_amount` double NOT NULL DEFAULT 0,
	CONSTRAINT `sale_override_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `expense_item` ADD CONSTRAINT `expense_item_client_id_client_id_fk` FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expense_item` ADD CONSTRAINT `expense_item_expense_report_id_expense_report_id_fk` FOREIGN KEY (`expense_report_id`) REFERENCES `expense_report`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expense_report` ADD CONSTRAINT `expense_report_employee_id_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expense_report` ADD CONSTRAINT `expense_report_client_id_client_id_fk` FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `expense_report` ADD CONSTRAINT `expense_report_paystub_id_paystub_id_fk` FOREIGN KEY (`paystub_id`) REFERENCES `paystub`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `payroll_cycle` ADD CONSTRAINT `payroll_cycle_client_id_client_id_fk` FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `paystub` ADD CONSTRAINT `paystub_employee_id_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `paystub` ADD CONSTRAINT `paystub_client_id_client_id_fk` FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `paystub` ADD CONSTRAINT `paystub_payroll_cycle_id_payroll_cycle_id_fk` FOREIGN KEY (`payroll_cycle_id`) REFERENCES `payroll_cycle`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `paystub` ADD CONSTRAINT `paystub_campaign_id_campaigns_id_fk` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sale` ADD CONSTRAINT `sale_employee_id_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sale` ADD CONSTRAINT `sale_client_id_client_id_fk` FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sale` ADD CONSTRAINT `sale_paystub_id_paystub_id_fk` FOREIGN KEY (`paystub_id`) REFERENCES `paystub`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sale` ADD CONSTRAINT `sale_campaign_id_campaigns_id_fk` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sale_override` ADD CONSTRAINT `sale_override_employee_id_employee_id_fk` FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sale_override` ADD CONSTRAINT `sale_override_client_id_client_id_fk` FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sale_override` ADD CONSTRAINT `sale_override_sale_id_sale_id_fk` FOREIGN KEY (`sale_id`) REFERENCES `sale`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sale_override` ADD CONSTRAINT `sale_override_originating_employee_id_employee_id_fk` FOREIGN KEY (`originating_employee_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sale_override` ADD CONSTRAINT `sale_override_beneficiary_employee_id_employee_id_fk` FOREIGN KEY (`beneficiary_employee_id`) REFERENCES `employee`(`id`) ON DELETE no action ON UPDATE no action;