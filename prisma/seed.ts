import { PrismaClient, PropertyType } from "@prisma/client";
import { seedProperties } from "../lib/seed-data";

const prisma = new PrismaClient();

const propertyTypeMap: Record<string, PropertyType> = {
  Apartment: PropertyType.APARTMENT,
  Villa: PropertyType.VILLA,
  "Independent House": PropertyType.INDEPENDENT_HOUSE,
  Plot: PropertyType.PLOT,
  Penthouse: PropertyType.PENTHOUSE,
  Studio: PropertyType.STUDIO,
  Farmhouse: PropertyType.FARMHOUSE,
};

async function main() {
  await prisma.propertyImage.deleteMany();
  await prisma.property.deleteMany();

  for (const property of seedProperties) {
    await prisma.property.create({
      data: {
        title: property.title,
        listingType: property.listingType,
        propertyType: propertyTypeMap[property.propertyType],
        priceInRupees: property.priceInRupees,
        priceUnit: property.priceUnit,
        areaSqft: property.areaSqft,
        locality: property.locality,
        city: property.city,
        state: property.state,
        pincode: "000000",
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        isFeatured: property.isFeatured,
        images: {
          create: {
            url: property.coverImageUrl,
            isCover: true,
          },
        },
      },
    });
  }

  console.log(`Seeded ${seedProperties.length} properties.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
