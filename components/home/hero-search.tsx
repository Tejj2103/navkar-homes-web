"use client";

import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function HeroSearch() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border">
      <Image
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-black/55" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-28 text-center text-white">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Find your next home
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-white/80">
          Browse apartments, villas, and plots for sale or rent across India&apos;s top
          localities.
        </p>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-[var(--shadow-card)] sm:flex-row sm:items-center"
        >
          <div className="flex items-center gap-2 rounded-lg px-2">
            <Button type="button" variant="secondary" size="sm" className="rounded-lg">
              Buy
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-lg text-foreground"
            >
              Rent
            </Button>
          </div>
          <div className="flex flex-1 items-center gap-2">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <Input
              placeholder="Search locality, city, or project"
              className="border-0 shadow-none focus-visible:ring-0"
            />
          </div>
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Search
          </Button>
        </form>
      </div>
    </section>
  );
}
