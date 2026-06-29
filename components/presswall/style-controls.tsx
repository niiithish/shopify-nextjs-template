"use client";

import { ColorField } from "@/components/presswall/color-field";
import {
  SegmentedAlignment,
  SettingToggle,
  SliderField,
} from "@/components/presswall/shared-controls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { PresswallConfig } from "@/lib/presswall-types";

interface StyleControlsProps {
  config: PresswallConfig;
  onUpdate: <K extends keyof PresswallConfig>(
    key: K,
    value: PresswallConfig[K]
  ) => void;
}

export function StyleControls({ config, onUpdate }: StyleControlsProps) {
  return (
    <Tabs defaultValue="content">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="style">Style</TabsTrigger>
        <TabsTrigger value="layout">Layout</TabsTrigger>
      </TabsList>

      <TabsContent className="mt-4 flex flex-col gap-4" value="content">
        <SettingToggle
          checked={config.showHeading}
          description="Display a label above your logos"
          id="show-heading"
          label="Show heading"
          onCheckedChange={(checked) => onUpdate("showHeading", checked)}
        />

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

        {config.showHeading ? (
          <>
            <SliderField
              label="Heading size"
              max={24}
              min={10}
              onChange={(value) => onUpdate("headingFontSize", value)}
              step={1}
              value={config.headingFontSize}
            />

            <SliderField
              label="Space below heading"
              max={48}
              min={8}
              onChange={(value) => onUpdate("headingSpacing", value)}
              step={2}
              value={config.headingSpacing}
            />

            <div className="grid gap-2">
              <Label>Heading alignment</Label>
              <SegmentedAlignment
                onChange={(value) => onUpdate("headingAlignment", value)}
                value={config.headingAlignment}
              />
            </div>
          </>
        ) : null}

        <div className="grid gap-3 rounded-lg border p-3">
          <div>
            <p className="font-medium text-sm">Colors</p>
            <p className="text-muted-foreground text-xs">
              Set how the heading and bar look on your storefront. Use
              &ldquo;None&rdquo; for a transparent background.
            </p>
          </div>
          <ColorField
            allowTransparent
            id="background-color"
            label="Background"
            onChange={(value) => onUpdate("backgroundColor", value)}
            value={config.backgroundColor}
          />
          <ColorField
            id="text-color"
            label="Text color"
            onChange={(value) => onUpdate("textColor", value)}
            value={config.textColor}
          />
        </div>
      </TabsContent>

      <TabsContent className="mt-4 flex flex-col gap-4" value="style">
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <Label>Color mode</Label>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button size="icon-sm" variant="ghost">
                    ?
                  </Button>
                }
              />
              <TooltipContent>
                Mono and muted modes work best with transparent logos. Full
                color shows original brand marks.
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            items={[
              { value: "mono", label: "Black & white" },
              { value: "muted", label: "Muted grayscale" },
              { value: "color", label: "Full color" },
            ]}
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

        <SliderField
          label="Logo height"
          max={80}
          min={16}
          onChange={(value) => onUpdate("logoHeight", value)}
          step={2}
          value={config.logoHeight}
        />
      </TabsContent>

      <TabsContent className="mt-4 flex flex-col gap-4" value="layout">
        <div className="grid gap-2">
          <Label>Layout type</Label>
          <Select
            items={[
              { value: "bar", label: "Horizontal bar" },
              { value: "grid", label: "Grid" },
              { value: "marquee", label: "Scrolling marquee" },
            ]}
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
              <SelectItem value="marquee">Scrolling marquee</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {config.layout === "bar" || config.layout === "grid" ? (
          <>
            <SliderField
              label="Logos per row — desktop"
              max={8}
              min={2}
              onChange={(value) => onUpdate("logosPerRowDesktop", value)}
              step={1}
              unit=""
              value={config.logosPerRowDesktop}
            />
            <SliderField
              label="Logos per row — mobile"
              max={4}
              min={1}
              onChange={(value) => onUpdate("logosPerRowMobile", value)}
              step={1}
              unit=""
              value={config.logosPerRowMobile}
            />
          </>
        ) : null}

        <div className="grid gap-2">
          <Label>Logo alignment</Label>
          <SegmentedAlignment
            onChange={(value) => onUpdate("logoAlignment", value)}
            value={config.logoAlignment}
          />
        </div>

        <SliderField
          label="Gap"
          max={64}
          min={8}
          onChange={(value) => onUpdate("gap", value)}
          step={2}
          value={config.gap}
        />

        <div className="grid gap-2 sm:grid-cols-2">
          <SliderField
            label="Padding Y"
            max={80}
            min={0}
            onChange={(value) => onUpdate("paddingY", value)}
            step={2}
            value={config.paddingY}
          />
          <SliderField
            label="Padding X"
            max={80}
            min={0}
            onChange={(value) => onUpdate("paddingX", value)}
            step={2}
            value={config.paddingX}
          />
        </div>

        <SliderField
          label="Corner radius"
          max={32}
          min={0}
          onChange={(value) => onUpdate("borderRadius", value)}
          step={2}
          value={config.borderRadius}
        />

        {config.layout === "marquee" ? (
          <SliderField
            label="Marquee speed"
            max={80}
            min={10}
            onChange={(value) => onUpdate("marqueeSpeed", value)}
            step={5}
            unit="s"
            value={config.marqueeSpeed}
          />
        ) : null}
      </TabsContent>
    </Tabs>
  );
}
