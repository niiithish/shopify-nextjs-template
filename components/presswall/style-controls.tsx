"use client";

import {
  type Icon,
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconArrowsMoveHorizontal,
  IconColorFilter,
  IconColorSwatch,
  IconLayoutColumns,
  IconLayoutGrid,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PresswallConfig } from "@/lib/presswall-types";
import { cn } from "@/lib/utils";

function sliderValue(value: number | readonly number[]): number {
  if (typeof value === "number") {
    return value;
  }
  return value[0] ?? 0;
}

const HEX_COLOR_PATTERN = /^#[\da-f]{6}$/i;

const LAYOUT_OPTIONS: {
  description: string;
  icon: Icon;
  label: string;
  value: PresswallConfig["layout"];
}[] = [
  {
    value: "bar",
    icon: IconLayoutColumns,
    label: "Bar",
    description: "Best for one clean row under a hero or product section.",
  },
  {
    value: "grid",
    icon: IconLayoutGrid,
    label: "Grid",
    description: "Best when you have many outlets and want equal weight.",
  },
  {
    value: "marquee",
    icon: IconArrowsMoveHorizontal,
    label: "Marquee",
    description: "Best for a compact moving trust strip.",
  },
];

const COLOR_MODE_OPTIONS: {
  description: string;
  icon: Icon;
  label: string;
  value: PresswallConfig["colorMode"];
}[] = [
  {
    value: "mono",
    icon: IconColorFilter,
    label: "Mono",
    description: "Most polished for mixed media logos.",
  },
  {
    value: "muted",
    icon: IconColorSwatch,
    label: "Muted",
    description: "Soft grayscale for quieter sections.",
  },
  {
    value: "color",
    icon: IconColorSwatch,
    label: "Color",
    description: "Original brand colors for maximum recognition.",
  },
];

const ALIGNMENT_OPTIONS: {
  value: PresswallConfig["alignment"];
  icon: Icon;
  label: string;
}[] = [
  { value: "left", icon: IconAlignLeft, label: "Left" },
  { value: "center", icon: IconAlignCenter, label: "Center" },
  { value: "right", icon: IconAlignRight, label: "Right" },
];

interface StyleControlsProps {
  config: PresswallConfig;
  onUpdate: <K extends keyof PresswallConfig>(
    key: K,
    value: PresswallConfig[K]
  ) => void;
}

interface ColorInputProps {
  id: string;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
}

function ColorInput({
  id,
  label,
  value,
  placeholder,
  onChange,
}: ColorInputProps) {
  const colorPickerValue = HEX_COLOR_PATTERN.test(value) ? value : "#ffffff";

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <input
          aria-label={`${label} color picker`}
          className="absolute top-1/2 left-1.5 size-4 -translate-y-1/2 cursor-pointer rounded border border-border bg-transparent p-0"
          onChange={(event) => onChange(event.target.value)}
          type="color"
          value={colorPickerValue}
        />
        <Input
          className="pl-8 font-mono"
          id={id}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
      </div>
    </div>
  );
}

