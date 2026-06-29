CREATE TABLE `shop_custom_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`shop` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`config_json` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `shop_custom_templates_shop_idx` ON `shop_custom_templates` (`shop`);