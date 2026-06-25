import { redirect } from "next/navigation";
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/profile/logout-button";
import { auth } from "@/lib/auth";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-accent-soft text-accent">
          <User className="size-7" />
        </span>
        <div>
          <h1 className="font-heading text-xl font-semibold tracking-tight">
            {session.user.name ?? "Your account"}
          </h1>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </div>
        <Badge variant="outline">
          {session.user.role === "ADMIN" ? "Admin" : "User"}
        </Badge>
      </div>

      <div className="mt-8">
        <LogoutButton />
      </div>
    </div>
  );
}