export function StyleControls({ config, onUpdate }: StyleControlsProps) {
  return (
    <div className="grid gap-6">
      <section className="grid gap-3">
        <div className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Label htmlFor="show-heading">Section heading</Label>
            <p className="text-muted-foreground text-xs">
              Keep it short so the logos stay the focus.
            </p>
          </div>
          <Switch
            checked={config.showHeading}
            id="show-heading"
            onCheckedChange={(checked) => onUpdate("showHeading", checked)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="heading-text">Heading text</Label>
          <Input
            disabled={!config.showHeading}
            id="heading-text"
            onChange={(event) => onUpdate("headingText", event.target.value)}
            placeholder="As seen on"
            value={config.headingText}
          />
        </div>
      </section>

      <section className="grid gap-3">
        <div>
          <h2 className="font-medium text-sm">Layout</h2>
          <p className="text-muted-foreground text-xs">
            Pick the shape that fits where this section will live.
          </p>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          {LAYOUT_OPTIONS.map((option) => {
            const OptionIcon = option.icon;
            const isActive = config.layout === option.value;

            return (
              <button
                className={cn(
                  "flex min-h-24 flex-col items-start justify-between rounded-lg border bg-background p-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                  isActive && "border-primary bg-muted"
                )}
                key={option.value}
                onClick={() => onUpdate("layout", option.value)}
                type="button"
              >
                <span className="flex w-full items-center justify-between gap-2">
                  <span className="flex items-center gap-2 font-medium text-sm">
                    <OptionIcon className="size-4" stroke={2} />
                    {option.label}
                  </span>
                  {isActive ? (
                    <span className="rounded-full bg-primary px-1.5 py-0.5 text-[0.625rem] text-primary-foreground">
                      Active
                    </span>
                  ) : null}
                </span>
                <span className="mt-3 text-muted-foreground text-xs">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_14rem]">
          <div className="grid gap-2">
            <Label>Spacing ({config.gap}px)</Label>
            <Slider
              max={64}
              min={8}
              onValueChange={(value) => onUpdate("gap", sliderValue(value))}
              step={2}
              value={[config.gap]}
            />
          </div>

          <div className="grid gap-2">
            <Label>Alignment</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {ALIGNMENT_OPTIONS.map((option) => {
                const AlignIcon = option.icon;

                return (
                  <Tooltip key={option.value}>
                    <TooltipTrigger
                      render={
                        <Button
                          aria-label={`Align ${option.label.toLowerCase()}`}
                          className={cn(
                            config.alignment === option.value &&
                              "border-ring bg-muted"
                          )}
                          onClick={() => onUpdate("alignment", option.value)}
                          size="icon-lg"
                          variant="outline"
                        />
                      }
                    >
                      <AlignIcon stroke={2} />
                    </TooltipTrigger>
                    <TooltipContent>{option.label}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3">
        <div>
          <h2 className="font-medium text-sm">Logo treatment</h2>
          <p className="text-muted-foreground text-xs">
            Normalize mismatched publisher marks so the row feels intentional.
          </p>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          {COLOR_MODE_OPTIONS.map((option) => {
            const OptionIcon = option.icon;
            const isActive = config.colorMode === option.value;

            return (
              <button
                className={cn(
                  "flex min-h-20 flex-col items-start rounded-lg border bg-background p-3 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
                  isActive && "border-primary bg-muted"
                )}
                key={option.value}
                onClick={() => onUpdate("colorMode", option.value)}
                type="button"
              >
                <span className="flex items-center gap-2 font-medium text-sm">
                  <OptionIcon className="size-4" stroke={2} />
                  {option.label}
                </span>
                <span className="mt-2 text-muted-foreground text-xs">
                  {option.description}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label>Logo height ({config.logoHeight}px)</Label>
            <Slider
              max={80}
              min={16}
              onValueChange={(value) =>
                onUpdate("logoHeight", sliderValue(value))
              }
              step={2}
              value={[config.logoHeight]}
            />
          </div>

          {config.colorMode === "muted" ? (
            <div className="grid gap-2">
              <Label>Muted opacity ({config.grayscaleOpacity}%)</Label>
              <Slider
                max={100}
                min={20}
                onValueChange={(value) =>
                  onUpdate("grayscaleOpacity", sliderValue(value))
                }
                step={5}
                value={[config.grayscaleOpacity]}
              />
            </div>
          ) : null}
        </div>
      </section>

      <section className="grid gap-3">
        <div>
          <h2 className="font-medium text-sm">Section container</h2>
          <p className="text-muted-foreground text-xs">
            Match the surrounding Shopify section without wasting vertical
            space.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ColorInput
            id="text-color"
            label="Text color"
            onChange={(value) => onUpdate("textColor", value)}
            value={config.textColor}
          />
          <ColorInput
            id="background-color"
            label="Background"
            onChange={(value) => onUpdate("backgroundColor", value)}
            placeholder="transparent"
            value={config.backgroundColor}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="grid gap-2">
            <Label>Top/bottom padding ({config.paddingY}px)</Label>
            <Slider
              max={80}
              min={0}
              onValueChange={(value) =>
                onUpdate("paddingY", sliderValue(value))
              }
              step={2}
              value={[config.paddingY]}
            />
          </div>
          <div className="grid gap-2">
            <Label>Side padding ({config.paddingX}px)</Label>
            <Slider
              max={80}
              min={0}
              onValueChange={(value) =>
                onUpdate("paddingX", sliderValue(value))
              }
              step={2}
              value={[config.paddingX]}
            />
          </div>
          <div className="grid gap-2">
            <Label>Corner radius ({config.borderRadius}px)</Label>
            <Slider
              max={32}
              min={0}
              onValueChange={(value) =>
                onUpdate("borderRadius", sliderValue(value))
              }
              step={2}
              value={[config.borderRadius]}
            />
          </div>
        </div>

        {config.layout === "marquee" ? (
          <div className="grid gap-2">
            <Label>Marquee speed ({config.marqueeSpeed}s)</Label>
            <Slider
              max={80}
              min={10}
              onValueChange={(value) =>
                onUpdate("marqueeSpeed", sliderValue(value))
              }
              step={5}
              value={[config.marqueeSpeed]}
            />
          </div>
        ) : null}
      </section>
    </div>
  );
}
