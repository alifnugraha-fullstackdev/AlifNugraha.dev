import { db } from "@/lib/db";
import {
  siteSettingsTable,
  projectsTable,
  competitionsTable,
  socialLinksTable,
  contactsTable,
} from "@/lib/db/schema/admin";
import { asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

// Caches for frontend performance

export const getCachedSiteSettings = unstable_cache(
  async () => {
    const rows = await db.select().from(siteSettingsTable);
    const settings: Record<string, string> = {};
    for (const row of rows) {
      settings[row.key] = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
    }
    return settings;
  },
  ["site_settings"],
  { tags: ["site_settings"], revalidate: 60 }
);

export const getCachedProjects = unstable_cache(
  async () => {
    return db.select().from(projectsTable).orderBy(asc(projectsTable.sortOrder));
  },
  ["projects"],
  { tags: ["projects"], revalidate: 60 }
);

export const getCachedCompetitions = unstable_cache(
  async () => {
    return db.select().from(competitionsTable).orderBy(asc(competitionsTable.sortOrder));
  },
  ["competitions"],
  { tags: ["competitions"], revalidate: 60 }
);

export const getCachedSocialLinks = unstable_cache(
  async () => {
    return db.select().from(socialLinksTable).orderBy(asc(socialLinksTable.sortOrder));
  },
  ["social_links"],
  { tags: ["social_links"], revalidate: 60 }
);

export const getCachedContacts = unstable_cache(
  async () => {
    return db.select().from(contactsTable).orderBy(asc(contactsTable.sortOrder));
  },
  ["contacts"],
  { tags: ["contacts"], revalidate: 60 }
);
