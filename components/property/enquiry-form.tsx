"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EnquiryForm() {
  return (
    <form onSubmit={(event) => event.preventDefault()} className="flex flex-col gap-3">
      <Input placeholder="Your name" />
      <Input placeholder="Phone number" type="tel" />
      <p className="text-xs text-muted-foreground">
        By submitting, you agree to our Terms &amp; Conditions and Privacy Policy.
      </p>
      <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
        Send Enquiry
      </Button>
    </form>
  );
}
