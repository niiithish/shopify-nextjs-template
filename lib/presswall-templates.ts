import { DEFAULT_PRESSWALL_CONFIG } from "@/lib/presswall-defaults";
import { isDarkBackgroundColor } from "@/lib/presswall-logo-contrast";
import { withDerivedSpacing } from "@/lib/presswall-spacing";
import type { PresswallConfig } from "@/lib/presswall-types";

export type PresswallTemplateId = "classic" | "dark" | "marquee" | "soft-card";

export interface PresswallTemplate {
  config: Partial<PresswallConfig>;
  description: string;
  id: PresswallTemplateId;
  name: string;
}

export const PRESSWALL_TEMPLATES: PresswallTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description: "Centered heading with a clean horizontal logo bar.",
    config: {
      headingText: "As seen on",
      showHeading: true,
      colorMode: "mono",
      layout: "bar",
      headingAlignment: "center",
      logoAlignment: "center",
      backgroundColor: "transparent",
      textColor: "#111111",
      borderRadius: 0,
      paddingY: 16,
      paddingX: 16,
      logoHeight: 32,
      headingFontSize: 16,
    },
  },
  {
    id: "dark",
    name: "Dark band",
    description: "Bold dark strip that pops on light storefront pages.",
    config: {
      headingText: "As seen on",
      showHeading: true,
      colorMode: "mono",
      layout: "bar",
      headingAlignment: "center",
      logoAlignment: "center",
      backgroundColor: "#0a0a0a",
      textColor: "#fafafa",
      borderRadius: 0,
      paddingY: 20,
      paddingX: 24,
      logoHeight: 32,
      headingFontSize: 16,
    },
  },
  {
    id: "marquee",
    name: "Auto-scroll",
    description: "Continuous scroll — great when you have many outlets.",
    config: {
      headingText: "Featured in",
      showHeading: true,
      colorMode: "mono",
      layout: "marquee",
      headingAlignment: "left",
      logoAlignment: "left",
      backgroundColor: "transparent",
      textColor: "#111111",
      headingFontSize: 14,
      borderRadius: 0,
      paddingY: 16,
      paddingX: 16,
      logoHeight: 20,
      gap: 50,
      marqueeSpeed: 30,
    },
  },
  {
    id: "soft-card",
    name: "Soft card",
    description: "Rounded card on a light background with muted logos.",
    config: {
      headingText: "Featured in",
      showHeading: true,
      colorMode: "muted",
      layout: "bar",
      headingAlignment: "center",
      logoAlignment: "center",
      backgroundColor: "#f4f4f5",
      textColor: "#18181b",
      borderRadius: 12,
      paddingY: 24,
      paddingX: 24,
      logoHeight: 30,
      headingFontSize: 16,
      grayscaleOpacity: 65,
    },
  },
];

export const DEFAULT_PRESSWALL_TEMPLATE_ID: PresswallTemplateId = "classic";

export function getConfigPreviewTheme(
  config: PresswallConfig
): "light" | "dark" {
  if (isDarkBackgroundColor(config.backgroundColor)) {
    return "dark";
  }
  return "light";
}

export function getTemplatePreviewTheme(
  templateId: PresswallTemplateId
): "light" | "dark" {
  return templateId === "dark" ? "dark" : "light";
}

export function getPresswallTemplate(
  id: PresswallTemplateId
): PresswallTemplate {
  const template = PRESSWALL_TEMPLATES.find((item) => item.id === id);
  if (!template) {
    throw new Error(`Unknown presswall template: ${id}`);
  }
  return template;
}

export function applyPresswallTemplate(
  templateId: PresswallTemplateId
): PresswallConfig {
  const template = getPresswallTemplate(templateId);
  const explicitGap = template.config.gap;
  const explicitHeadingSpacing = template.config.headingSpacing;
  const resolved = withDerivedSpacing({
    ...DEFAULT_PRESSWALL_CONFIG,
    ...template.config,
  });

  return {
    ...resolved,
    ...(explicitGap === undefined ? {} : { gap: explicitGap }),
    ...(explicitHeadingSpacing === undefined
      ? {}
      : { headingSpacing: explicitHeadingSpacing }),
  };
}

const PRESSWALL_CONFIG_KEYS = Object.keys(
  DEFAULT_PRESSWALL_CONFIG
) as (keyof PresswallConfig)[];

export function presswallConfigsEqual(
  left: PresswallConfig,
  right: PresswallConfig
): boolean {
  return PRESSWALL_CONFIG_KEYS.every((key) => left[key] === right[key]);
}

export function getResolvedPresswallTemplateConfig(
  templateId: PresswallTemplateId
): PresswallConfig {
  return applyPresswallTemplate(templateId);
}

export function findMatchingPresswallTemplateId(
  config: PresswallConfig
): PresswallTemplateId | null {
  for (const template of PRESSWALL_TEMPLATES) {
    if (
      presswallConfigsEqual(
        config,
        getResolvedPresswallTemplateConfig(template.id)
      )
    ) {
      return template.id;
    }
  }

  return null;
}

export function getPresswallDesignLabel(config: PresswallConfig): string {
  const matchedTemplateId = findMatchingPresswallTemplateId(config);
  if (!matchedTemplateId) {
    return "Custom";
  }

  return getPresswallTemplate(matchedTemplateId).name;
}
