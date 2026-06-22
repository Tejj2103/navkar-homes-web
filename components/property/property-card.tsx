import Image from "next/image";
import { Bath, Bed, Heart, Ruler } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatArea, formatINR } from "@/lib/format";
import type { Property } from "@/types/property";

export function PropertyCard({ property }: { property: Property }) {
  const price = formatINR(property.priceInRupees);
  const priceLabel = property.priceUnit ? `${price}/${property.priceUnit}` : price;

  return (
    <div className="group overflow-hidden rounded-lg bg-card shadow-[var(--shadow-card)] transition-transform hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.coverImageUrl}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <Badge className="absolute left-3 top-3 bg-accent-soft text-accent hover:bg-accent-soft">
          {property.listingType === "SALE" ? "For Sale" : "For Rent"}
        </Badge>

        <button
          type="button"
          aria-label="Save property"
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-foreground backdrop-blur transition-colors hover:bg-white"
        >
          <Heart className="size-4" />
        </button>
      </div>

      <div className="p-4">
        <p className="font-heading text-xl font-semibold tracking-tight">{priceLabel}</p>
        <p className="mt-1 truncate text-sm font-medium">{property.title}</p>
        <p className="text-sm text-muted-foreground">
          {property.locality}, {property.city}
        </p>

        <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <Bed className="size-4" /> {property.bedrooms}
            </span>
          )}
          {property.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath className="size-4" /> {property.bathrooms}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Ruler className="size-4" /> {formatArea(property.areaSqft)}
          </span>
        </div>
      </div>
    </div>
  );
}
