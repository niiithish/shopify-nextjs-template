"use client";

import { IconDeviceFloppy } from "@tabler/icons-react";
import { CustomOutletForm } from "@/components/presswall/custom-outlet-form";
import { EditorPanel } from "@/components/presswall/editor-panel";
import { PresswallPreview } from "@/components/presswall/preview";
import { PublisherLibrary } from "@/components/presswall/publisher-library";
import { SelectedOutlets } from "@/components/presswall/selected-outlets";
import { StyleControls } from "@/components/presswall/style-controls";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PresswallEditor } from "@/hooks/use-presswall-editor";

interface EditorWorkspaceProps {
  editor: PresswallEditor;
}

export function EditorWorkspace({ editor }: EditorWorkspaceProps) {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-muted/30">
        <PresswallPreview
          catalog={editor.catalog}
          config={editor.config}
          isLoading={editor.isLoading}
          selections={editor.selections}
          variant="canvas"
        />
      </main>

      <EditorPanel>
        <Tabs className="min-h-0 flex-1" defaultValue="outlets">
          <div className="shrink-0 border-b px-3 py-2">
            <TabsList className="grid h-8 w-full grid-cols-2">
              <TabsTrigger value="outlets">
                Outlets
                {editor.selected.length > 0 ? (
                  <span className="ml-1 text-muted-foreground tabular-nums">
                    ({editor.selected.length})
                  </span>
                ) : null}
              </TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            className="min-h-0 flex-1 overflow-y-auto p-3"
            value="outlets"
          >
            <div className="flex flex-col gap-4">
              <PublisherLibrary
                catalog={editor.catalog}
                category={editor.category}
                listClassName="h-56"
                onCategoryChange={editor.setCategory}
                onSearchChange={editor.setSearch}
                onToggle={editor.togglePublisher}
                search={editor.search}
                selectedIds={editor.selectedIds}
              />

              <Separator />

              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="font-medium text-sm">Selected</h3>
                  <p className="text-muted-foreground text-xs">
                    Reorder outlets — the first appears leftmost on your store.
                  </p>
                </div>
                <SelectedOutlets
                  catalogById={editor.catalogById}
                  onMove={editor.movePublisher}
                  onRemove={editor.removePublisher}
                  selected={editor.selected}
                />
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <div>
                  <h3 className="font-medium text-sm">Custom outlet</h3>
                  <p className="text-muted-foreground text-xs">
                    Add a podcast, blog, or outlet not in the library.
                  </p>
                </div>
                <CustomOutletForm compact onAdd={editor.addCustomPublisher} />
              </div>
            </div>
          </TabsContent>

          <TabsContent
            className="min-h-0 flex-1 overflow-y-auto p-3"
            value="appearance"
          >
            <StyleControls
              config={editor.config}
              onUpdate={editor.updateConfig}
            />
          </TabsContent>
        </Tabs>

        <div className="shrink-0 border-t p-3">
          <Button
            className="w-full"
            disabled={editor.isLoading || editor.isSaving}
            onClick={() => {
              editor.save().catch(() => undefined);
            }}
          >
            <IconDeviceFloppy stroke={2} />
            {editor.isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </EditorPanel>
    </div>
  );
}
