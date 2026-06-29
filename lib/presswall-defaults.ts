import { withDerivedSpacing } from "@/lib/presswall-spacing";
import type { PresswallConfig } from "@/lib/presswall-types";

const BASE_PRESSWALL_CONFIG = {
  headingText: "As seen on",
  showHeading: true,
  headingFontSize: 16,
  colorMode: "mono",
  layout: "bar",
  logoHeight: 32,
  logosPerRowDesktop: 4,
  logosPerRowMobile: 2,
  alignment: "center",
  backgroundColor: "transparent",
  textColor: "#111111",
  borderRadius: 0,
  paddingY: 16,
  paddingX: 16,
  marqueeSpeed: 30,
  grayscaleOpacity: 70,
} satisfies Omit<PresswallConfig, "gap" | "headingSpacing">;

export const DEFAULT_PRESSWALL_CONFIG: PresswallConfig = withDerivedSpacing(
  BASE_PRESSWALL_CONFIG as PresswallConfig
);
