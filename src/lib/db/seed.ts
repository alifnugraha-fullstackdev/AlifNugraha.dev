import { db, sql } from "@/lib/db";
import {
  siteSettingsTable,
  projectsTable,
  competitionsTable,
  socialLinksTable,
  contactsTable,
} from "@/lib/db/schema/admin";
import { projectsData } from "@/constants/portfolio/projects";
import { competitions } from "@/constants/portfolio/competitions";
import { contacts } from "@/constants/portfolio/about";
import { socials } from "@/constants/navigation/footer";

async function seed() {
  console.log("🌱 Seeding database...");

  // 1. Site Settings
  console.log("Seeding Site Settings...");
  const settings = {
    hero_name: "hey, i'm Alif Nugraha 👋",
    hero_subtitle: "a self-taught software engineer with a strong foundation in full-stack development, driven by a passion for building impactful solutions.",
    hero_quote: "Let's work together to bring your ideas to life.",
    about_bio: "My name is Alif Nugraha. I am a self-taught Software Engineer with a deep passion for building impactful digital solutions. My journey into programming started with curiosity, and since then, I've dedicated myself to mastering the tools needed to build modern web and mobile applications.",
    about_birth_date: "2006-05-15", // placeholder
    site_title: "Alif Nugraha",
    site_description: "A portfolio website showcasing projects, skills, and experiences.",
    favicon_url: "",
  };

  for (const [key, value] of Object.entries(settings)) {
    await db
      .insert(siteSettingsTable)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoNothing();
  }

  // 2. Projects
  console.log("Seeding Projects...");
  for (let i = 0; i < projectsData.length; i++) {
    const p = projectsData[i];
    // Extract text from Badge React elements (hacky but works for the seed)
    const badges = p.badge.map((b: any) => b.props.children);
    
    await db.insert(projectsTable).values({
      title: p.title,
      description: p.description,
      imageUrl: p.imageId,
      repoUrl: p.repo,
      liveUrl: p.link || "",
      badges,
      unmaintained: p.unmaintained || false,
      sortOrder: i,
    }).onConflictDoNothing();
  }

  // 3. Competitions
  console.log("Seeding Competitions...");
  for (let i = 0; i < competitions.length; i++) {
    const c = competitions[i];
    const links = c.links?.map((l: any) => ({
      title: l.title,
      href: l.href,
      icon: l.icon.type.name || "Link",
      variant: l.variant,
    })) || [];

    await db.insert(competitionsTable).values({
      title: c.title,
      dates: c.dates,
      location: c.location,
      description: c.description,
      imageUrl: c.image || "",
      flags: c.flags || [],
      links,
      sortOrder: i,
    }).onConflictDoNothing();
  }

  // 4. Social Links
  console.log("Seeding Social Links...");
  let order = 0;
  for (const item of socials) {
    await db.insert(socialLinksTable).values({
      platform: item.name,
      url: item.href,
      iconName: item.icon.name || "Link", // Default fallback
      displayName: item.name,
      sortOrder: order++,
    }).onConflictDoNothing();
  }

  // 5. Contacts
  console.log("Seeding Contacts...");
  for (let i = 0; i < contacts.length; i++) {
    const c = contacts[i];
    await db.insert(contactsTable).values({
      platform: c.name,
      contactValue: c.contact,
      url: c.link,
      iconName: c.icon.name || "Link",
      sortOrder: i,
    }).onConflictDoNothing();
  }

  console.log("✅ Seeding complete!");
  await sql.end();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error("❌ Seeding failed:");
  console.error(err);
  await sql.end();
  process.exit(1);
});
