CREATE TABLE `client` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`contact_user_id` varchar(255),
	`created` bigint NOT NULL,
	`updated` bigint NOT NULL,
	`deleted` bigint,
	CONSTRAINT `client_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `email_verification` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`expires` bigint NOT NULL,
	CONSTRAINT `email_verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `password_reset_token` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`expires` bigint NOT NULL,
	CONSTRAINT `password_reset_token_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `auth_user` (
	`id` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`github_username` varchar(255),
	CONSTRAINT `auth_user_id` PRIMARY KEY(`id`),
	CONSTRAINT `auth_user_email_unique` UNIQUE(`email`),
	CONSTRAINT `auth_user_github_username_unique` UNIQUE(`github_username`)
);
--> statement-breakpoint
CREATE TABLE `user_key` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`hashed_password` varchar(255),
	CONSTRAINT `user_key_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profile` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`client_id` varchar(255),
	`role` enum('user','supervisor','admin','org_admin','super_admin') NOT NULL DEFAULT 'user',
	`first_name` varchar(255),
	`last_name` varchar(255),
	`picture` varchar(1024),
	CONSTRAINT `user_profile_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_profile_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `user_session` (
	`id` varchar(255) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`active_expires` bigint NOT NULL,
	`idle_expires` bigint NOT NULL,
	CONSTRAINT `user_session_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `client` ADD CONSTRAINT `client_contact_user_id_auth_user_id_fk` FOREIGN KEY (`contact_user_id`) REFERENCES `auth_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `email_verification` ADD CONSTRAINT `email_verification_user_id_auth_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `password_reset_token` ADD CONSTRAINT `password_reset_token_user_id_auth_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_key` ADD CONSTRAINT `user_key_user_id_auth_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_profile` ADD CONSTRAINT `user_profile_user_id_auth_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_profile` ADD CONSTRAINT `user_profile_client_id_client_id_fk` FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_session` ADD CONSTRAINT `user_session_user_id_auth_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON DELETE no action ON UPDATE no action;