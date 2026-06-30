import { SkeletonBlock } from "@/components/presswall/skeleton-block";

export function OnboardingShellSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading onboarding"
      className="flex h-svh flex-col bg-background"
      role="status"
    >
      <div className="flex min-h-0 flex-1 flex-col items-center overflow-y-auto px-6 pt-4">
        <div className="flex w-full max-w-xl flex-1 flex-col gap-6">
          <SkeletonBlock className="mx-auto h-8 w-56 rounded-lg" />
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-28 rounded-xl" />
          <SkeletonBlock className="h-40 rounded-xl bg-muted/40" />
          <div className="mt-auto flex items-center justify-between gap-4 pt-2">
            <SkeletonBlock className="h-8 w-20 rounded-md bg-muted/40" />
            <div className="flex gap-1.5">
              <SkeletonBlock className="h-1.5 w-6 rounded-full" />
              <SkeletonBlock className="size-1.5 rounded-full bg-muted/60" />
              <SkeletonBlock className="size-1.5 rounded-full bg-muted/40" />
            </div>
            <SkeletonBlock className="h-8 w-24 rounded-md bg-muted/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
