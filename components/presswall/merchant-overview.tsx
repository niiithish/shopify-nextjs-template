"use client";

import {
  IconArrowRight,
  IconEdit,
  IconLayoutGrid,
  IconNews,
  IconPalette,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useContext } from "react";
import { OnboardingPreview } from "@/components/presswall/onboarding-preview";
import { ThemeActivationBanner } from "@/components/presswall/theme-activation-banner";
import { ThemeActivationContext } from "@/components/presswall/theme-activation-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buildAdminPath } from "@/lib/admin-path";
import type { MerchantOverviewData } from "@/lib/merchant-overview-data";
import { getPresswallDesignLabel } from "@/lib/presswall-templates";

const LAYOUT_LABELS = {
  bar: "Horizontal bar",
  grid: "Grid",
  marquee: "Marquee",
} as const;

interface MerchantOverviewProps {
  data: MerchantOverviewData;
}

export function MerchantOverview({ data }: MerchantOverviewProps) {
  const themeActivation = useContext(ThemeActivationContext);
  const themeStatus = themeActivation?.status ?? null;

  const customOutletCount = data.selected.filter(
    (item) => !item.publisherId
  ).length;
  const catalogOutletCount = data.selected.length - customOutletCount;
  const designLabel = getPresswallDesignLabel(data.config);
  const layoutLabel = LAYOUT_LABELS[data.config.layout];
  const themeIsActive = themeStatus?.isActive ?? null;
  const storefrontDescription = (() => {
    if (themeIsActive === null) {
      return "Checking theme status";
    }

    if (themeIsActive) {
      return "App embed is enabled";
    }

    return "Enable the app embed";
  })();
  const storefrontValue = (() => {
    if (themeIsActive === null) {
      return "…";
    }

    if (themeIsActive) {
      return "Live";
    }

    return "Inactive";
  })();

  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-semibold text-2xl tracking-tight">Presswall</h1>
            <Badge variant={data.selected.length > 0 ? "default" : "secondary"}>
              {data.selected.length > 0 ? "Configured" : "No outlets yet"}
            </Badge>
          </div>
          <p className="max-w-2xl text-muted-foreground text-sm leading-relaxed">
            Your &ldquo;as seen on&rdquo; press strip is saved. Review how it
            looks below, then open the editor when you want to change outlets or
            styling.
          </p>
        </header>

        <ThemeActivationBanner />

        {data.unavailableCount > 0 ? (
          <Card className="border-amber-200/80 bg-amber-50/50">
            <CardHeader>
              <CardTitle className="text-amber-950">
                Some outlets need attention
              </CardTitle>
              <CardDescription className="text-amber-900/80">
                {data.unavailableCount} selected outlet
                {data.unavailableCount === 1 ? "" : "s"} are no longer available
                and will not appear on your storefront.
              </CardDescription>
            </CardHeader>
            <CardFooterAction
              href={buildAdminPath("/editor")}
              label="Fix in editor"
            />
          </Card>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            description={
              customOutletCount > 0
                ? `${catalogOutletCount} catalog, ${customOutletCount} custom`
                : "Publishers on your strip"
            }
            icon={<IconNews className="size-4" stroke={2} />}
            title="Outlets"
            value={String(data.selected.length)}
          />
          <SummaryCard
            description="Active design preset"
            icon={<IconPalette className="size-4" stroke={2} />}
            title="Template"
            value={designLabel}
          />
          <SummaryCard
            description="How logos are arranged"
            icon={<IconLayoutGrid className="size-4" stroke={2} />}
            title="Layout"
            value={layoutLabel}
          />
          <SummaryCard
            description={storefrontDescription}
            icon={<IconLayoutGrid className="size-4" stroke={2} />}
            title="Storefront"
            value={storefrontValue}
            valueTone={themeIsActive ? "success" : "warning"}
          />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Storefront preview</CardTitle>
            <CardDescription>
              Read-only snapshot of your current press strip. Open the editor to
              make changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border bg-muted/30 p-4">
              <OnboardingPreview
                catalog={data.catalog}
                config={data.config}
                deviceMode="desktop"
                scale="lg"
                selections={data.selections}
              />
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>
                Jump straight to the task you need most.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Button
                className="justify-between"
                onClick={() => {
                  window.location.assign(buildAdminPath("/editor"));
                }}
                type="button"
              >
                <span className="inline-flex items-center gap-2">
                  <IconEdit stroke={2} />
                  Edit press wall
                </span>
                <IconArrowRight className="size-4" stroke={2} />
              </Button>
              {themeStatus && !themeStatus.isActive ? (
                <Button
                  onClick={() => {
                    window.open(
                      themeStatus.activateEmbedUrl,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                  type="button"
                  variant="outline"
                >
                  Activate on storefront
                </Button>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
              <CardDescription>Get more from Presswall.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm leading-relaxed">
                <li>
                  Use the Editor to swap outlets, try templates, or fine-tune
                  colors and spacing.
                </li>
                <li>
                  Add the Presswall block to high-trust pages like your homepage
                  or product detail templates.
                </li>
                <li>
                  Keep 4–8 recognizable outlets for a clean strip that builds
                  credibility without clutter.
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  description: string;
  icon: ReactNode;
  title: string;
  value: string;
  valueTone?: "default" | "success" | "warning";
}

function SummaryCard({
  description,
  icon,
  title,
  value,
  valueTone = "default",
}: SummaryCardProps) {
  return (
    <Card size="sm">
      <CardHeader className="pb-0">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <CardDescription className="text-[0.7rem] uppercase tracking-wide">
            {title}
          </CardDescription>
        </div>
        <CardTitle className={getSummaryValueClass(valueTone)}>
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-1 text-muted-foreground text-xs">
        {description}
      </CardContent>
    </Card>
  );
}

function getSummaryValueClass(
  valueTone: SummaryCardProps["valueTone"]
): string | undefined {
  if (valueTone === "success") {
    return "text-emerald-700";
  }

  if (valueTone === "warning") {
    return "text-amber-700";
  }

  return;
}

function CardFooterAction({ href, label }: { href: string; label: string }) {
  return (
    <div className="px-4 pb-4">
      <Button
        onClick={() => {
          window.location.assign(href);
        }}
        size="sm"
        type="button"
        variant="outline"
      >
        {label}
      </Button>
    </div>
  );
}
