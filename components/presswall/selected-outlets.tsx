"use client";

import { IconGripVertical, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { PublisherLogo } from "@/components/presswall/publisher-logo";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { ScrollArea } from "@/components/ui/scroll-area";
import type {
  PublisherCatalogItem,
  SelectedPublisher,
} from "@/lib/presswall-types";
import { cn } from "@/lib/utils";

interface SelectedOutletsProps {
  catalogById: Map<string, PublisherCatalogItem>;
  className?: string;
  onRemove: (key: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  selected: SelectedPublisher[];
}

export function SelectedOutlets({
  selected,
  catalogById,
  onReorder,
  onRemove,
  className,
}: SelectedOutletsProps) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  if (selected.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border border-dashed",
          className
        )}
      >
        <Empty className="border-0 py-8">
          <EmptyHeader>
            <EmptyTitle>Nothing selected yet</EmptyTitle>
            <EmptyDescription>
              Pick outlets from the library to build your lineup.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    );
  }

  const finishDrag = () => {
    setDraggingIndex(null);
    setOverIndex(null);
  };

  return (
    <ScrollArea className={cn("rounded-lg border", className)}>
      <ul className="flex list-none flex-col gap-1 p-1.5">
        {selected.map((item, index) => {
          const publisher = item.publisherId
            ? catalogById.get(item.publisherId)
            : null;
          const label = publisher?.name ?? item.customName ?? "Custom";
          const customLogoSvg = item.customLogoSvg;
          const isDragging = draggingIndex === index;
          const isDropTarget = overIndex === index && draggingIndex !== index;

          return (
            // biome-ignore lint/a11y/noNoninteractiveElementInteractions: HTML5 drag-and-drop reorder row
            <li
              className={cn(
                "group flex items-center gap-2 rounded-md border border-transparent bg-muted/20 px-2 py-1.5 transition-colors",
                isDragging && "opacity-40",
                isDropTarget && "border-primary bg-primary/5",
                !isDragging && "hover:border-border"
              )}
              draggable
              key={item.key}
              onDragEnd={finishDrag}
              onDragLeave={() => {
                if (overIndex === index) {
                  setOverIndex(null);
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "move";
                setOverIndex(index);
              }}
              onDragStart={(event) => {
                setDraggingIndex(index);
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", String(index));
              }}
              onDrop={(event) => {
                event.preventDefault();
                const fromIndex = Number.parseInt(
                  event.dataTransfer.getData("text/plain"),
                  10
                );

                if (!Number.isNaN(fromIndex)) {
                  onReorder(fromIndex, index);
                }

                finishDrag();
              }}
              title={label}
            >
              <span
                aria-hidden
                className="flex shrink-0 cursor-grab touch-none items-center text-muted-foreground active:cursor-grabbing"
              >
                <IconGripVertical className="size-4" stroke={2} />
              </span>

              <span className="w-4 shrink-0 text-center font-medium text-muted-foreground text-xs tabular-nums">
                {index + 1}
              </span>

              <div className="flex h-6 min-w-0 flex-1 items-center justify-center">
                <PublisherLogo
                  className="[--logo-height:1.25rem]"
                  customLogoSvg={customLogoSvg}
                  name={label}
                  publisherId={publisher?.id}
                />
              </div>

              <Button
                aria-label={`Remove ${label}`}
                className="shrink-0 opacity-70 transition-opacity group-hover:opacity-100"
                onClick={() => onRemove(item.key)}
                size="icon-sm"
                variant="ghost"
              >
                <IconX className="size-3.5 text-muted-foreground" stroke={2} />
              </Button>
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
}
