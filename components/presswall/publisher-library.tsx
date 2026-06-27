"use client";

import { IconSearch, IconUpload } from "@tabler/icons-react";
import { useMemo } from "react";
import { PublisherLogo } from "@/components/presswall/publisher-logo";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  PublisherCatalogItem,
  SelectedPublisher,
} from "@/lib/presswall-types";
import { PUBLISHER_CATEGORIES } from "@/lib/publishers-seed";
import { cn } from "@/lib/utils";

function buildSelectedOrderById(
  selected: SelectedPublisher[]
): Map<string, number> {
  const orderById = new Map<string, number>();
  let order = 1;

  for (const item of selected) {
    if (item.publisherId) {
      orderById.set(item.publisherId, order);
      order += 1;
    }
  }

  return orderById;
}

function SelectionOrderBadge({ order }: { order: number }) {
  return (
    <span className="absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full bg-primary font-medium text-[0.625rem] text-primary-foreground tabular-nums">
      {order}
    </span>
  );
}

function PublisherCatalogList({
  filteredCatalog,
  selectedOrderById,
  onToggle,
  variant,
}: {
  filteredCatalog: PublisherCatalogItem[];
  selectedOrderById: Map<string, number>;
  onToggle: (publisher: PublisherCatalogItem) => void;
  variant: "list" | "grid";
}) {
  if (filteredCatalog.length === 0) {
    return (
      <Empty className="border-0 py-8">
        <EmptyHeader>
          <EmptyTitle>No outlets found</EmptyTitle>
          <EmptyDescription>
            Try a different search or category.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3">
        {filteredCatalog.map((publisher) => {
          const order = selectedOrderById.get(publisher.id);
          const isSelected = order !== undefined;
          return (
            <button
              aria-label={
                isSelected
                  ? `${publisher.name}, position ${order}`
                  : publisher.name
              }
              aria-pressed={isSelected}
              className={cn(
                "group relative flex min-h-[4.5rem] items-center justify-center rounded-lg border px-3 py-4 transition-colors",
                isSelected
                  ? "border-primary/40 bg-primary/5"
                  : "border-transparent hover:border-border hover:bg-muted/50"
              )}
              key={publisher.id}
              onClick={() => onToggle(publisher)}
              title={
                isSelected ? `${publisher.name} · #${order}` : publisher.name
              }
              type="button"
            >
              {isSelected ? <SelectionOrderBadge order={order} /> : null}
              <div className="flex h-9 w-full items-center justify-center">
                <PublisherLogo
                  className="[--logo-height:2rem]"
                  name={publisher.name}
                  publisherId={publisher.id}
                />
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-0.5 p-1.5">
      {filteredCatalog.map((publisher) => {
        const order = selectedOrderById.get(publisher.id);
        const isSelected = order !== undefined;
        return (
          <label
            className={cn(
              "relative flex cursor-pointer items-center justify-center gap-2.5 rounded-md border border-transparent px-2.5 py-2 transition-colors hover:bg-muted/50",
              isSelected && "border-border bg-muted/40"
            )}
            htmlFor={`publisher-${publisher.id}`}
            key={publisher.id}
            title={
              isSelected ? `${publisher.name} · #${order}` : publisher.name
            }
          >
            <Checkbox
              checked={isSelected}
              className="sr-only"
              id={`publisher-${publisher.id}`}
              onCheckedChange={() => onToggle(publisher)}
            />
            {isSelected ? <SelectionOrderBadge order={order} /> : null}
            <div className="flex h-8 w-full items-center justify-center">
              <PublisherLogo
                className="[--logo-height:1.75rem]"
                name={publisher.name}
                publisherId={publisher.id}
              />
            </div>
          </label>
        );
      })}
    </div>
  );
}

interface PublisherLibraryProps {
  catalog: PublisherCatalogItem[];
  category: string;
  listClassName?: string;
  onAddCustom?: () => void;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onToggle: (publisher: PublisherCatalogItem) => void;
  search: string;
  selected: SelectedPublisher[];
  variant?: "list" | "grid";
}

function AddCustomOutletButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="flex w-full items-center gap-4 rounded-xl border-2 border-primary/30 border-dashed bg-primary/5 px-4 py-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/10"
      onClick={onClick}
      type="button"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <IconUpload className="size-4" stroke={2} />
      </span>
      <span className="min-w-0 space-y-1">
        <span className="block font-medium text-sm">Upload your own logo</span>
        <span className="block text-muted-foreground text-xs leading-relaxed">
          Podcast, local press, or any outlet not in the library
        </span>
      </span>
    </button>
  );
}

export function PublisherLibrary({
  catalog,
  selected,
  onToggle,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  onAddCustom,
  listClassName = "h-80",
  variant = "grid",
}: PublisherLibraryProps) {
  const selectedOrderById = useMemo(
    () => buildSelectedOrderById(selected),
    [selected]
  );

  const filteredCatalog = useMemo(
    () =>
      catalog.filter((publisher) => {
        const matchesCategory =
          category === "All" || publisher.category === category;
        const query = search.trim().toLowerCase();
        const matchesSearch =
          query.length === 0 ||
          publisher.name.toLowerCase().includes(query) ||
          publisher.category.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
      }),
    [catalog, category, search]
  );

  return (
    <div className="flex min-h-0 flex-col gap-4">
      <div className="flex gap-3">
        <div className="relative min-w-0 flex-1">
          <IconSearch
            className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            stroke={2}
          />
          <Input
            className="h-9 pl-8 text-sm"
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search..."
            value={search}
          />
        </div>
        <Select
          onValueChange={(value) => value && onCategoryChange(value)}
          value={category}
        >
          <SelectTrigger className="h-9 w-[8rem] text-xs">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {PUBLISHER_CATEGORIES.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {onAddCustom ? <AddCustomOutletButton onClick={onAddCustom} /> : null}

      <ScrollArea className={cn("rounded-lg border", listClassName)}>
        <PublisherCatalogList
          filteredCatalog={filteredCatalog}
          onToggle={onToggle}
          selectedOrderById={selectedOrderById}
          variant={variant}
        />
      </ScrollArea>
    </div>
  );
}
