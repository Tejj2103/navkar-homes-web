import Link from "next/link";
import { redirect } from "next/navigation";
import { PropertyGrid } from "@/components/home/property-grid";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/favorites");
  }

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { property: { include: { images: true } } },
    orderBy: { createdAt: "desc" },
  });

  const properties: Property[] = favorites.map(({ property: row }) => {
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
      isFavorited: true,
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Favorites</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Properties you&apos;ve saved for later.
      </p>

      {properties.length === 0 ? (
        <div className="mt-8 rounded-lg border border-border p-6 text-center text-sm text-muted-foreground">
          You haven&apos;t saved any properties yet.{" "}
          <Link href="/" className="font-medium text-accent">
            Browse listings
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          <PropertyGrid properties={properties} />
        </div>
      )}
    </div>
  );
}
