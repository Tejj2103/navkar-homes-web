export type Property = {
  id: string;
  title: string;
  listingType: "SALE" | "RENT";
  propertyType: string;
  priceInRupees: number;
  priceUnit?: string | null;
  areaSqft: number;
  locality: string;
  city: string;
  state: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  isFeatured: boolean;
  coverImageUrl: string;
};
