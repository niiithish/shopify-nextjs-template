"use client";

import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export type EditorStep = "outlets" | "style" | "publish";

const STEPS: { id: EditorStep; label: string }[] = [
  { id: "outlets", label: "Outlets" },
  { id: "style", label: "Style" },
  { id: "publish", label: "Publish" },
];

interface EditorStepperProps {
  currentStep: EditorStep;
  onStepChange: (step: EditorStep) => void;
}

export function EditorStepper({
  currentStep,
  onStepChange,
}: EditorStepperProps) {
  const currentIndex = STEPS.findIndex((step) => step.id === currentStep);

  return (
    <nav aria-label="Setup progress" className="shrink-0">
      <ol className="flex items-center">
        {STEPS.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = step.id === currentStep;
          const isClickable = index <= currentIndex;
          const isLast = index === STEPS.length - 1;

          return (
            <li className="flex items-center" key={step.id}>
              <button
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-md px-0.5 py-1 text-xs transition-colors",
                  isCurrent && "font-medium text-foreground",
                  isComplete && "text-muted-foreground hover:text-foreground",
                  !(isCurrent || isComplete) &&
                    "cursor-default text-muted-foreground/60",
                  isClickable && !isCurrent && "cursor-pointer"
                )}
                disabled={!isClickable}
                onClick={() => {
                  if (isClickable) {
                    onStepChange(step.id);
                  }
                }}
                type="button"
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border font-medium text-[0.625rem] tabular-nums",
                    isCurrent &&
                      "border-primary bg-primary text-primary-foreground",
                    isComplete &&
                      "border-primary/30 bg-primary/10 text-primary",
                    !(isCurrent || isComplete) && "border-border bg-background"
                  )}
                >
                  {isComplete ? (
                    <IconCheck className="size-3" stroke={3} />
                  ) : (
                    index + 1
                  )}
                </span>
                <span className="truncate">{step.label}</span>
              </button>

              {isLast ? null : (
                <div
                  aria-hidden
                  className={cn(
                    "mx-2 h-px w-6 shrink-0",
                    index < currentIndex ? "bg-primary/40" : "bg-border"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function getNextStep(step: EditorStep): EditorStep | null {
  const index = STEPS.findIndex((item) => item.id === step);
  return STEPS[index + 1]?.id ?? null;
}

export function getPreviousStep(step: EditorStep): EditorStep | null {
  const index = STEPS.findIndex((item) => item.id === step);
  return STEPS[index - 1]?.id ?? null;
}
