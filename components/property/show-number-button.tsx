"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShowNumberButton({ phone }: { phone: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => setRevealed(true)}
      className="gap-2"
    >
      <Phone className="size-4" />
      {revealed ? phone : "Show Number"}
    </Button>
  );
}
