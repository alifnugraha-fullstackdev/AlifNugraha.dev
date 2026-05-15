"use server";

import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  siteSettingsTable,
  projectsTable,
  competitionsTable,
  socialLinksTable,
  contactsTable,
} from "@/lib/db/schema/admin";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { revalidatePath, revalidateTag } from "next/cache";

// ─── Auth Guard ───
async function requireAdmin() {
  const authed = await isAdminAuthenticated();
  if (!authed) throw new Error("Unauthorized");
}

// ════════════════════════════════════════════════════
// SITE SETTINGS
// ════════════════════════════════════════════════════

export async function getSiteSettings() {
  const rows = await db.select().from(siteSettingsTable);
  const settings: Record<string, unknown> = {};
  for (const row of rows) {
    settings[row.key] = row.value;
  }
  return settings;
}

export async function getSiteSetting(key: string) {
  const [row] = await db
    .select()
    .from(siteSettingsTable)
    .where(eq(siteSettingsTable.key, key));
  return row?.value ?? null;
}

export async function updateSiteSettings(
  settings: Record<string, unknown>,
) {
  await requireAdmin();
  for (const [key, value] of Object.entries(settings)) {
    await db
      .insert(siteSettingsTable)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettingsTable.key,
        set: { value, updatedAt: new Date() },
      });
  }
  // @ts-ignore
  revalidateTag("site_settings");
  revalidatePath("/");
  revalidatePath("/about");
}

// ════════════════════════════════════════════════════
// PROJECTS
// ════════════════════════════════════════════════════

export async function getProjects() {
  return db
    .select()
    .from(projectsTable)
    .orderBy(asc(projectsTable.sortOrder));
}

export async function createProject(data: {
  title: string;
  description: string;
  imageUrl?: string;
  repoUrl?: string;
  liveUrl?: string;
  badges?: string[];
  unmaintained?: boolean;
}) {
  await requireAdmin();
  const existing = await getProjects();
  const [project] = await db
    .insert(projectsTable)
    .values({
      ...data,
      sortOrder: existing.length,
    })
    .returning();
  // @ts-ignore
  revalidateTag("projects");
  revalidatePath("/");
  revalidatePath("/projects");
  return project;
}

export async function updateProject(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    imageUrl: string;
    repoUrl: string;
    liveUrl: string;
    badges: string[];
    sortOrder: number;
    unmaintained: boolean;
  }>,
) {
  await requireAdmin();
  const [project] = await db
    .update(projectsTable)
    .set(data)
    .where(eq(projectsTable.id, id))
    .returning();
  // @ts-ignore
  revalidateTag("projects");
  revalidatePath("/");
  revalidatePath("/projects");
  return project;
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await db.delete(projectsTable).where(eq(projectsTable.id, id));
  // @ts-ignore
  revalidateTag("projects");
  revalidatePath("/");
  revalidatePath("/projects");
}

// ════════════════════════════════════════════════════
// COMPETITIONS
// ════════════════════════════════════════════════════

export async function getCompetitions() {
  return db
    .select()
    .from(competitionsTable)
    .orderBy(asc(competitionsTable.sortOrder));
}

export async function createCompetition(data: {
  title: string;
  dates: string;
  location: string;
  description: string;
  imageUrl?: string;
  flags?: string[];
  links?: { title: string; href: string; icon: string; variant?: string }[];
}) {
  await requireAdmin();
  const existing = await getCompetitions();
  const [comp] = await db
    .insert(competitionsTable)
    .values({
      ...data,
      sortOrder: existing.length,
    })
    .returning();
  // @ts-ignore
  revalidateTag("competitions");
  revalidatePath("/about");
  return comp;
}

export async function updateCompetition(
  id: string,
  data: Partial<{
    title: string;
    dates: string;
    location: string;
    description: string;
    imageUrl: string;
    flags: string[];
    links: { title: string; href: string; icon: string; variant?: string }[];
    sortOrder: number;
  }>,
) {
  await requireAdmin();
  const [comp] = await db
    .update(competitionsTable)
    .set(data)
    .where(eq(competitionsTable.id, id))
    .returning();
  // @ts-ignore
  revalidateTag("competitions");
  revalidatePath("/about");
  return comp;
}

export async function deleteCompetition(id: string) {
  await requireAdmin();
  await db.delete(competitionsTable).where(eq(competitionsTable.id, id));
  // @ts-ignore
  revalidateTag("competitions");
  revalidatePath("/about");
}

// ════════════════════════════════════════════════════
// SOCIAL LINKS
// ════════════════════════════════════════════════════

export async function getSocialLinks() {
  return db
    .select()
    .from(socialLinksTable)
    .orderBy(asc(socialLinksTable.sortOrder));
}

export async function createSocialLink(data: {
  platform: string;
  url: string;
  iconName: string;
  displayName?: string;
}) {
  await requireAdmin();
  const existing = await getSocialLinks();
  const [link] = await db
    .insert(socialLinksTable)
    .values({
      ...data,
      sortOrder: existing.length,
    })
    .returning();
  // @ts-ignore
  revalidateTag("social_links");
  revalidatePath("/");
  return link;
}

export async function updateSocialLink(
  id: string,
  data: Partial<{
    platform: string;
    url: string;
    iconName: string;
    displayName: string;
    sortOrder: number;
  }>,
) {
  await requireAdmin();
  const [link] = await db
    .update(socialLinksTable)
    .set(data)
    .where(eq(socialLinksTable.id, id))
    .returning();
  // @ts-ignore
  revalidateTag("social_links");
  revalidatePath("/");
  return link;
}

export async function deleteSocialLink(id: string) {
  await requireAdmin();
  await db.delete(socialLinksTable).where(eq(socialLinksTable.id, id));
  // @ts-ignore
  revalidateTag("social_links");
  revalidatePath("/");
}

// ════════════════════════════════════════════════════
// CONTACTS
// ════════════════════════════════════════════════════

export async function getContacts() {
  return db
    .select()
    .from(contactsTable)
    .orderBy(asc(contactsTable.sortOrder));
}

export async function createContact(data: {
  platform: string;
  contactValue: string;
  url: string;
  iconName: string;
}) {
  await requireAdmin();
  const existing = await getContacts();
  const [contact] = await db
    .insert(contactsTable)
    .values({
      ...data,
      sortOrder: existing.length,
    })
    .returning();
  // @ts-ignore
  revalidateTag("contacts");
  revalidatePath("/about");
  return contact;
}

export async function updateContact(
  id: string,
  data: Partial<{
    platform: string;
    contactValue: string;
    url: string;
    iconName: string;
    sortOrder: number;
  }>,
) {
  await requireAdmin();
  const [contact] = await db
    .update(contactsTable)
    .set(data)
    .where(eq(contactsTable.id, id))
    .returning();
  // @ts-ignore
  revalidateTag("contacts");
  revalidatePath("/about");
  return contact;
}

export async function deleteContact(id: string) {
  await requireAdmin();
  await db.delete(contactsTable).where(eq(contactsTable.id, id));
  // @ts-ignore
  revalidateTag("contacts");
  revalidatePath("/about");
}
