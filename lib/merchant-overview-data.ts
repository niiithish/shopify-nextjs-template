import type { PresswallEditor } from "@/hooks/use-presswall-editor";
import type {
  PresswallConfig,
  PublisherCatalogItem,
  SelectedPublisher,
  ShopPublisherSelection,
} from "@/lib/presswall-types";

export interface MerchantOverviewData {
  catalog: PublisherCatalogItem[];
  config: PresswallConfig;
  selected: SelectedPublisher[];
  selections: ShopPublisherSelection[];
  unavailableCount: number;
}

export function merchantOverviewFromEditor(
  editor: PresswallEditor
): MerchantOverviewData {
  return {
    catalog: editor.catalog,
    config: editor.config,
    selected: editor.selected,
    selections: editor.selections,
    unavailableCount: editor.unavailableCount,
  };
}
