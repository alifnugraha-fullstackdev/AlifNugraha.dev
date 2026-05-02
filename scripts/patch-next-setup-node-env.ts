import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const nextDir = join(process.cwd(), "node_modules", "next");
const target = join(nextDir, "setup-node-env.js");
const fallbackModule = "next/dist/build/adapter/setup-node-env.external";

async function main() {
  if (!existsSync(nextDir)) {
    console.warn(
      "[patch-next-setup-node-env] next package not found; skipping.",
    );
    return;
  }

  if (existsSync(target)) {
    return;
  }

  try {
    await writeFile(target, `module.exports = require("${fallbackModule}");\n`);
    console.log(`[patch-next-setup-node-env] created ${target}`);
  } catch (error) {
    console.warn(
      `[patch-next-setup-node-env] failed to create ${target}`,
      error,
    );
  }
}

void main();
