"use client";

import {
  type Icon,
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
} from "@tabler/icons-react";
import { useState } from "react";
import { ColorField } from "@/components/presswall/color-field";
import { Button } from "@/components/ui/button";
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
import type {
  PresswallAlignment,
  PresswallConfig,
} from "@/lib/presswall-types";
import { cn } from "@/lib/utils";

function sliderValue(value: number | readonly number[]): number {
  if (typeof value === "number") {
    return value;
  }
  return value[0] ?? 0;
}

const ALIGNMENT_OPTIONS: {
  value: PresswallAlignment;
  icon: Icon;
  label: string;
}[] = [
  { value: "left", icon: IconAlignLeft, label: "Left" },
  { value: "center", icon: IconAlignCenter, label: "Center" },
  { value: "right", icon: IconAlignRight, label: "Right" },
];

const LAYOUT_OPTIONS: {
  label: string;
  value: PresswallConfig["layout"];
}[] = [
  { value: "bar", label: "Horizontal bar" },
  { value: "grid", label: "Grid" },
  { value: "marquee", label: "Auto-scroll" },
];

const COLOR_MODE_OPTIONS: {
  label: string;
  value: PresswallConfig["colorMode"];
}[] = [
  { value: "mono", label: "Black & white" },
  { value: "muted", label: "Muted grayscale" },
  { value: "color", label: "Full color" },
];

type CustomTabId = "text" | "layout" | "look" | "spacing";

interface OnboardingTemplateCustomControlsProps {
  config: PresswallConfig;
  matchedTemplateName?: string;
  onUpdate: <K extends keyof PresswallConfig>(
    key: K,
    value: PresswallConfig[K]
  ) => void;
}

