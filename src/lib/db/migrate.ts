import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, sql } from "@/lib/db/index";

const runMigrate = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

  console.log("⏳ Running Database migrations...");
  const start = Date.now();

  // Database Migrations
  await migrate(db, { migrationsFolder: "src/lib/db/migrations" });

  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");

  // Close the connection after migration
  await sql.end();
  process.exit(0);
};

runMigrate().catch(async (err) => {
  console.error("❌ Migration failed");
  console.error(err);
  await sql.end();
  process.exit(1);
});
