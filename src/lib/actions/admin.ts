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
import { supabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";
import { nanoid } from "@/lib/utils";

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
// ICON UPLOAD
// ════════════════════════════════════════════════════

export async function uploadIcon(formData: FormData): Promise<string> {
  await requireAdmin();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file provided");

  // Validate file type
  const allowedTypes = ["image/svg+xml", "image/png", "image/webp", "image/jpeg", "image/x-icon", "image/vnd.microsoft.icon"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Allowed: SVG, PNG, WEBP, JPEG, ICO");
  }

  // Validate file size (max 500KB)
  if (file.size > 500 * 1024) {
    throw new Error("File too large. Maximum 500KB");
  }

  const ext = file.name.split(".").pop() || "png";
  const fileName = `icons/${nanoid(12)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabaseAdmin.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(fileName);

  return data.publicUrl;
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
  iconUrl?: string;
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
    iconUrl: string | null;
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
  iconUrl?: string;
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
    iconUrl: string | null;
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
