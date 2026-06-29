import type { PresswallViewport } from "@/lib/presswall-layout-style";

/** Typical Shopify theme section / page width on desktop. */
export const PRESSWALL_PREVIEW_VIEWPORT_WIDTH = {
  desktop: 1200,
  mobile: 390,
} as const;

export function getPreviewViewportWidth(viewport: PresswallViewport): number {
  return PRESSWALL_PREVIEW_VIEWPORT_WIDTH[viewport];
}
