import { notFound } from "next/navigation";
import {
  Bath,
  Bed,
  Ruler,
  Calendar,
  MapPin,
  Compass,
  Building2,
  Fence,
  CheckCircle2,
  XCircle,
  Users,
  BookOpen,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageGallery } from "@/components/property/image-gallery";
import { ShowNumberButton } from "@/components/property/show-number-button";
import { EnquiryForm } from "@/components/property/enquiry-form";
import { PriceTrendChart } from "@/components/property/price-trend-chart";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatArea, formatINR } from "@/lib/format";
import {
  facingLabel,
  constructionStatusLabel,
  transactionTypeLabel,
  featureOptions,
} from "@/lib/property-options";

export const dynamic = "force-dynamic";

const propertyTypeLabel: Record<string, string> = {
  APARTMENT: "Apartment",
  VILLA: "Villa",
  INDEPENDENT_HOUSE: "Independent House",
  PLOT: "Plot",
  PENTHOUSE: "Penthouse",
  STUDIO: "Studio",
  FARMHOUSE: "Farmhouse",
};

// Dummy placeholder data — platform-computed/marketing content, not listing input.
const buyingGuideTips = [
  "Always verify the seller's identity",
  "Prefer a registered sale agreement",
  "Cross-check ownership documents",
  "Check encumbrance and land-use records",
];

