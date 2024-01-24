ALTER TABLE `overriding_employee` ADD `override_amount` double DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `sale_override` ADD `paid_on_paystub_id` varchar(255);--> statement-breakpoint
ALTER TABLE `sale_override` ADD CONSTRAINT `sale_override_paid_on_paystub_id_paystub_id_fk` FOREIGN KEY (`paid_on_paystub_id`) REFERENCES `paystub`(`id`) ON DELETE no action ON UPDATE no action;