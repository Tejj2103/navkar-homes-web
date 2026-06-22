import { HeroSearch } from "@/components/home/hero-search";
import { TrendingProjects } from "@/components/home/trending-projects";
import { PremiumProjects } from "@/components/home/premium-projects";
import { PropertyGrid } from "@/components/home/property-grid";
import { seedProperties } from "@/lib/seed-data";

export default function Home() {
  return (
    <div>
      <HeroSearch />
      <TrendingProjects />
      <PremiumProjects />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Featured properties
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Hand-picked listings across Bengaluru, Mumbai, and Pune.
        </p>

        <div className="mt-8">
          <PropertyGrid properties={seedProperties} />
        </div>
      </section>
    </div>
  );
}
