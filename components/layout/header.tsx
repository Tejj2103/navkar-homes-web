import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-xl font-semibold tracking-tight"
        >
          <Home className="size-5 text-primary" />
          Navkar Homes
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link href="#" className="transition-colors hover:text-foreground">
            Buy
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            Rent
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            Localities
          </Link>
        </nav>

        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          List your property
        </Button>
      </div>
    </header>
  );
}
