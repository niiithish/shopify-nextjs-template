"use client";

import { useMemo } from "react";
import { PublisherLogo } from "@/components/presswall/publisher-logo";
import { getLogoSlotStyle } from "@/lib/presswall-logo-style";
import type {
  PublisherCatalogItem,
  ShopPublisherSelection,
  StorefrontPublisher,
} from "@/lib/presswall-types";
import { resolveStorefrontPublishers } from "@/lib/resolve-storefront-publishers";

interface UsePresswallStripItemsOptions {
  catalog: PublisherCatalogItem[];
  logoHeight: number;
  logoMaxWidth: number;
  logoStyle: React.CSSProperties | undefined;
  selections: ShopPublisherSelection[];
}

export function usePresswallStripItems({
  catalog,
  logoHeight,
  logoMaxWidth,
  logoStyle,
  selections,
}: UsePresswallStripItemsOptions) {
  const items = useMemo(
    () => resolveStorefrontPublishers(catalog, selections),
    [catalog, selections]
  );

  const renderLogo = useMemo(
    () => (item: StorefrontPublisher) => (
      <PublisherLogo
        customLogoSvg={item.isCustom ? item.logoSvg || undefined : undefined}
        logoImageUrl={item.logoImageUrl}
        name={item.name}
        publisherId={item.isCustom ? undefined : item.id}
        style={getLogoSlotStyle(logoHeight, logoMaxWidth, logoStyle)}
      />
    ),
    [logoHeight, logoMaxWidth, logoStyle]
  );

  return { items, renderLogo };
}
