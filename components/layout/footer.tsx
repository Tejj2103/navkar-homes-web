export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-3">
        <div>
          <p className="font-heading text-lg font-semibold tracking-tight">Navkar Homes</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Discover apartments, villas, and plots for sale or rent across India.
          </p>
        </div>

        <div className="text-sm">
          <p className="font-medium text-foreground">Company</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>About</li>
            <li>Contact</li>
            <li>Careers</li>
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-medium text-foreground">Explore</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>Buy</li>
            <li>Rent</li>
            <li>Localities</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Navkar Homes. All rights reserved.
      </div>
    </footer>
  );
}
