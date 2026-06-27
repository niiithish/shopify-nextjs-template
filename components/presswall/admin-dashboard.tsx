"use client";

import { IconDeviceFloppy } from "@tabler/icons-react";
import { useState } from "react";
import { PresswallOverview } from "@/components/presswall/presswall-overview";
import { SetupWizard } from "@/components/presswall/setup-wizard";
import { ThemeActivationBanner } from "@/components/presswall/theme-activation-banner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { usePresswallEditor } from "@/hooks/use-presswall-editor";

export function AdminDashboard() {
  const editor = usePresswallEditor();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);

  const openWizard = (step = 0) => {
    setWizardStep(step);
    setWizardOpen(true);
  };

  return (
    <div className="flex min-h-svh flex-col">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 p-4 sm:p-6">
        <ThemeActivationBanner />

        {editor.unavailableCount > 0 ? (
          <Alert variant="destructive">
            <AlertTitle>Some outlets are no longer available</AlertTitle>
            <AlertDescription>
              {editor.unavailableCount} previously selected outlet
              {editor.unavailableCount === 1 ? "" : "s"} no longer appear in the
              library and will not show on your storefront. Remove them or save
              to update your presswall.
            </AlertDescription>
          </Alert>
        ) : null}

        <PresswallOverview
          editor={editor}
          onEditStyle={() => openWizard(1)}
          onOpenWizard={() => openWizard(0)}
        />
      </div>

      <SetupWizard
        editor={editor}
        initialStep={wizardStep}
        onOpenChange={setWizardOpen}
        open={wizardOpen}
      />

      <div className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 p-4">
          <div className="min-w-0">
            <p className="font-medium text-sm">
              {editor.selected.length} outlet
              {editor.selected.length === 1 ? "" : "s"} ready for your section
            </p>
            <p className="truncate text-muted-foreground text-xs">
              Save here, then add Presswall from Online Store &gt; Customize
              &gt; Apps.
            </p>
          </div>
          <Button
            disabled={editor.isLoading || editor.isSaving}
            onClick={() => {
              editor.save().catch(() => undefined);
            }}
            size="lg"
          >
            <IconDeviceFloppy stroke={2} />
            {editor.isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
