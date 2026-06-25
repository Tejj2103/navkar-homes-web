"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload, type UploadedImage } from "@/components/list-property/image-upload";
import { facingOptions, constructionStatusOptions, featureOptions } from "@/lib/property-options";

const propertyTypeOptions = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa" },
  { value: "INDEPENDENT_HOUSE", label: "Independent House" },
  { value: "PLOT", label: "Plot" },
  { value: "PENTHOUSE", label: "Penthouse" },
  { value: "STUDIO", label: "Studio" },
  { value: "FARMHOUSE", label: "Farmhouse" },
] as const;

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  listingType: z.enum(["SALE", "RENT"]),
  propertyType: z.enum([
    "APARTMENT",
    "VILLA",
    "INDEPENDENT_HOUSE",
    "PLOT",
    "PENTHOUSE",
    "STUDIO",
    "FARMHOUSE",
  ]),
  priceInRupees: z.coerce.number().int().positive("Enter a valid price"),
  priceUnit: z.string().optional(),
  areaSqft: z.coerce.number().int().positive("Enter a valid area"),
  locality: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  pincode: z.string().min(1, "Required"),
  bedrooms: z.coerce.number().int().optional(),
  bathrooms: z.coerce.number().int().optional(),
  facing: z
    .enum(["NORTH", "SOUTH", "EAST", "WEST", "NORTH_EAST", "NORTH_WEST", "SOUTH_EAST", "SOUTH_WEST"])
    .optional(),
  constructionStatus: z.enum(["READY_TO_MOVE", "UNDER_CONSTRUCTION"]).optional(),
  roadWidthFeet: z.coerce.number().int().optional(),
  openSides: z.coerce.number().int().optional(),
  highlights: z.string().optional(),
});

type FormInput = z.input<typeof formSchema>;
type FormValues = z.output<typeof formSchema>;

export function PropertyForm({ isAdmin }: { isAdmin: boolean }) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const [hasBoundaryWall, setHasBoundaryWall] = useState(false);
  const [transactionType, setTransactionType] = useState<"NEW" | "RESALE">("RESALE");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { listingType: "SALE", propertyType: "APARTMENT" },
  });

  const listingType = watch("listingType");

  function toggleFeature(feature: string) {
    setSelectedFeatures((current) =>
      current.includes(feature)
        ? current.filter((item) => item !== feature)
        : [...current, feature],
    );
  }

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    setImagesError(null);

    if (images.length === 0) {
      setImagesError("Add at least one photo");
      return;
    }

    const highlights = values.highlights
      ? values.highlights.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    const response = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        highlights,
        isFeatured,
        images,
        hasBoundaryWall,
        transactionType,
        features: selectedFeatures,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setSubmitError(data?.error ?? "Something went wrong");
      return;
    }

    const { id } = await response.json();
    router.push(`/property/${id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={listingType === "SALE" ? "secondary" : "outline"}
          onClick={() => setValue("listingType", "SALE")}
        >
          Sale
        </Button>
        <Button
          type="button"
          variant={listingType === "RENT" ? "secondary" : "outline"}
          onClick={() => setValue("listingType", "RENT")}
        >
          Rent
        </Button>
      </div>

      <div>
        <Input placeholder="Title" {...register("title")} />
        {errors.title && (
          <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>
        )}
      </div>

      <Textarea placeholder="Description (optional)" {...register("description")} />

      <div>
        <Select
          defaultValue="APARTMENT"
          onValueChange={(value) =>
            setValue("propertyType", value as FormValues["propertyType"])
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Property type" />
          </SelectTrigger>
          <SelectContent>
            {propertyTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Input
            type="number"
            placeholder="Price (INR)"
            {...register("priceInRupees")}
          />
          {errors.priceInRupees && (
            <p className="mt-1 text-xs text-destructive">
              {errors.priceInRupees.message}
            </p>
          )}
        </div>
        {listingType === "RENT" && (
          <Input placeholder="Price unit (e.g. month)" {...register("priceUnit")} />
        )}
        <div>
          <Input type="number" placeholder="Area (sqft)" {...register("areaSqft")} />
          {errors.areaSqft && (
            <p className="mt-1 text-xs text-destructive">{errors.areaSqft.message}</p>
          )}
        </div>
        <Input type="number" placeholder="Bedrooms" {...register("bedrooms")} />
        <Input type="number" placeholder="Bathrooms" {...register("bathrooms")} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Input placeholder="Locality" {...register("locality")} />
          {errors.locality && (
            <p className="mt-1 text-xs text-destructive">{errors.locality.message}</p>
          )}
        </div>
        <div>
          <Input placeholder="City" {...register("city")} />
          {errors.city && (
            <p className="mt-1 text-xs text-destructive">{errors.city.message}</p>
          )}
        </div>
        <div>
          <Input placeholder="State" {...register("state")} />
          {errors.state && (
            <p className="mt-1 text-xs text-destructive">{errors.state.message}</p>
          )}
        </div>
        <div>
          <Input placeholder="Pincode" {...register("pincode")} />
          {errors.pincode && (
            <p className="mt-1 text-xs text-destructive">{errors.pincode.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select onValueChange={(value) => setValue("facing", value as FormValues["facing"])}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Facing" />
          </SelectTrigger>
          <SelectContent>
            {facingOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) =>
            setValue("constructionStatus", value as FormValues["constructionStatus"])
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Construction status" />
          </SelectTrigger>
          <SelectContent>
            {constructionStatusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Width of facing road (ft)"
          {...register("roadWidthFeet")}
        />
        <Input type="number" placeholder="No. of open sides" {...register("openSides")} />
      </div>

      <div className="flex items-center justify-between rounded-lg border border-border p-3">
        <span className="text-sm font-medium">Boundary Wall</span>
        <Switch checked={hasBoundaryWall} onCheckedChange={setHasBoundaryWall} />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant={transactionType === "NEW" ? "secondary" : "outline"}
          onClick={() => setTransactionType("NEW")}
        >
          New
        </Button>
        <Button
          type="button"
          variant={transactionType === "RESALE" ? "secondary" : "outline"}
          onClick={() => setTransactionType("RESALE")}
        >
          Resale
        </Button>
      </div>

      <div>
        <Input
          placeholder="Key highlights, comma-separated (e.g. North-East Facing, Gated Compliant)"
          {...register("highlights")}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Features</p>
        <div className="grid grid-cols-2 gap-2">
          {featureOptions.map((feature) => (
            <label key={feature} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectedFeatures.includes(feature)}
                onCheckedChange={() => toggleFeature(feature)}
              />
              {feature}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Photos</p>
        <ImageUpload value={images} onChange={setImages} />
        {imagesError && (
          <p className="mt-1 text-xs text-destructive">{imagesError}</p>
        )}
      </div>

      {isAdmin && (
        <div className="flex items-center justify-between rounded-lg border border-border p-3">
          <span className="text-sm font-medium">Mark as Premium</span>
          <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
        </div>
      )}

      {submitError && <p className="text-sm text-destructive">{submitError}</p>}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-accent text-accent-foreground hover:bg-accent/90"
      >
        {isSubmitting ? "Submitting..." : "Submit listing"}
      </Button>
    </form>
  );
}