function buildPriceTrend(currentPricePerSqft: number) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month, index) => ({
    month,
    price: Math.round(currentPricePerSqft * (0.88 + index * 0.011)),
  }));
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      owner: { select: { name: true, role: true } },
    },
  });

  if (!property) {
    notFound();
  }

  if (property.status !== "ACTIVE") {
    const session = await auth();
    const isOwner = session?.user.id === property.ownerId;
    const isAdmin = session?.user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      notFound();
    }
  }

  const price = formatINR(property.priceInRupees);
  const priceLabel = property.priceUnit ? `${price}/${property.priceUnit}` : price;
  const pricePerSqft = Math.round(property.priceInRupees / property.areaSqft);
  const postedBy = property.owner?.role === "ADMIN" ? "Dealer" : "Owner";
  const postedDate = property.createdAt.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const priceTrend = buildPriceTrend(pricePerSqft);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-center gap-2">
        <Badge className="bg-accent-soft text-accent hover:bg-accent-soft">
          {property.listingType === "SALE" ? "For Sale" : "For Rent"}
        </Badge>
        {property.isFeatured && (
          <Badge className="bg-accent text-accent-foreground hover:bg-accent">
            Premium
          </Badge>
        )}
        {property.status !== "ACTIVE" && (
          <Badge variant="outline">Pending review</Badge>
        )}
        <Badge variant="outline" className="gap-1">
          <ShieldCheck className="size-3.5" /> Verified
        </Badge>
      </div>

      {property.images.length > 0 && (
        <div className="mt-4">
          <ImageGallery images={property.images} alt={property.title} />
        </div>
      )}

      <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <Users className="size-3.5" /> 12 people recently contacted the seller for this property
      </p>

      <div className="mt-6 flex flex-col gap-1">
        <p className="font-heading text-3xl font-semibold tracking-tight">
          {priceLabel}
        </p>
        <h1 className="text-xl font-medium">{property.title}</h1>
        <p className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="size-4" />
          {property.locality}, {property.city}, {property.state}
        </p>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="size-3.5" /> Posted on {postedDate}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-6 rounded-lg border border-border p-4 text-sm">
        {property.bedrooms != null && (
          <span className="flex items-center gap-2">
            <Bed className="size-4 text-muted-foreground" /> {property.bedrooms} Beds
          </span>
        )}
        {property.bathrooms != null && (
          <span className="flex items-center gap-2">
            <Bath className="size-4 text-muted-foreground" /> {property.bathrooms} Baths
          </span>
        )}
        <span className="flex items-center gap-2">
          <Ruler className="size-4 text-muted-foreground" />
          {formatArea(property.areaSqft)}
        </span>
        <span className="text-muted-foreground">
          {propertyTypeLabel[property.propertyType] ?? property.propertyType}
        </span>
      </div>

      {/* Key facts */}
      <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-border p-4 sm:grid-cols-3">
        <div>
          <p className="text-xs text-muted-foreground">Price per sqft</p>
          <p className="text-sm font-medium">₹{pricePerSqft.toLocaleString("en-IN")}/sqft</p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Compass className="size-3.5" /> Facing
          </p>
          <p className="text-sm font-medium">
            {property.facing ? facingLabel[property.facing] : "Not specified"}
          </p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Fence className="size-3.5" /> Boundary Wall
          </p>
          <p className="text-sm font-medium">
            {property.hasBoundaryWall == null ? "Not specified" : property.hasBoundaryWall ? "Yes" : "No"}
          </p>
        </div>
        <div>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Building2 className="size-3.5" /> Construction Status
          </p>
          <p className="text-sm font-medium">
            {property.constructionStatus
              ? constructionStatusLabel[property.constructionStatus]
              : "Not specified"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Width of Facing Road</p>
          <p className="text-sm font-medium">
            {property.roadWidthFeet != null ? `${property.roadWidthFeet} Feet` : "Not specified"}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">No. of Open Sides</p>
          <p className="text-sm font-medium">{property.openSides ?? "Not specified"}</p>
        </div>
      </div>

      {/* Key highlights */}
      {property.highlights.length > 0 && (
        <div className="mt-6">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Why you should consider this property
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {property.highlights.map((highlight) => (
              <span
                key={highlight}
                className="flex items-center gap-1 rounded-lg bg-accent-soft px-3 py-1.5 text-sm text-accent"
              >
                <CheckCircle2 className="size-4" /> {highlight}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-6 rounded-lg border border-border p-4 text-sm text-muted-foreground">
        <span>
          Transaction Type:{" "}
          <span className="font-medium text-foreground">
            {property.transactionType
              ? transactionTypeLabel[property.transactionType]
              : "Not specified"}
          </span>
        </span>
        <span>
          Posted by: <span className="font-medium text-foreground">{postedBy}</span>
        </span>
      </div>

      {/* About property */}
      <div className="mt-6">
        <h2 className="font-heading text-lg font-semibold tracking-tight">
          About this property
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {property.locality}, {property.city}, {property.state} - {property.pincode}
        </p>
        {property.description && (
          <p className="mt-2 whitespace-pre-line text-muted-foreground">
            {property.description}
          </p>
        )}
      </div>

      {/* Features */}
      <div className="mt-6">
        <h2 className="font-heading text-lg font-semibold tracking-tight">Features</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {featureOptions.map((feature) => {
            const active = property.features.includes(feature);
            return (
              <span
                key={feature}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                {active ? (
                  <CheckCircle2 className="size-4 text-accent" />
                ) : (
                  <XCircle className="size-4 text-muted-foreground/50" />
                )}
                {feature}
              </span>
            );
          })}
        </div>
      </div>

      {/* Dealer details + enquiry */}
      <div className="mt-8 grid gap-6 rounded-lg border border-border p-4 sm:grid-cols-2">
        <div>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            {postedBy} Details
          </h2>
          <p className="mt-2 text-sm font-medium">{property.owner?.name ?? "Property Owner"}</p>
          <p className="text-xs text-muted-foreground">
            Listed {postedBy.toLowerCase()} on Navkar Homes
          </p>
          <div className="mt-4">
            <ShowNumberButton phone="+91 98XXXXXX21" />
          </div>
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Send an enquiry
          </h2>
          <div className="mt-3">
            <EnquiryForm />
          </div>
        </div>
      </div>

      {/* Buying guide */}
      <div className="mt-8 rounded-lg border border-border bg-surface p-4">
        <h2 className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight">
          <BookOpen className="size-5" /> Your guide to informed buying
        </h2>
        <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
          {buyingGuideTips.map((tip) => (
            <li key={tip} className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-accent" /> {tip}
            </li>
          ))}
        </ul>
        <Button variant="outline" size="sm" className="mt-4">
          Read Buying Guide
        </Button>
      </div>

      {/* Price insights */}
      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold tracking-tight">Price Insights</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border p-4 text-sm">
            Property price range in {property.locality} starts from{" "}
            <span className="font-medium">
              {formatINR(Math.round(property.priceInRupees * 0.85))}
            </span>{" "}
            and goes up to{" "}
            <span className="font-medium">
              {formatINR(Math.round(property.priceInRupees * 1.4))}
            </span>
            .
          </div>
          <div className="rounded-lg border border-border p-4 text-sm">
            This property is priced{" "}
            <span className="font-medium text-accent">3% below</span> similar listings
            in {property.city}.
          </div>
        </div>
      </div>

      {/* Price trend + comparison */}
      <div className="mt-8">
        <h2 className="flex items-center gap-2 font-heading text-lg font-semibold tracking-tight">
          <TrendingUp className="size-5" /> Price Trend &amp; Comparison
        </h2>
        <p className="text-sm text-muted-foreground">
          Average price trend in {property.locality} over the last year
        </p>
        <div className="mt-4 rounded-lg border border-border p-4">
          <PriceTrendChart data={priceTrend} />
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface text-left text-xs text-muted-foreground">
              <tr>
                <th className="p-3">Locality</th>
                <th className="p-3">Current Price</th>
                <th className="p-3">Last 1 Year</th>
                <th className="p-3">Last 5 Years</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border font-medium">
                <td className="p-3">{property.locality}</td>
                <td className="p-3">₹{pricePerSqft.toLocaleString("en-IN")}/sqft</td>
                <td className="p-3 text-accent">+5.8%</td>
                <td className="p-3 text-accent">+22%</td>
              </tr>
              <tr className="border-t border-border text-muted-foreground">
                <td className="p-3">Nearby Locality</td>
                <td className="p-3">
                  ₹{Math.round(pricePerSqft * 0.92).toLocaleString("en-IN")}/sqft
                </td>
                <td className="p-3">+3.1%</td>
                <td className="p-3">+15%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-lg bg-surface p-6 text-center sm:flex-row sm:text-left">
        <p className="font-medium">
          Check property rates &amp; trends for any locality or society
        </p>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          See Price Trends
        </Button>
      </div>
    </div>
  );
}
