"use client";

import {
  type Icon,
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
} from "@tabler/icons-react";
import { useState } from "react";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type CustomTabId = "text" | "layout" | "look" | "spacing";

interface OnboardingTemplateCustomControlsProps {
  config: PresswallConfig;
  onUpdate: <K extends keyof PresswallConfig>(
    key: K,
    value: PresswallConfig[K]
  ) => void;
}

function AlignmentPicker({
  config,
  helperText,
  onUpdate,
}: {
  config: PresswallConfig;
  helperText: string;
  onUpdate: OnboardingTemplateCustomControlsProps["onUpdate"];
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-sm">Alignment</Label>
      <p className="text-muted-foreground text-xs">{helperText}</p>
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
  );
}

export function OnboardingTemplateCustomControls({
  config,
  onUpdate,
}: OnboardingTemplateCustomControlsProps) {
  const [activeTab, setActiveTab] = useState<CustomTabId>("text");
  const showRowControls = config.layout === "bar" || config.layout === "grid";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b px-3 pt-3">
        <Tabs
          onValueChange={(value) => setActiveTab(value as CustomTabId)}
          value={activeTab}
        >
          <TabsList className="grid h-auto w-full grid-cols-4 gap-0.5">
            <TabsTrigger className="px-1 text-[0.625rem]" value="text">
              Text
            </TabsTrigger>
            <TabsTrigger className="px-1 text-[0.625rem]" value="layout">
              Layout
            </TabsTrigger>
            <TabsTrigger className="px-1 text-[0.625rem]" value="look">
              Look
            </TabsTrigger>
            <TabsTrigger className="px-1 text-[0.625rem]" value="spacing">
              Spacing
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <Tabs
          className="flex flex-col"
          onValueChange={(value) => setActiveTab(value as CustomTabId)}
          value={activeTab}
        >
          <TabsContent className="mt-0 space-y-3 p-4" value="text">
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
                onChange={(event) =>
                  onUpdate("headingText", event.target.value)
                }
                placeholder="As seen on"
                value={config.headingText}
              />
            </div>

            {config.showHeading ? (
              <>
                <div className="grid gap-1.5">
                  <Label className="text-sm">
                    Heading size ({config.headingFontSize}px)
                  </Label>
                  <Slider
                    disabled={!config.showHeading}
                    max={24}
                    min={10}
                    onValueChange={(value) =>
                      onUpdate("headingFontSize", sliderValue(value))
                    }
                    step={1}
                    value={[config.headingFontSize]}
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label className="text-sm">
                    Space below heading ({config.headingSpacing}px)
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Gap between the heading and logo row. Scales with heading
                    size unless you fine-tune it here.
                  </p>
                  <Slider
                    disabled={!config.showHeading}
                    max={48}
                    min={8}
                    onValueChange={(value) =>
                      onUpdate("headingSpacing", sliderValue(value))
                    }
                    step={2}
                    value={[config.headingSpacing]}
                  />
                </div>
              </>
            ) : null}

            {config.showHeading || config.layout === "bar" ? (
              <AlignmentPicker
                config={config}
                helperText={
                  config.layout === "bar"
                    ? "Heading and horizontal logo bar"
                    : "Heading position"
                }
                onUpdate={onUpdate}
              />
            ) : null}
          </TabsContent>

          <TabsContent className="mt-0 space-y-3 p-4" value="layout">
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

            {showRowControls ? (
              <>
                <div className="grid gap-1.5">
                  <Label className="text-sm">
                    Logos per row — desktop ({config.logosPerRowDesktop})
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Use the desktop preview toggle to check this layout.
                  </p>
                  <Slider
                    max={8}
                    min={2}
                    onValueChange={(value) =>
                      onUpdate("logosPerRowDesktop", sliderValue(value))
                    }
                    step={1}
                    value={[config.logosPerRowDesktop]}
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label className="text-sm">
                    Logos per row — mobile ({config.logosPerRowMobile})
                  </Label>
                  <p className="text-muted-foreground text-xs">
                    Use the mobile preview toggle to check this layout.
                  </p>
                  <Slider
                    max={4}
                    min={1}
                    onValueChange={(value) =>
                      onUpdate("logosPerRowMobile", sliderValue(value))
                    }
                    step={1}
                    value={[config.logosPerRowMobile]}
                  />
                </div>
              </>
            ) : null}

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
          </TabsContent>

          <TabsContent className="mt-0 space-y-3 p-4" value="look">
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
          </TabsContent>

          <TabsContent className="mt-0 space-y-3 p-4" value="spacing">
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
              <p className="text-muted-foreground text-xs">
                Space between logos. Updates automatically when logo height or
                layout changes; adjust here to fine-tune.
              </p>
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
                <Label className="text-sm">
                  Padding Y ({config.paddingY}px)
                </Label>
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
                <Label className="text-sm">
                  Padding X ({config.paddingX}px)
                </Label>
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
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}
