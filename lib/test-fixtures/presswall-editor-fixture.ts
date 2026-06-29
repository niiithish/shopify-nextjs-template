import type { PresswallEditor } from "@/hooks/use-presswall-editor";
import { DEFAULT_PRESSWALL_CONFIG } from "@/lib/presswall-defaults";

export function createPresswallEditorFixture(
  overrides: Partial<PresswallEditor> = {}
): PresswallEditor {
  return {
    addCustomPublisher: () => undefined,
    applyTemplate: () => undefined,
    catalog: [],
    catalogById: new Map(),
    category: "All",
    completeOnboarding: async () => true,
    config: DEFAULT_PRESSWALL_CONFIG,
    discard: () => undefined,
    isDirty: false,
    isLoading: false,
    isSaving: false,
    loadError: false,
    matchedTemplateId: "classic",
    needsOnboarding: true,
    reload: async () => undefined,
    removePublisher: () => undefined,
    save: async () => undefined,
    search: "",
    selected: [{ key: "pub-1", publisherId: "pub-1" }],
    selectedIds: new Set(["pub-1"]),
    selections: [{ publisherId: "pub-1", position: 0 }],
    setCategory: () => undefined,
    setNeedsOnboarding: () => undefined,
    setSearch: () => undefined,
    togglePublisher: () => undefined,
    unavailableCount: 0,
    updateConfig: () => undefined,
    ...overrides,
  };
}
