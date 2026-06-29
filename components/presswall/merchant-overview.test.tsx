import { afterEach, describe, expect, mock, test } from "bun:test";
import { cleanup, render } from "@testing-library/react";
import type { MerchantOverviewData } from "@/lib/merchant-overview-data";
import { DEFAULT_PRESSWALL_CONFIG } from "@/lib/presswall-defaults";

mock.module("@/components/presswall/onboarding-preview", () => ({
  OnboardingPreview: () => <div data-testid="read-only-preview">Preview</div>,
}));

mock.module("@/hooks/use-theme-activation-status", () => ({
  useThemeActivationStatus: () => ({
    dismiss: () => undefined,
    isDismissed: false,
    isLoading: false,
    reload: async () => undefined,
    status: { isActive: true, activateEmbedUrl: "https://example.com" },
  }),
}));

const dataFixture: MerchantOverviewData = {
  catalog: [],
  config: DEFAULT_PRESSWALL_CONFIG,
  selected: [{ key: "1", publisherId: "pub-1" }],
  selections: [{ publisherId: "pub-1", position: 0 }],
  unavailableCount: 0,
};

const { MerchantOverview } = await import("./merchant-overview");

describe("MerchantOverview render", () => {
  afterEach(() => {
    cleanup();
  });

  test("renders dashboard-specific sections and not editor controls", () => {
    const view = render(<MerchantOverview data={dataFixture} />);

    expect(view.getByText("Quick actions")).toBeTruthy();
    expect(view.getByText("Storefront preview")).toBeTruthy();
    expect(view.getByText("Edit press wall")).toBeTruthy();
    expect(view.getByTestId("read-only-preview")).toBeTruthy();
    expect(view.queryByText("Discard")).toBeNull();
    expect(view.queryByText("Templates")).toBeNull();
  });
});