function ControlSection({
  children,
  className,
  description,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  description?: string;
  title?: string;
}) {
  return (
    <section
      className={cn(
        "space-y-3 rounded-lg border bg-muted/20 p-3 shadow-xs",
        className
      )}
    >
      {title || description ? (
        <div className="space-y-0.5">
          {title ? <p className="font-medium text-sm">{title}</p> : null}
          {description ? (
            <p className="text-muted-foreground text-xs leading-relaxed">
              {description}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

function ValueBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="shrink-0 rounded-md border bg-background px-1.5 py-0.5 font-medium text-[0.6875rem] text-muted-foreground tabular-nums">
      {children}
    </span>
  );
}

function SliderField({
  disabled,
  hint,
  label,
  max,
  min,
  onChange,
  step,
  unit = "px",
  value,
}: {
  disabled?: boolean;
  hint?: string;
  label: string;
  max: number;
  min: number;
  onChange: (value: number) => void;
  step: number;
  unit?: string;
  value: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        <ValueBadge>
          {value}
          {unit}
        </ValueBadge>
      </div>
      {hint ? (
        <p className="text-muted-foreground text-xs leading-relaxed">{hint}</p>
      ) : null}
      <Slider
        disabled={disabled}
        max={max}
        min={min}
        onValueChange={(next) => onChange(sliderValue(next))}
        step={step}
        value={[value]}
      />
    </div>
  );
}

function SettingToggle({
  checked,
  description,
  id,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  description?: string;
  id: string;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0 space-y-0.5">
        <Label htmlFor={id}>{label}</Label>
        {description ? (
          <p className="text-muted-foreground text-xs leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      <Switch
        checked={checked}
        className="shrink-0"
        id={id}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}

function SegmentedAlignment({
  onChange,
  value,
}: {
  onChange: (value: PresswallAlignment) => void;
  value: PresswallAlignment;
}) {
  return (
    <fieldset className="flex w-full rounded-lg border bg-background p-0.5">
      {ALIGNMENT_OPTIONS.map((option) => {
        const AlignIcon = option.icon;
        const isSelected = value === option.value;

        return (
          <Button
            aria-label={option.label}
            aria-pressed={isSelected}
            className="h-8 min-w-0 flex-1 gap-1.5 px-2 text-xs"
            key={option.value}
            onClick={() => onChange(option.value)}
            size="sm"
            type="button"
            variant={isSelected ? "secondary" : "ghost"}
          >
            <AlignIcon className="size-3.5 shrink-0" stroke={2} />
            <span className="truncate">{option.label}</span>
          </Button>
        );
      })}
    </fieldset>
  );
}

export function OnboardingTemplateCustomControls({
  config,
  matchedTemplateName,
  onUpdate,
}: OnboardingTemplateCustomControlsProps) {
  const [activeTab, setActiveTab] = useState<CustomTabId>("text");
  const showRowControls = config.layout === "bar" || config.layout === "grid";

  return (
    <Tabs
      className="flex min-h-0 flex-1 flex-col"
      onValueChange={(value) => setActiveTab(value as CustomTabId)}
      value={activeTab}
    >
      <div className="shrink-0 border-b px-3 py-1">
        <TabsList
          className="h-auto w-full justify-start gap-0 bg-transparent p-0"
          variant="line"
        >
          <TabsTrigger className="px-2 py-1 text-xs" value="text">
            Text
          </TabsTrigger>
          <TabsTrigger className="px-2 py-1 text-xs" value="layout">
            Layout
          </TabsTrigger>
          <TabsTrigger className="px-2 py-1 text-xs" value="look">
            Look
          </TabsTrigger>
          <TabsTrigger className="px-2 py-1 text-xs" value="spacing">
            Spacing
          </TabsTrigger>
        </TabsList>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <TabsContent className="mt-0 space-y-3 p-3" value="text">
          <ControlSection title="Heading">
            <SettingToggle
              checked={config.showHeading}
              description="Turn off to show logos only."
              id="onboarding-show-heading"
              label="Show heading"
              onCheckedChange={(checked) => onUpdate("showHeading", checked)}
            />

            <div className="space-y-1.5">
              <Label htmlFor="onboarding-heading-text">Heading text</Label>
              <Input
                className="h-9"
                disabled={!config.showHeading}
                id="onboarding-heading-text"
                onChange={(event) =>
                  onUpdate("headingText", event.target.value)
                }
                placeholder="As seen on"
                value={config.headingText}
              />
            </div>
          </ControlSection>

          {config.showHeading ? (
            <ControlSection title="Typography">
              <SliderField
                label="Heading size"
                max={24}
                min={10}
                onChange={(value) => onUpdate("headingFontSize", value)}
                step={1}
                value={config.headingFontSize}
              />
              <SliderField
                hint="Scales with heading size. Adjust here to fine-tune."
                label="Space below heading"
                max={48}
                min={8}
                onChange={(value) => onUpdate("headingSpacing", value)}
                step={2}
                value={config.headingSpacing}
              />
            </ControlSection>
          ) : null}

          {config.showHeading ? (
            <ControlSection
              description="Align the heading text on the strip."
              title="Heading alignment"
            >
              <SegmentedAlignment
                onChange={(value) => onUpdate("headingAlignment", value)}
                value={config.headingAlignment}
              />
            </ControlSection>
          ) : null}
        </TabsContent>

        <TabsContent className="mt-0 space-y-3 p-3" value="layout">
          <ControlSection
            description="How logos are arranged on the storefront."
            title="Structure"
          >
            <div className="space-y-1.5">
              <Label>Layout type</Label>
              <Select
                items={LAYOUT_OPTIONS}
                onValueChange={(value) =>
                  onUpdate("layout", value as PresswallConfig["layout"])
                }
                value={config.layout}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Horizontal bar</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="marquee">Auto-scroll</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </ControlSection>

          {showRowControls ? (
            <ControlSection
              description="Set row counts per device, then use the preview toggle to check each."
              title="Logos per row"
            >
              <SliderField
                label="Desktop"
                max={8}
                min={2}
                onChange={(value) => onUpdate("logosPerRowDesktop", value)}
                step={1}
                unit=""
                value={config.logosPerRowDesktop}
              />
              <SliderField
                label="Mobile"
                max={4}
                min={1}
                onChange={(value) => onUpdate("logosPerRowMobile", value)}
                step={1}
                unit=""
                value={config.logosPerRowMobile}
              />
            </ControlSection>
          ) : null}

          {config.layout === "bar" || config.layout === "grid" ? (
            <ControlSection
              description="Align the logo row independently from the heading."
              title="Logo alignment"
            >
              <SegmentedAlignment
                onChange={(value) => onUpdate("logoAlignment", value)}
                value={config.logoAlignment}
              />
            </ControlSection>
          ) : null}

          {config.layout === "marquee" ? (
            <ControlSection title="Motion">
              <SliderField
                label="Scroll speed"
                max={80}
                min={10}
                onChange={(value) => onUpdate("marqueeSpeed", value)}
                step={5}
                unit="s"
                value={config.marqueeSpeed}
              />
            </ControlSection>
          ) : null}
        </TabsContent>

        <TabsContent className="mt-0 space-y-3 p-3" value="look">
          <ControlSection
            description="Logo treatment and strip colors."
            title="Appearance"
          >
            <div className="space-y-1.5">
              <Label>Color mode</Label>
              <Select
                items={COLOR_MODE_OPTIONS}
                onValueChange={(value) =>
                  onUpdate("colorMode", value as PresswallConfig["colorMode"])
                }
                value={config.colorMode}
              >
                <SelectTrigger className="h-9 w-full">
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
              <SliderField
                label="Muted opacity"
                max={100}
                min={20}
                onChange={(value) => onUpdate("grayscaleOpacity", value)}
                step={5}
                unit="%"
                value={config.grayscaleOpacity}
              />
            ) : null}
          </ControlSection>

          <ControlSection
            description={
              matchedTemplateName
                ? `Synced with the ${matchedTemplateName} template. Change anything here to customize.`
                : undefined
            }
            title="Colors"
          >
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
        </TabsContent>

        <TabsContent className="mt-0 space-y-3 p-3" value="spacing">
          <ControlSection title="Logo sizing">
            <SliderField
              label="Logo height"
              max={80}
              min={16}
              onChange={(value) => onUpdate("logoHeight", value)}
              step={2}
              value={config.logoHeight}
            />
            <SliderField
              hint="Updates when logo height or layout changes. Fine-tune here if needed."
              label="Gap between logos"
              max={64}
              min={8}
              onChange={(value) => onUpdate("gap", value)}
              step={2}
              value={config.gap}
            />
          </ControlSection>

          <ControlSection title="Strip padding">
            <div className="grid grid-cols-2 gap-3">
              <SliderField
                label="Vertical"
                max={80}
                min={0}
                onChange={(value) => onUpdate("paddingY", value)}
                step={2}
                value={config.paddingY}
              />
              <SliderField
                label="Horizontal"
                max={80}
                min={0}
                onChange={(value) => onUpdate("paddingX", value)}
                step={2}
                value={config.paddingX}
              />
            </div>
          </ControlSection>

          <ControlSection title="Shape">
            <SliderField
              label="Corner radius"
              max={32}
              min={0}
              onChange={(value) => onUpdate("borderRadius", value)}
              step={2}
              value={config.borderRadius}
            />
          </ControlSection>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
}
