"use client";

import {
  IconCircleCheck,
  IconExternalLink,
  IconLoader2,
  IconRefresh,
} from "@tabler/icons-react";
import { useCallback, useEffect, useState } from "react";
import { OnboardingActions } from "@/components/presswall/onboarding-actions";
import { Button } from "@/components/ui/button";
import type { PresswallEditor } from "@/hooks/use-presswall-editor";
import { adminFetch } from "@/lib/admin-fetch";
import type { ThemeActivationStatus } from "@/lib/theme-activation";

interface OnboardingGoLiveStepProps {
  editor: PresswallEditor;
  onBack: () => void;
  onComplete: () => void;
}

const ACTIVATION_STEPS = [
  "Open your theme editor.",
  "Turn on the Presswall app embed.",
  "Save your theme, then click Check status.",
] as const;

function ActivationStatusBadge({
  isActive,
  isChecking,
}: {
  isActive: boolean;
  isChecking: boolean;
}) {
  if (isChecking) {
    return (
      <span className="inline-flex items-center gap-1 text-[0.6875rem] text-muted-foreground">
        <IconLoader2 className="size-3 animate-spin" stroke={2} />
        Checking
      </span>
    );
  }

  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-[0.625rem] text-emerald-700">
        <IconCircleCheck className="size-3" stroke={2.5} />
        Active
      </span>
    );
  }

  return (
    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-medium text-[0.625rem] text-amber-800">
      Action needed
    </span>
  );
}

function ActivationSteps() {
  return (
    <ol className="space-y-3">
      {ACTIVATION_STEPS.map((step, index) => (
        <li className="flex items-start gap-3" key={step}>
          <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border bg-background font-medium text-[0.625rem] tabular-nums">
            {index + 1}
          </span>
          <p className="pt-px text-muted-foreground text-xs leading-relaxed">
            {step}
          </p>
        </li>
      ))}
    </ol>
  );
}

function ActivationActiveState() {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5">
      <IconCircleCheck
        className="mt-0.5 size-4 shrink-0 text-emerald-600"
        stroke={2}
      />
      <div className="min-w-0 space-y-0.5">
        <p className="font-medium text-sm">Presswall is active</p>
        <p className="text-muted-foreground text-xs leading-snug">
          Your press strip is live on your storefront.
        </p>
      </div>
    </div>
  );
}

function ActivationPendingState({
  isCheckingStatus,
  isInitialLoading,
  onCheckStatus,
  onEnable,
  showNotActiveHint,
  status,
}: {
  isCheckingStatus: boolean;
  isInitialLoading: boolean;
  onCheckStatus: () => void;
  onEnable: () => void;
  showNotActiveHint: boolean;
  status: ThemeActivationStatus | null;
}) {
  return (
    <div className="space-y-4">
      <ActivationSteps />

      <div className="space-y-2 border-t pt-4">
        <Button
          className="w-full"
          disabled={!status?.activateEmbedUrl || isInitialLoading}
          onClick={onEnable}
          size="sm"
        >
          <IconExternalLink stroke={2} />
          Enable on storefront
        </Button>

        <Button
          className="w-full"
          disabled={isInitialLoading || isCheckingStatus}
          onClick={onCheckStatus}
          size="sm"
          variant="secondary"
        >
          {isCheckingStatus ? (
            <IconLoader2 className="size-4 animate-spin" stroke={2} />
          ) : (
            <IconRefresh stroke={2} />
          )}
          Check status
        </Button>

        {showNotActiveHint ? (
          <p className="rounded-md bg-amber-500/10 px-3 py-2 text-center text-amber-900 text-xs leading-relaxed">
            Embed not detected yet. Make sure it&apos;s turned on and your theme
            is saved.
          </p>
        ) : null}
      </div>
    </div>
  );
}

export function OnboardingGoLiveStep({
  editor,
  onBack,
  onComplete,
}: OnboardingGoLiveStepProps) {
  const [status, setStatus] = useState<ThemeActivationStatus | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [showNotActiveHint, setShowNotActiveHint] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await adminFetch("/api/theme-activation");
      if (!response.ok) {
        setStatus(null);
        return null;
      }

      const data = (await response.json()) as ThemeActivationStatus;
      setStatus(data);
      return data;
    } catch {
      setStatus(null);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchStatus()
      .catch(() => undefined)
      .finally(() => setIsInitialLoading(false));
  }, [fetchStatus]);

  const handleCheckStatus = () => {
    setIsCheckingStatus(true);
    setShowNotActiveHint(false);

    fetchStatus()
      .then((data) => {
        if (data && !data.isActive) {
          setShowNotActiveHint(true);
        }
      })
      .catch(() => undefined)
      .finally(() => setIsCheckingStatus(false));
  };

  const handleFinish = async () => {
    const saved = await editor.completeOnboarding();
    if (saved) {
      onComplete();
    }
  };

  const isActive = status?.isActive ?? false;
  const isChecking = isInitialLoading || isCheckingStatus;

  const openThemeEditor = () => {
    if (status?.activateEmbedUrl) {
      window.open(status.activateEmbedUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-lg flex-col justify-center gap-4">
      <p className="shrink-0 text-muted-foreground text-xs">
        Step 3 of 3 — Go live on your store
      </p>

      <div className="shrink-0 overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex items-start justify-between gap-3 border-b px-4 py-3">
          <div className="min-w-0 space-y-1">
            <p className="font-medium text-sm">Enable app embed</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Required to show your press strip on the storefront.
            </p>
          </div>
          <ActivationStatusBadge isActive={isActive} isChecking={isChecking} />
        </div>

        <div className="p-4">
          {isActive ? (
            <ActivationActiveState />
          ) : (
            <ActivationPendingState
              isCheckingStatus={isCheckingStatus}
              isInitialLoading={isInitialLoading}
              onCheckStatus={handleCheckStatus}
              onEnable={openThemeEditor}
              showNotActiveHint={showNotActiveHint}
              status={status}
            />
          )}
        </div>
      </div>

      <OnboardingActions
        className="shrink-0 pb-6"
        compact
        nextDisabled={!isActive || isCheckingStatus}
        nextLabel="Open editor"
        nextLoading={editor.isSaving}
        onBack={onBack}
        onNext={() => {
          handleFinish().catch(() => undefined);
        }}
        showBack
      />
    </div>
  );
}
