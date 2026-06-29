export function hasEmbeddedEntryParams(
  params: Record<string, string | string[] | undefined>
): boolean {
  const shop = typeof params.shop === "string" ? params.shop : undefined;
  const host = typeof params.host === "string" ? params.host : undefined;

  return Boolean(shop ?? host);
}
