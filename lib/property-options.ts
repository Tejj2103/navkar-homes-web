export const facingOptions = [
  { value: "NORTH", label: "North" },
  { value: "SOUTH", label: "South" },
  { value: "EAST", label: "East" },
  { value: "WEST", label: "West" },
  { value: "NORTH_EAST", label: "North-East" },
  { value: "NORTH_WEST", label: "North-West" },
  { value: "SOUTH_EAST", label: "South-East" },
  { value: "SOUTH_WEST", label: "South-West" },
] as const;

export const facingLabel: Record<string, string> = Object.fromEntries(
  facingOptions.map((option) => [option.value, option.label]),
);

export const constructionStatusOptions = [
  { value: "READY_TO_MOVE", label: "Ready to move" },
  { value: "UNDER_CONSTRUCTION", label: "Under construction" },
] as const;

export const constructionStatusLabel: Record<string, string> = Object.fromEntries(
  constructionStatusOptions.map((option) => [option.value, option.label]),
);

export const transactionTypeLabel: Record<string, string> = {
  NEW: "New",
  RESALE: "Resale",
};

export const featureOptions = [
  "Gated Compliant",
  "Maintenance Staff",
  "Water Storage",
  "Rain Water Harvesting",
] as const;
