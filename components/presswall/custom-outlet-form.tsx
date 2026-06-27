"use client";

import { IconInfoCircle, IconPlus, IconUpload } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LOGO_GUIDANCE } from "@/lib/logo-guidance";
import { sanitizeSvg } from "@/lib/svg-sanitize";
import { cn } from "@/lib/utils";

const SVG_EXTENSION = /\.svg$/i;
const FILENAME_SEPARATORS = /[-_]+/g;

interface CustomOutletFormProps {
  initialName?: string;
  initialSvg?: string;
  onAdd: (name: string, svg: string) => void;
}

function isSvgFile(file: File): boolean {
  return (
    file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")
  );
}

function nameFromFile(file: File): string {
  return file.name
    .replace(SVG_EXTENSION, "")
    .replace(FILENAME_SEPARATORS, " ")
    .trim();
}

export function CustomOutletForm({
  onAdd,
  initialName = "",
  initialSvg = "",
}: CustomOutletFormProps) {
  const [customName, setCustomName] = useState(initialName);
  const [customSvg, setCustomSvg] = useState(initialSvg);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const applySvgFile = async (file: File) => {
    if (!isSvgFile(file)) {
      toast.error("Please upload an SVG file");
      return;
    }

    try {
      const raw = await file.text();
      const sanitized = sanitizeSvg(raw);

      if (!sanitized) {
        toast.error("That file doesn't look like a valid SVG logo");
        return;
      }

      setCustomSvg(sanitized);
      if (!customName.trim()) {
        setCustomName(nameFromFile(file));
      }
    } catch {
      toast.error("Could not read that file");
    }
  };

  const handleAdd = () => {
    if (!customName.trim()) {
      return;
    }
    onAdd(customName.trim(), customSvg.trim());
    setCustomName("");
    setCustomSvg("");
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        accept=".svg,image/svg+xml"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            applySvgFile(file).catch(() => undefined);
          }
          event.target.value = "";
        }}
        ref={fileInputRef}
        type="file"
      />

      <button
        className={cn(
          "flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-5 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10"
        )}
        onClick={() => fileInputRef.current?.click()}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer.files[0];
          if (file) {
            applySvgFile(file).catch(() => undefined);
          }
        }}
        type="button"
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <IconUpload className="size-5" stroke={2} />
        </span>
        <span className="font-medium text-sm">Upload SVG logo</span>
        <span className="text-muted-foreground text-xs">
          Click or drop a file — transparent background works best
        </span>
      </button>

      <div className="grid gap-1.5">
        <Label htmlFor="custom-name">Outlet name</Label>
        <Input
          autoFocus={!initialName}
          id="custom-name"
          onChange={(event) => setCustomName(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleAdd();
            }
          }}
          placeholder="Podcast, local news, blog..."
          value={customName}
        />
      </div>

      <div className="grid gap-1.5">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="custom-svg">Or paste SVG code</Label>
          <Tooltip>
            <TooltipTrigger
              render={
                <button
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  type="button"
                >
                  <IconInfoCircle className="size-3.5" stroke={2} />
                </button>
              }
            />
            <TooltipContent className="max-w-xs">
              <p className="mb-1 font-medium">{LOGO_GUIDANCE.title}</p>
              <p className="text-xs">{LOGO_GUIDANCE.summary}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Textarea
          className="min-h-[5rem] font-mono text-xs"
          id="custom-svg"
          onChange={(event) => setCustomSvg(event.target.value)}
          placeholder='<svg xmlns="http://www.w3.org/2000/svg" ...>'
          rows={3}
          value={customSvg}
        />
      </div>

      <Button
        className="w-full"
        disabled={!customName.trim()}
        onClick={handleAdd}
      >
        <IconPlus stroke={2} />
        Add to lineup
      </Button>
    </div>
  );
}
