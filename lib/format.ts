export function formatINR(rupees: number): string {
  if (rupees >= 1_00_00_000) {
    return `₹${(rupees / 1_00_00_000).toFixed(1)} Cr`;
  }
  if (rupees >= 1_00_000) {
    return `₹${(rupees / 1_00_000).toFixed(1)} L`;
  }
  return `₹${rupees.toLocaleString("en-IN")}`;
}

export function formatArea(sqft: number): string {
  return `${sqft.toLocaleString("en-IN")} sqft`;
}
