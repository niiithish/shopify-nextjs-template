"use client";

import {
  IconArrowLeft,
  IconArrowRight,
  IconDeviceFloppy,
  IconEye,
  IconList,
  IconRocket,
} from "@tabler/icons-react";
import { useState } from "react";
import { CustomOutletForm } from "@/components/presswall/custom-outlet-form";
import {
  type EditorStep,
  EditorStepper,
  getNextStep,
  getPreviousStep,
} from "@/components/presswall/editor-stepper";
import { PresswallPreview } from "@/components/presswall/preview";
import { PublisherLibrary } from "@/components/presswall/publisher-library";
import { SelectedOutlets } from "@/components/presswall/selected-outlets";
import { StyleControls } from "@/components/presswall/style-controls";
import { ThemeActivationDialog } from "@/components/presswall/theme-activation-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { PresswallEditor } from "@/hooks/use-presswall-editor";

interface PresswallEditorPanelProps {
  editor: PresswallEditor;
}

export function PresswallEditorPanel({ editor }: PresswallEditorPanelProps) {
  const [currentStep, setCurrentStep] = useState<EditorStep>("outlets");
  const [customDialogOpen, setCustomDialogOpen] = useState(false);
  const [customFormKey, setCustomFormKey] = useState(0);
  const [lineupSheetOpen, setLineupSheetOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

  const nextStep = getNextStep(currentStep);
  const previousStep = getPreviousStep(currentStep);

  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex w-full items-center gap-4 px-4 py-3 sm:px-6">
          <EditorStepper
            currentStep={currentStep}
            onStepChange={setCurrentStep}
          />

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Dialog
              onOpenChange={setPreviewDialogOpen}
              open={previewDialogOpen}
            >
              <DialogTrigger
                render={
                  <Button size="sm" variant="outline">
                    <IconEye stroke={2} />
                    Live preview
                  </Button>
                }
              />
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Live preview</DialogTitle>
                  <DialogDescription>
                    How your presswall will look on the storefront.
                  </DialogDescription>
                </DialogHeader>
                <PresswallPreview
                  catalog={editor.catalog}
                  config={editor.config}
                  isLoading={editor.isLoading}
                  selections={editor.selections}
                />
              </DialogContent>
            </Dialog>

            {currentStep === "publish" ? (
              <ThemeActivationDialog
                isDirty={editor.isDirty}
                trigger={
                  <Button disabled={editor.isDirty} size="sm">
                    <IconRocket stroke={2} />
                    Publish
                  </Button>
                }
              />
            ) : (
              <Button
                disabled={
                  editor.isLoading || editor.isSaving || !editor.isDirty
                }
                onClick={() => {
                  editor.save().catch(() => undefined);
                }}
                size="sm"
              >
                <IconDeviceFloppy stroke={2} />
                {editor.isSaving ? "Saving..." : "Save"}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-4">
        {editor.unavailableCount > 0 ? (
          <Alert className="mb-4" variant="destructive">
            <AlertTitle>Some outlets are no longer available</AlertTitle>
            <AlertDescription>
              {editor.unavailableCount} previously selected outlet
              {editor.unavailableCount === 1 ? "" : "s"} will not show on your
              storefront.
            </AlertDescription>
          </Alert>
        ) : null}

        {currentStep === "outlets" ? (
          <section className="flex min-h-0 flex-1 flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="font-medium text-sm">Press library</h2>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {editor.selected.length} selected · {editor.catalog.length}{" "}
                  available
                </p>
              </div>

              <Sheet onOpenChange={setLineupSheetOpen} open={lineupSheetOpen}>
                <SheetTrigger
                  render={
                    <Button size="sm" variant="outline">
                      <IconList stroke={2} />
                      Change order
                      {editor.selected.length > 0 ? (
                        <Badge
                          className="ml-1 tabular-nums"
                          variant="secondary"
                        >
                          {editor.selected.length}
                        </Badge>
                      ) : null}
                    </Button>
                  }
                />
                <SheetContent className="flex w-full flex-col sm:max-w-sm">
                  <SheetHeader>
                    <SheetTitle>Your lineup</SheetTitle>
                    <SheetDescription>
                      Drag logos to reorder. Left-to-right on your storefront.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="min-h-0 flex-1 overflow-hidden px-4 pb-4">
                    <SelectedOutlets
                      catalogById={editor.catalogById}
                      className="h-[calc(100vh-8rem)]"
                      onRemove={editor.removePublisher}
                      onReorder={editor.reorderPublisher}
                      selected={editor.selected}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <Dialog onOpenChange={setCustomDialogOpen} open={customDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload custom outlet</DialogTitle>
                  <DialogDescription>
                    Add a logo that isn&apos;t in the press library.
                  </DialogDescription>
                </DialogHeader>
                <CustomOutletForm
                  key={customFormKey}
                  onAdd={(name, svg) => {
                    editor.addCustomPublisher(name, svg);
                    setCustomDialogOpen(false);
                  }}
                />
              </DialogContent>
            </Dialog>

            <PublisherLibrary
              catalog={editor.catalog}
              category={editor.category}
              listClassName="h-[min(52vh,420px)]"
              onAddCustom={() => {
                setCustomFormKey((key) => key + 1);
                setCustomDialogOpen(true);
              }}
              onCategoryChange={editor.setCategory}
              onSearchChange={editor.setSearch}
              onToggle={editor.togglePublisher}
              search={editor.search}
              selected={editor.selected}
              variant="grid"
            />
          </section>
        ) : null}

        {currentStep === "style" ? (
          <section className="flex flex-col gap-3">
            <div>
              <h2 className="font-medium text-sm">Appearance</h2>
              <p className="text-muted-foreground text-xs">
                Open one section at a time. Changes update the preview
                instantly.
              </p>
            </div>
            <StyleControls
              config={editor.config}
              onUpdate={editor.updateConfig}
            />
          </section>
        ) : null}

        {currentStep === "publish" ? (
          <section className="flex flex-col gap-4">
            <div>
              <h2 className="font-medium text-sm">Ready to go live</h2>
              <p className="text-muted-foreground text-xs">
                Save your settings, then add Presswall to your Shopify theme.
              </p>
            </div>

            <PresswallPreview
              catalog={editor.catalog}
              config={editor.config}
              isLoading={editor.isLoading}
              selections={editor.selections}
            />

            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="font-medium text-sm">Add to your store</p>
              <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                {editor.isDirty
                  ? "Save your changes before opening the theme editor."
                  : "Choose an app embed for site-wide display, or a section block for one page."}
              </p>
              <div className="mt-3">
                <ThemeActivationDialog
                  isDirty={editor.isDirty}
                  trigger={
                    <Button disabled={editor.isDirty} size="sm">
                      <IconRocket stroke={2} />
                      Add to theme
                    </Button>
                  }
                />
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <footer className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex w-full items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Button
            disabled={!previousStep}
            onClick={() => {
              if (previousStep) {
                setCurrentStep(previousStep);
              }
            }}
            size="sm"
            variant="outline"
          >
            <IconArrowLeft stroke={2} />
            Back
          </Button>

          {nextStep ? (
            <Button
              onClick={() => {
                setCurrentStep(nextStep);
              }}
              size="sm"
            >
              Continue
              <IconArrowRight stroke={2} />
            </Button>
          ) : null}
        </div>
      </footer>
    </div>
  );
}
