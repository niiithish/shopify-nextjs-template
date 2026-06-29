import { describe, expect, test } from "bun:test";
import { DEFAULT_PRESSWALL_CONFIG } from "@/lib/presswall-defaults";
import {
  applyPresswallTemplate,
  findMatchingPresswallTemplateId,
  getPresswallDesignLabel,
  getResolvedPresswallTemplateConfig,
} from "@/lib/presswall-templates";

describe("findMatchingPresswallTemplateId", () => {
  test("matches a pristine classic template config", () => {
    const config = getResolvedPresswallTemplateConfig("classic");

    expect(findMatchingPresswallTemplateId(config)).toBe("classic");
  });

  test("returns null after a custom edit diverges from every template", () => {
    const config = applyPresswallTemplate("classic", DEFAULT_PRESSWALL_CONFIG);

    expect(findMatchingPresswallTemplateId(config)).toBe("classic");

    const customized = { ...config, headingText: "Featured on" };

    expect(findMatchingPresswallTemplateId(customized)).toBeNull();
  });
});

describe("getPresswallDesignLabel", () => {
  test("returns the template name when config still matches a template", () => {
    const config = getResolvedPresswallTemplateConfig("dark");

    expect(getPresswallDesignLabel(config)).toBe("Dark band");
  });

  test("returns Custom when config no longer matches any template", () => {
    const config = {
      ...getResolvedPresswallTemplateConfig("classic"),
      gap: 31,
    };

    expect(getPresswallDesignLabel(config)).toBe("Custom");
  });
});
