"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { hexForColorInput, normalizeHexColor } from "@/lib/color-input";
import { cn } from "@/lib/utils";

interface ColorFieldProps {
  allowTransparent?: boolean;
  className?: string;
  fallbackHex?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}

export function ColorField({
  id,
  label,
  value,
  onChange,
  allowTransparent = false,
  fallbackHex = "#111111",
  className,
}: ColorFieldProps) {
  const [draft, setDraft] = useState(value);
  const isTransparent =
    allowTransparent && value.trim().toLowerCase() === "transparent";
  const pickerValue = hexForColorInput(value, fallbackHex);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const commitTextValue = (raw: string) => {
    const trimmed = raw.trim();

    if (allowTransparent && trimmed.toLowerCase() === "transparent") {
      onChange("transparent");
      setDraft("transparent");
      return;
    }

    const normalized = normalizeHexColor(trimmed);
    if (normalized) {
      onChange(normalized);
      setDraft(normalized);
    }
  };

  const handlePickerChange = (next: string) => {
    const normalized = normalizeHexColor(next);
    if (normalized) {
      onChange(normalized);
      setDraft(normalized);
    }
  };

  const handleTextChange = (raw: string) => {
    setDraft(raw);
    commitTextValue(raw);
  };

  const handleTextBlur = () => {
    if (draft === value) {
      return;
    }

    const trimmed = draft.trim();
    const isValid =
      (allowTransparent && trimmed.toLowerCase() === "transparent") ||
      normalizeHexColor(trimmed) !== null;

    if (!isValid) {
      setDraft(value);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "relative size-9 shrink-0 overflow-hidden rounded-md border",
            isTransparent && "presswall-canvas-bg"
          )}
        >
          <input
            aria-label={`${label} picker`}
            className="size-full cursor-pointer border-0 bg-transparent p-0 disabled:cursor-not-allowed disabled:opacity-50"
            id={id}
            onChange={(event) => handlePickerChange(event.target.value)}
            type="color"
            value={pickerValue}
          />
        </div>
        <input
          className="h-9 min-w-0 flex-1 rounded-md border border-input bg-transparent px-2 font-mono text-xs shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          onBlur={handleTextBlur}
          onChange={(event) => handleTextChange(event.target.value)}
          placeholder={allowTransparent ? "transparent" : "#111111"}
          spellCheck={false}
          value={draft}
        />
        {allowTransparent ? (
          <button
            className={cn(
              "shrink-0 rounded-md border px-2 py-1.5 text-xs transition-colors",
              isTransparent
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input text-muted-foreground hover:bg-muted"
            )}
            onClick={() => onChange("transparent")}
            type="button"
          >
            None
          </button>
        ) : null}
      </div>
    </div>
  );
}
