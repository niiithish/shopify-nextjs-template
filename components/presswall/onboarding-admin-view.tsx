"use client";

import { OnboardingFlow } from "@/components/presswall/onboarding-flow";
import type { PresswallEditor } from "@/hooks/use-presswall-editor";

interface OnboardingAdminViewProps {
  editor: PresswallEditor;
}

export function OnboardingAdminView({ editor }: OnboardingAdminViewProps) {
  return <OnboardingFlow editor={editor} />;
}
