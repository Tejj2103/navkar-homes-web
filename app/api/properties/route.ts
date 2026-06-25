import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const propertyTypeValues = [
  "APARTMENT",
  "VILLA",
  "INDEPENDENT_HOUSE",
  "PLOT",
  "PENTHOUSE",
  "STUDIO",
  "FARMHOUSE",
] as const;

const createPropertySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  listingType: z.enum(["SALE", "RENT"]),
  propertyType: z.enum(propertyTypeValues),
  priceInRupees: z.coerce.number().int().positive(),
  priceUnit: z.string().optional(),
  areaSqft: z.coerce.number().int().positive(),
  locality: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(1),
  bedrooms: z.coerce.number().int().optional(),
  bathrooms: z.coerce.number().int().optional(),
  images: z
    .array(z.object({ url: z.string().url(), isCover: z.boolean() }))
    .min(1, "Add at least one photo"),
  isFeatured: z.boolean().optional(),
  facing: z
    .enum(["NORTH", "SOUTH", "EAST", "WEST", "NORTH_EAST", "NORTH_WEST", "SOUTH_EAST", "SOUTH_WEST"])
    .optional(),
  hasBoundaryWall: z.boolean().optional(),
  constructionStatus: z.enum(["READY_TO_MOVE", "UNDER_CONSTRUCTION"]).optional(),
  roadWidthFeet: z.coerce.number().int().optional(),
  openSides: z.coerce.number().int().optional(),
  transactionType: z.enum(["NEW", "RESALE"]).optional(),
  highlights: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createPropertySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const isAdmin = session.user.role === "ADMIN";
  const data = parsed.data;

  const images = data.images.some((image) => image.isCover)
    ? data.images
    : data.images.map((image, index) => ({ ...image, isCover: index === 0 }));

  const property = await prisma.property.create({
    data: {
      title: data.title,
      description: data.description,
      listingType: data.listingType,
      propertyType: data.propertyType,
      priceInRupees: data.priceInRupees,
      priceUnit: data.listingType === "RENT" ? data.priceUnit : null,
      areaSqft: data.areaSqft,
      locality: data.locality,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      isFeatured: isAdmin ? Boolean(data.isFeatured) : false,
      status: isAdmin ? "ACTIVE" : "PENDING_REVIEW",
      ownerId: session.user.id,
      facing: data.facing,
      hasBoundaryWall: data.hasBoundaryWall,
      constructionStatus: data.constructionStatus,
      roadWidthFeet: data.roadWidthFeet,
      openSides: data.openSides,
      transactionType: data.transactionType,
      highlights: data.highlights ?? [],
      features: data.features ?? [],
      images: {
        create: images.map((image, index) => ({
          url: image.url,
          isCover: image.isCover,
          sortOrder: index,
        })),
      },
    },
  });

  return NextResponse.json({ id: property.id, status: property.status });
}
