import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PropertyForm } from "@/components/list-property/property-form";

export default async function ListPropertyPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/list-property");
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        List your property
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {session.user.role === "ADMIN"
          ? "Listings you create go live immediately."
          : "Your listing will be reviewed by our team before it goes live."}
      </p>

      <div className="mt-8">
        <PropertyForm isAdmin={session.user.role === "ADMIN"} />
      </div>
    </div>
  );
}
