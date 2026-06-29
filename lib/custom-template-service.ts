import { and, asc, eq } from "drizzle-orm";
import type { PresswallConfig } from "@/lib/presswall-types";
import { presswallConfigSchema } from "@/lib/presswall-types";
import { db } from "@/src/db";
import { shopCustomTemplates } from "@/src/db/schema";

export interface ShopCustomTemplate {
  config: PresswallConfig;
  createdAt: string;
  description: string | null;
  id: string;
  name: string;
  updatedAt: string;
}

function mapCustomTemplateRow(
  row: typeof shopCustomTemplates.$inferSelect
): ShopCustomTemplate | null {
  let config: unknown;
  try {
    config = JSON.parse(row.configJson);
  } catch {
    return null;
  }

  const parsed = presswallConfigSchema.safeParse(config);
  if (!parsed.success) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    config: parsed.data,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function listShopCustomTemplates(
  shop: string
): Promise<ShopCustomTemplate[]> {
  const rows = await db
    .select()
    .from(shopCustomTemplates)
    .where(eq(shopCustomTemplates.shop, shop))
    .orderBy(asc(shopCustomTemplates.name));

  return rows
    .map((row) => mapCustomTemplateRow(row))
    .filter((template): template is ShopCustomTemplate => template !== null);
}

export async function saveShopCustomTemplate(
  shop: string,
  input: {
    config: PresswallConfig;
    description?: string;
    name: string;
  }
): Promise<ShopCustomTemplate> {
  const now = new Date().toISOString();
  const trimmedName = input.name.trim();
  const trimmedDescription = input.description?.trim() || null;

  const existing = await db
    .select({ id: shopCustomTemplates.id })
    .from(shopCustomTemplates)
    .where(
      and(
        eq(shopCustomTemplates.shop, shop),
        eq(shopCustomTemplates.name, trimmedName)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    throw new Error("TEMPLATE_NAME_EXISTS");
  }

  const id = crypto.randomUUID();
  await db.insert(shopCustomTemplates).values({
    id,
    shop,
    name: trimmedName,
    description: trimmedDescription,
    configJson: JSON.stringify(input.config),
    createdAt: now,
    updatedAt: now,
  });

  const saved = await db
    .select()
    .from(shopCustomTemplates)
    .where(eq(shopCustomTemplates.id, id))
    .limit(1);

  const mapped = saved[0] ? mapCustomTemplateRow(saved[0]) : null;
  if (!mapped) {
    throw new Error("TEMPLATE_SAVE_FAILED");
  }

  return mapped;
}
