import { DEFAULT_PRESSWALL_CONFIG } from "@/lib/presswall-defaults";
import { isDarkBackgroundColor } from "@/lib/presswall-logo-contrast";
import type { PresswallConfig } from "@/lib/presswall-types";

export type PresswallTemplateId =
  | "classic"
  | "dark"
  | "marquee"
  | "grid"
  | "editorial"
  | "soft-card";

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
      alignment: "center",
      backgroundColor: "transparent",
      textColor: "#111111",
      borderRadius: 0,
      paddingY: 16,
      paddingX: 16,
      logoHeight: 32,
      gap: 24,
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
      alignment: "center",
      backgroundColor: "#0a0a0a",
      textColor: "#fafafa",
      borderRadius: 0,
      paddingY: 20,
      paddingX: 24,
      logoHeight: 32,
      gap: 24,
    },
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Left-aligned label with muted logos for a magazine feel.",
    config: {
      headingText: "Press mentions",
      showHeading: true,
      colorMode: "muted",
      layout: "bar",
      alignment: "left",
      backgroundColor: "transparent",
      textColor: "#111111",
      borderRadius: 0,
      paddingY: 12,
      paddingX: 0,
      logoHeight: 28,
      gap: 20,
      grayscaleOpacity: 60,
    },
  },
  {
    id: "marquee",
    name: "Auto-scroll",
    description: "Continuous scroll — great when you have many outlets.",
    config: {
      showHeading: false,
      colorMode: "mono",
      layout: "marquee",
      alignment: "center",
      backgroundColor: "transparent",
      textColor: "#111111",
      borderRadius: 0,
      paddingY: 16,
      paddingX: 16,
      logoHeight: 28,
      gap: 32,
      marqueeSpeed: 30,
    },
  },
  {
    id: "grid",
    name: "Grid",
    description: "Even grid with soft grayscale logos.",
    config: {
      headingText: "As seen on",
      showHeading: true,
      colorMode: "muted",
      layout: "grid",
      alignment: "center",
      backgroundColor: "transparent",
      textColor: "#111111",
      borderRadius: 0,
      paddingY: 20,
      paddingX: 16,
      logoHeight: 32,
      gap: 20,
      grayscaleOpacity: 70,
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
      alignment: "center",
      backgroundColor: "#f4f4f5",
      textColor: "#18181b",
      borderRadius: 12,
      paddingY: 24,
      paddingX: 24,
      logoHeight: 30,
      gap: 24,
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
  templateId: PresswallTemplateId,
  current: PresswallConfig = DEFAULT_PRESSWALL_CONFIG
): PresswallConfig {
  const template = getPresswallTemplate(templateId);
  return {
    ...DEFAULT_PRESSWALL_CONFIG,
    ...current,
    ...template.config,
  };
}
