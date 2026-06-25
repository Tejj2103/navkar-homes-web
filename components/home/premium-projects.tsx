"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trendingProjects } from "@/lib/seed-trending";
import { useRequireAuth } from "@/lib/use-require-auth";

export function PremiumProjects() {
  const [index, setIndex] = useState(0);
  const project = trendingProjects[index];
  const withAuth = useRequireAuth();

  function go(direction: "prev" | "next") {
    setIndex((current) => {
      const length = trendingProjects.length;
      return direction === "prev"
        ? (current - 1 + length) % length
        : (current + 1) % length;
    });
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="font-heading text-2xl font-semibold tracking-tight">
        Premium Projects
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Explore top living options with us
      </p>

      <div className="relative mt-8 pb-10">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={project.imageUrl}
            alt={project.projectName}
            fill
            sizes="(min-width: 1024px) 1152px, 100vw"
            className="object-cover"
          />
        </div>

        <button
          type="button"
          aria-label="Previous project"
          onClick={() => go("prev")}
          className="absolute left-4 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-[var(--shadow-card)] transition-colors hover:bg-white"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Next project"
          onClick={() => go("next")}
          className="absolute right-4 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-[var(--shadow-card)] transition-colors hover:bg-white"
        >
          <ChevronRight className="size-4" />
        </button>

        <div className="absolute bottom-0 left-6 right-6 flex flex-col gap-4 rounded-lg bg-card p-4 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={project.developerLogoUrl}
              alt={project.developerName}
              width={40}
              height={40}
              unoptimized
              className="size-10 rounded-md border border-border bg-white"
            />
            <div>
              <p className="text-sm font-semibold leading-tight">{project.projectName}</p>
              <p className="text-xs text-muted-foreground">By {project.developerName}</p>
              <p className="mt-2 text-xs font-medium">{project.propertyType}</p>
              <p className="text-xs text-muted-foreground">
                {project.locality}, {project.city}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-2">
            <div className="text-right">
              <p className="text-sm font-semibold">{project.priceRangeLabel}</p>
              <p className="text-xs text-muted-foreground">{project.bhkLabel}</p>
            </div>
            <Button
              size="sm"
              onClick={() => withAuth()}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              View Detail
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
