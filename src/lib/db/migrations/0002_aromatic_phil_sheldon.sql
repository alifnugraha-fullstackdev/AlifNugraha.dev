CREATE TABLE "competitions" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"dates" text NOT NULL,
	"location" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"flags" jsonb DEFAULT '[]'::jsonb,
	"links" jsonb DEFAULT '[]'::jsonb,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"platform" text NOT NULL,
	"contact_value" text NOT NULL,
	"url" text NOT NULL,
	"icon_name" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"repo_url" text,
	"live_url" text,
	"badges" jsonb DEFAULT '[]'::jsonb,
	"sort_order" integer DEFAULT 0,
	"unmaintained" boolean DEFAULT false,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "social_links" (
	"id" text PRIMARY KEY NOT NULL,
	"platform" text NOT NULL,
	"url" text NOT NULL,
	"icon_name" text NOT NULL,
	"display_name" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
