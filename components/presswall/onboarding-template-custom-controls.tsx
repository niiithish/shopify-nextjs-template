"use client";

import {
  type Icon,
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
} from "@tabler/icons-react";
import { ColorField } from "@/components/presswall/color-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import type { PresswallConfig } from "@/lib/presswall-types";
import { cn } from "@/lib/utils";

function sliderValue(value: number | readonly number[]): number {
  if (typeof value === "number") {
    return value;
  }
  return value[0] ?? 0;
}

const ALIGNMENT_OPTIONS: {
  value: PresswallConfig["alignment"];
  icon: Icon;
  label: string;
}[] = [
  { value: "left", icon: IconAlignLeft, label: "Left" },
  { value: "center", icon: IconAlignCenter, label: "Center" },
  { value: "right", icon: IconAlignRight, label: "Right" },
];

interface OnboardingTemplateCustomControlsProps {
  config: PresswallConfig;
  onUpdate: <K extends keyof PresswallConfig>(
    key: K,
    value: PresswallConfig[K]
  ) => void;
}

function ControlSection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="space-y-3">
      <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
        {title}
      </p>
      {children}
    </section>
  );
}

export function OnboardingTemplateCustomControls({
  config,
  onUpdate,
}: OnboardingTemplateCustomControlsProps) {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="space-y-5 p-4">
        <ControlSection title="Heading">
          <div className="flex items-center justify-between rounded-lg border px-3 py-2.5">
            <Label className="text-sm" htmlFor="onboarding-show-heading">
              Show heading
            </Label>
            <Switch
              checked={config.showHeading}
              id="onboarding-show-heading"
              onCheckedChange={(checked) => onUpdate("showHeading", checked)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-sm" htmlFor="onboarding-heading-text">
              Heading text
            </Label>
            <Input
              disabled={!config.showHeading}
              id="onboarding-heading-text"
              onChange={(event) => onUpdate("headingText", event.target.value)}
              placeholder="As seen on"
              value={config.headingText}
            />
          </div>

          <div className="grid gap-1.5">
            <Label className="text-sm">Heading alignment</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {ALIGNMENT_OPTIONS.map((option) => {
                const AlignIcon = option.icon;
                const isSelected = config.alignment === option.value;

                return (
                  <button
                    aria-pressed={isSelected}
                    className={cn(
                      "flex min-w-0 flex-col items-center justify-center gap-1 rounded-md border px-1 py-2 text-center transition-colors",
                      isSelected
                        ? "border-ring bg-muted text-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted/50"
                    )}
                    disabled={!config.showHeading}
                    key={option.value}
                    onClick={() => onUpdate("alignment", option.value)}
                    type="button"
                  >
                    <AlignIcon className="size-3.5 shrink-0" stroke={2} />
                    <span className="w-full truncate text-[0.625rem] leading-none">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </ControlSection>

        <Separator />

        <ControlSection title="Layout">
          <div className="grid gap-1.5">
            <Label className="text-sm">Layout type</Label>
            <Select
              onValueChange={(value) =>
                onUpdate("layout", value as PresswallConfig["layout"])
              }
              value={config.layout}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Horizontal bar</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="marquee">Auto-scroll</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label className="text-sm">Logo alignment</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {ALIGNMENT_OPTIONS.map((option) => {
                const AlignIcon = option.icon;
                const isSelected = config.alignment === option.value;

                return (
                  <button
                    aria-pressed={isSelected}
                    className={cn(
                      "flex min-w-0 flex-col items-center justify-center gap-1 rounded-md border px-1 py-2 text-center transition-colors",
                      isSelected
                        ? "border-ring bg-muted text-foreground"
                        : "border-border bg-background text-foreground hover:bg-muted/50"
                    )}
                    key={`layout-${option.value}`}
                    onClick={() => onUpdate("alignment", option.value)}
                    type="button"
                  >
                    <AlignIcon className="size-3.5 shrink-0" stroke={2} />
                    <span className="w-full truncate text-[0.625rem] leading-none">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </ControlSection>

        <Separator />

        <ControlSection title="Look">
          <div className="grid gap-1.5">
            <Label className="text-sm">Color mode</Label>
            <Select
              onValueChange={(value) =>
                onUpdate("colorMode", value as PresswallConfig["colorMode"])
              }
              value={config.colorMode}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mono">Black &amp; white</SelectItem>
                <SelectItem value="muted">Muted grayscale</SelectItem>
                <SelectItem value="color">Full color</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {config.colorMode === "muted" ? (
            <div className="grid gap-1.5">
              <Label className="text-sm">
                Muted opacity ({config.grayscaleOpacity}%)
              </Label>
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

          <ColorField
            allowTransparent
            id="onboarding-background-color"
            label="Background"
            onChange={(value) => onUpdate("backgroundColor", value)}
            value={config.backgroundColor}
          />
          <ColorField
            id="onboarding-text-color"
            label="Text color"
            onChange={(value) => onUpdate("textColor", value)}
            value={config.textColor}
          />
        </ControlSection>

        <Separator />

        <ControlSection title="Spacing">
          <div className="grid gap-1.5">
            <Label className="text-sm">
              Logo height ({config.logoHeight}px)
            </Label>
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

          <div className="grid gap-1.5">
            <Label className="text-sm">Gap ({config.gap}px)</Label>
            <Slider
              max={64}
              min={8}
              onValueChange={(value) => onUpdate("gap", sliderValue(value))}
              step={2}
              value={[config.gap]}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label className="text-sm">Padding Y ({config.paddingY}px)</Label>
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
            <div className="grid gap-1.5">
              <Label className="text-sm">Padding X ({config.paddingX}px)</Label>
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
          </div>

          <div className="grid gap-1.5">
            <Label className="text-sm">
              Corner radius ({config.borderRadius}px)
            </Label>
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

          {config.layout === "marquee" ? (
            <div className="grid gap-1.5">
              <Label className="text-sm">
                Scroll speed ({config.marqueeSpeed}s)
              </Label>
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
        </ControlSection>
      </div>
    </ScrollArea>
  );
}
