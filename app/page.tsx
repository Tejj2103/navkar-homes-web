import { HeroSearch } from "@/components/home/hero-search";
import { TrendingProjects } from "@/components/home/trending-projects";
import { PremiumProjects } from "@/components/home/premium-projects";
import { PropertyGrid } from "@/components/home/property-grid";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PropertyType } from "@prisma/client";
import type { Property } from "@/types/property";

export const dynamic = "force-dynamic";

const propertyTypeLabel: Record<PropertyType, string> = {
  APARTMENT: "Apartment",
  VILLA: "Villa",
  INDEPENDENT_HOUSE: "Independent House",
  PLOT: "Plot",
  PENTHOUSE: "Penthouse",
  STUDIO: "Studio",
  FARMHOUSE: "Farmhouse",
};

async function getFeaturedProperties(): Promise<Property[]> {
  const session = await auth();

  const [rows, favoriteRows] = await Promise.all([
    prisma.property.findMany({
      where: { status: "ACTIVE" },
      include: { images: true },
      orderBy: { createdAt: "asc" },
    }),
    session?.user
      ? prisma.favorite.findMany({
          where: { userId: session.user.id },
          select: { propertyId: true },
        })
      : Promise.resolve([]),
  ]);

  const favoritedIds = new Set(favoriteRows.map((row) => row.propertyId));

  return rows.map((row) => {
    const coverImage = row.images.find((image) => image.isCover) ?? row.images[0];

    return {
      id: row.id,
      title: row.title,
      listingType: row.listingType,
      propertyType: propertyTypeLabel[row.propertyType],
      priceInRupees: row.priceInRupees,
      priceUnit: row.priceUnit,
      areaSqft: row.areaSqft,
      locality: row.locality,
      city: row.city,
      state: row.state,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      isFeatured: row.isFeatured,
      coverImageUrl: coverImage?.url ?? "",
      isFavorited: favoritedIds.has(row.id),
    };
  });
}

export default async function Home() {
  const properties = await getFeaturedProperties();

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
          Hand-picked listings in Jaipur&apos;s most iconic localities.
        </p>

        <div className="mt-8">
          <PropertyGrid properties={properties} />
        </div>
      </section>
    </div>
  );
}
