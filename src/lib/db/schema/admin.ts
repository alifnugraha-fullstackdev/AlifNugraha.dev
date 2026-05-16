import { pgTable, text, timestamp, jsonb, integer, boolean } from "drizzle-orm/pg-core";
import { nanoid } from "@/lib/utils";

// ─── Site Settings (key-value store) ───
export const siteSettingsTable = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// ─── Projects ───
export const projectsTable = pgTable("projects", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(10)),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  repoUrl: text("repo_url"),
  liveUrl: text("live_url"),
  badges: jsonb("badges").$type<string[]>().default([]),
  sortOrder: integer("sort_order").default(0),
  unmaintained: boolean("unmaintained").default(false),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// ─── Competitions ───
export const competitionsTable = pgTable("competitions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(10)),
  title: text("title").notNull(),
  dates: text("dates").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  flags: jsonb("flags").$type<string[]>().default([]),
  links: jsonb("links")
    .$type<{ title: string; href: string; icon: string; variant?: string }[]>()
    .default([]),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// ─── Social Links (footer) ───
export const socialLinksTable = pgTable("social_links", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(10)),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  iconName: text("icon_name").notNull(),
  iconUrl: text("icon_url"),
  displayName: text("display_name"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});

// ─── Contacts (about page) ───
export const contactsTable = pgTable("contacts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(10)),
  platform: text("platform").notNull(),
  contactValue: text("contact_value").notNull(),
  url: text("url").notNull(),
  iconName: text("icon_name").notNull(),
  iconUrl: text("icon_url"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
});
