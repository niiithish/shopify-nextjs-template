import { createClient } from "@libsql/client";
import { getTursoConfig } from "../src/db/constants";

const shop = process.argv[2];

if (!shop) {
  console.error("Usage: bun run db:reset-onboarding <shop.myshopify.com>");
  process.exit(1);
}

const client = createClient(getTursoConfig());

await client.execute({
  sql: `UPDATE shop_configs
        SET onboarding_completed_at = NULL, updated_at = ?
        WHERE shop = ?`,
  args: [new Date().toISOString(), shop],
});

console.log(
  `Reset onboarding for ${shop}. Reload the app to see step 1 again.`
);
