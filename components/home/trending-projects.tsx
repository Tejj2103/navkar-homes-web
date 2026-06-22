"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { trendingProjects } from "@/lib/seed-trending";

export function TrendingProjects() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    scrollerRef.current?.scrollBy({
      left: direction === "left" ? -380 : 380,
      behavior: "smooth",
    });
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="font-heading text-2xl font-semibold tracking-tight">
        Based on search trends
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Other city projects Jaipur buyers considered
      </p>

      <div
        ref={scrollerRef}
        className="mt-8 flex gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {trendingProjects.map((project) => (
          <div
            key={project.id}
            className="relative aspect-[4/3] w-[340px] shrink-0 snap-start overflow-hidden rounded-lg"
          >
            <Image
              src={project.imageUrl}
              alt={project.projectName}
              fill
              sizes="340px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 pt-12 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Image
                    src={project.developerLogoUrl}
                    alt={project.developerName}
                    width={32}
                    height={32}
                    unoptimized
                    className="size-8 rounded-md bg-white"
                  />
                  <div>
                    <p className="text-sm font-semibold leading-tight">
                      {project.projectName}
                    </p>
                    <p className="text-xs text-white/70">By {project.developerName}</p>
                  </div>
                </div>
                <p className="shrink-0 text-right text-sm font-medium">
                  {project.priceRangeLabel}
                </p>
              </div>

              <div className="mt-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-white/90">
                    {project.propertyType}
                  </p>
                  <p className="text-xs text-white/70">
                    {project.locality}, {project.city}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-md border border-white/60 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/10"
                >
                  View Detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scroll("left")}
          className="flex size-9 items-center justify-center rounded-full bg-surface text-foreground shadow-[var(--shadow-card)] transition-colors hover:bg-border"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scroll("right")}
          className="flex size-9 items-center justify-center rounded-full bg-surface text-foreground shadow-[var(--shadow-card)] transition-colors hover:bg-border"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </section>
  );
}
