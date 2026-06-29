import { adminFetch } from "@/lib/admin-fetch";
import { DEFAULT_PRESSWALL_CONFIG } from "@/lib/presswall-defaults";
import { selectedFromApi } from "@/lib/presswall-selections";
import { resolveOnboardingDesignConfig } from "@/lib/presswall-templates";
import type {
  PresswallConfig,
  PublisherCatalogItem,
  SelectedPublisher,
} from "@/lib/presswall-types";

export interface PresswallClientData {
  catalog: PublisherCatalogItem[];
  config: PresswallConfig;
  needsOnboarding: boolean;
  selected: SelectedPublisher[];
}

export async function fetchPresswallClientData(): Promise<PresswallClientData> {
  const [publishersRes, presswallRes] = await Promise.all([
    adminFetch("/api/publishers"),
    adminFetch("/api/presswall"),
  ]);

  if (!(publishersRes.ok && presswallRes.ok)) {
    throw new Error("Failed to load Presswall settings");
  }

  const publishersData = await publishersRes.json();
  const presswallData = await presswallRes.json();
  const needsOnboarding = Boolean(presswallData.needsOnboarding);

  const config = needsOnboarding
    ? resolveOnboardingDesignConfig(presswallData.config)
    : presswallData.config;

  return {
    catalog: publishersData.publishers,
    config: config ?? DEFAULT_PRESSWALL_CONFIG,
    needsOnboarding,
    selected: selectedFromApi(presswallData.selections),
  };
}
