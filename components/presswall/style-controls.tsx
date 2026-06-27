"use client";

import { IconChevronDown } from "@tabler/icons-react";
import { useState } from "react";
import {
  ContainerStyleSection,
  HeadingStyleSection,
  LayoutStyleSection,
  LogosStyleSection,
} from "@/components/presswall/style-sections";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { PresswallConfig } from "@/lib/presswall-types";
import { cn } from "@/lib/utils";

type StyleSection = "heading" | "layout" | "logos" | "container";

const STYLE_SECTIONS: {
  id: StyleSection;
  label: string;
  render: (props: {
    config: PresswallConfig;
    onUpdate: StyleControlsProps["onUpdate"];
  }) => React.ReactNode;
}[] = [
  {
    id: "heading",
    label: "Heading",
    render: ({ config, onUpdate }) => (
      <HeadingStyleSection config={config} onUpdate={onUpdate} />
    ),
  },
  {
    id: "layout",
    label: "Layout",
    render: ({ config, onUpdate }) => (
      <LayoutStyleSection config={config} onUpdate={onUpdate} />
    ),
  },
  {
    id: "logos",
    label: "Logos",
    render: ({ config, onUpdate }) => (
      <LogosStyleSection config={config} onUpdate={onUpdate} />
    ),
  },
  {
    id: "container",
    label: "Container",
    render: ({ config, onUpdate }) => (
      <ContainerStyleSection config={config} onUpdate={onUpdate} />
    ),
  },
];

interface StyleControlsProps {
  config: PresswallConfig;
  onUpdate: <K extends keyof PresswallConfig>(
    key: K,
    value: PresswallConfig[K]
  ) => void;
}

export function StyleControls({ config, onUpdate }: StyleControlsProps) {
  const [openSection, setOpenSection] = useState<StyleSection>("layout");

  return (
    <div className="grid gap-2">
      {STYLE_SECTIONS.map((section) => {
        const isOpen = openSection === section.id;

        return (
          <Collapsible
            className="rounded-lg border"
            key={section.id}
            onOpenChange={(open) => {
              if (open) {
                setOpenSection(section.id);
              }
            }}
            open={isOpen}
          >
            <CollapsibleTrigger
              className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors hover:bg-muted/40"
              id={`style-section-${section.id}`}
            >
              <span className="font-medium text-sm">{section.label}</span>
              <IconChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted-foreground transition-transform",
                  isOpen && "rotate-180"
                )}
                stroke={2}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t px-3 py-3">
              <div className="grid gap-3">
                {section.render({ config, onUpdate })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
