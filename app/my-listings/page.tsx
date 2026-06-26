import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/format";
import type { PropertyStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const statusLabel: Record<PropertyStatus, string> = {
  ACTIVE: "Live",
  PENDING_REVIEW: "Pending review",
  DRAFT: "Draft",
  SOLD: "Sold",
  RENTED: "Rented",
  INACTIVE: "Inactive",
};

function statusBadgeClassName(status: PropertyStatus) {
  if (status === "ACTIVE") return "bg-accent-soft text-accent hover:bg-accent-soft";
  if (status === "PENDING_REVIEW") return "border-border text-foreground";
  return "bg-secondary text-secondary-foreground";
}

export default async function MyListingsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/my-listings");
  }

  const properties = await prisma.property.findMany({
    where: { ownerId: session.user.id },
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">My Listings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Properties you&apos;ve submitted, and their current status.
      </p>

      {properties.length === 0 && (
        <div className="mt-8 rounded-lg border border-border p-6 text-center text-sm text-muted-foreground">
          You haven&apos;t listed any properties yet.{" "}
          <Link href="/list-property" className="font-medium text-accent">
            List your property
          </Link>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4">
        {properties.map((property) => {
          const coverImage =
            property.images.find((image) => image.isCover) ?? property.images[0];
          const price = formatINR(property.priceInRupees);
          const priceLabel = property.priceUnit
            ? `${price}/${property.priceUnit}`
            : price;

          return (
            <Link
              key={property.id}
              href={`/property/${property.id}`}
              className="flex gap-4 rounded-lg border border-border bg-card p-3 shadow-[var(--shadow-card)] transition-colors hover:border-accent"
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface">
                {coverImage && (
                  <Image
                    src={coverImage.url}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-heading text-base font-semibold tracking-tight">
                    {priceLabel}
                  </p>
                  <Badge className={statusBadgeClassName(property.status)}>
                    {statusLabel[property.status]}
                  </Badge>
                </div>
                <p className="truncate text-sm font-medium">{property.title}</p>
                <p className="text-xs text-muted-foreground">
                  {property.locality}, {property.city}
                </p>

                {property.status === "PENDING_REVIEW" && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    Looks good — awaiting admin approval before it goes live.
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
