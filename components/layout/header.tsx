import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeaderAuth } from "@/components/layout/header-auth";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Home className="size-9 text-primary sm:size-12" />
          <span className="flex flex-col leading-tight">
            <span className="font-heading text-base font-semibold tracking-tight sm:text-xl">
              Navkar Estates
            </span>
            <span className="text-xs text-muted-foreground">From Roots to Realty</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
          <Link href="#" className="transition-colors hover:text-accent">
            Buy
          </Link>
          <Link href="#" className="transition-colors hover:text-accent">
            Rent
          </Link>
          <Link href="#" className="transition-colors hover:text-accent">
            Localities
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <HeaderAuth />
          <Button
            asChild
            className="bg-accent px-3 text-xs text-accent-foreground hover:bg-accent/90 sm:px-4 sm:text-sm"
          >
            <Link href="/list-property">
              <span className="sm:hidden">List</span>
              <span className="hidden sm:inline">List your property</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
