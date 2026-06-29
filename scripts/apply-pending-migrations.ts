import { createClient } from "@libsql/client";
import { getTursoConfig } from "../src/db/constants";

const MIGRATIONS = [
  "ALTER TABLE shop_configs ADD COLUMN logos_per_row integer DEFAULT 4 NOT NULL",
  "ALTER TABLE shop_configs ADD COLUMN logos_per_row_mobile integer DEFAULT 2 NOT NULL",
  "ALTER TABLE shop_configs ADD COLUMN heading_font_size integer DEFAULT 12 NOT NULL",
  "ALTER TABLE shop_configs ADD COLUMN heading_spacing integer DEFAULT 20 NOT NULL",
  "ALTER TABLE shop_configs ADD COLUMN logo_alignment text DEFAULT 'center' NOT NULL",
  "UPDATE shop_configs SET logo_alignment = alignment",
];

function isDuplicateColumnError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("duplicate column") || message.includes("already exists")
  );
}

const client = createClient(getTursoConfig());

for (const sql of MIGRATIONS) {
  try {
    await client.execute(sql);
    console.log(`Applied: ${sql}`);
  } catch (error) {
    if (isDuplicateColumnError(error)) {
      console.log(`Skipped (exists): ${sql}`);
      continue;
    }

    throw error;
  }
}

console.log("Migrations complete.");
