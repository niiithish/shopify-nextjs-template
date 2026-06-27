"use client";

import {
  IconArrowRight,
  IconBuildingStore,
  IconCheck,
  IconExternalLink,
  IconPalette,
  IconPlus,
  IconSparkles,
} from "@tabler/icons-react";
import { CustomOutletForm } from "@/components/presswall/custom-outlet-form";
import { PresswallPreview } from "@/components/presswall/preview";
import { PublisherLibrary } from "@/components/presswall/publisher-library";
import { SelectedOutlets } from "@/components/presswall/selected-outlets";
import { StyleControls } from "@/components/presswall/style-controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import type { PresswallEditor } from "@/hooks/use-presswall-editor";

interface PresswallOverviewProps {
  editor: PresswallEditor;
  onEditStyle: () => void;
  onOpenWizard: () => void;
}

const getOutletLabel = (count: number) =>
  `${count} outlet${count === 1 ? "" : "s"}`;

export function PresswallOverview({
  editor,
  onOpenWizard,
  onEditStyle,
}: PresswallOverviewProps) {
  const hasSelections = editor.selected.length > 0;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 border-b pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant={hasSelections ? "default" : "outline"}>
              {getOutletLabel(editor.selected.length)}
            </Badge>
            <Badge variant="outline">{editor.config.layout}</Badge>
          </div>
          <h1 className="font-heading font-semibold text-2xl tracking-normal">
            Build your As Seen On section
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Choose trusted outlets, tune the layout, preview the storefront, and
            save it for Shopify in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            disabled={editor.isLoading}
            onClick={onEditStyle}
            variant="outline"
          >
            <IconPalette stroke={2} />
            Style
          </Button>
          <Button disabled={editor.isLoading} onClick={onOpenWizard}>
            Guided setup
            <IconArrowRight stroke={2} />
          </Button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_28rem]">
        <div className="flex min-w-0 flex-col gap-5">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                  <IconBuildingStore stroke={2} />
                </div>
                <div>
                  <CardTitle>Choose outlets</CardTitle>
                  <CardDescription>
                    Search the library, add logos, then order them by trust
                    signal.
                  </CardDescription>
                </div>
              </div>
              <CardAction>
                <Badge variant="secondary">
                  {editor.catalog.length} built in
                </Badge>
              </CardAction>
            </CardHeader>

            <CardContent className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
              <div className="min-w-0">
                <PublisherLibrary
                  catalog={editor.catalog}
                  category={editor.category}
                  idPrefix="builder-publisher"
                  listClassName="h-[24rem]"
                  onCategoryChange={editor.setCategory}
                  onSearchChange={editor.setSearch}
                  onToggle={editor.togglePublisher}
                  search={editor.search}
                  selectedIds={editor.selectedIds}
                />
              </div>

              <div className="flex min-w-0 flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-medium text-sm">Selected order</h2>
                    <p className="text-muted-foreground text-xs">
                      The first logo carries the most visual weight.
                    </p>
                  </div>
                  <Badge variant={hasSelections ? "secondary" : "outline"}>
                    {getOutletLabel(editor.selected.length)}
                  </Badge>
                </div>

                <SelectedOutlets
                  catalogById={editor.catalogById}
                  className="max-h-[18rem] overflow-y-auto pr-1"
                  onMove={editor.movePublisher}
                  onRemove={editor.removePublisher}
                  selected={editor.selected}
                />

                <details className="rounded-lg border bg-muted/20">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 font-medium text-sm marker:hidden">
                    <span className="flex items-center gap-2">
                      <IconPlus className="size-4 text-muted-foreground" />
                      Add custom outlet
                    </span>
                    <span className="text-muted-foreground text-xs">
                      SVG logo
                    </span>
                  </summary>
                  <div className="border-t p-3">
                    <CustomOutletForm
                      compact
                      onAdd={editor.addCustomPublisher}
                    />
                  </div>
                </details>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                  <IconPalette stroke={2} />
                </div>
                <div>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Keep the section compact, credible, and easy to scan.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <StyleControls
                config={editor.config}
                onUpdate={editor.updateConfig}
              />
            </CardContent>
          </Card>
        </div>

        <aside className="flex min-w-0 flex-col gap-5 xl:sticky xl:top-5 xl:self-start">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                  <IconSparkles stroke={2} />
                </div>
                <div>
                  <CardTitle>Storefront preview</CardTitle>
                  <CardDescription>
                    Check spacing and logo weight before saving.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {hasSelections ? (
                <PresswallPreview
                  catalog={editor.catalog}
                  config={editor.config}
                  selections={editor.selections}
                  showHeader={false}
                />
              ) : (
                <Empty className="min-h-56 border-dashed">
                  <EmptyHeader>
                    <EmptyTitle>Pick outlets to preview</EmptyTitle>
                    <EmptyDescription>
                      Selected logos appear here immediately.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
          </Card>

          <Card size="sm">
            <CardHeader>
              <CardTitle>Publish to Shopify</CardTitle>
              <CardDescription>
                Save changes, then add the Presswall app block in your theme.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="grid gap-3 text-sm">
                <li className="flex gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <IconCheck className="size-3" stroke={2} />
                  </span>
                  <span>
                    Choose the outlets and order you want shoppers to see.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-muted-foreground">
                    2
                  </span>
                  <span>
                    Save changes with the sticky button at the bottom.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-muted-foreground">
                    3
                  </span>
                  <span>
                    In Shopify, open Online Store &gt; Customize &gt; Apps &gt;
                    Presswall.
                  </span>
                </li>
              </ol>

              <Button
                className="mt-4 w-full"
                disabled={editor.isLoading}
                onClick={onOpenWizard}
                variant="outline"
              >
                Review guided setup
                <IconExternalLink stroke={2} />
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
