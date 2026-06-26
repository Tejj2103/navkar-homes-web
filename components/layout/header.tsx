import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "@/components/layout/header-auth";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Home className="size-5 text-primary" />
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-xl font-semibold tracking-tight">
              Navkar Estates
            </span>
            <span className="text-xs text-muted-foreground">From Roots to Realty</span>
          </span>
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

        <div className="flex items-center gap-4">
          <HeaderAuth />
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/list-property">List your property</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
