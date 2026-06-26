import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { LogoutButton } from "@/components/profile/logout-button";
import { AvatarUpload } from "@/components/profile/avatar-upload";
import { ProfileField } from "@/components/profile/profile-field";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/profile");
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    redirect("/login?callbackUrl=/profile");
  }

  const dobValue = user.dateOfBirth
    ? user.dateOfBirth.toISOString().slice(0, 10)
    : "";
  const dobDisplay = user.dateOfBirth
    ? user.dateOfBirth.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <div className="rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-col items-center gap-2 text-center">
          <AvatarUpload image={user.image} />
          <h1 className="font-heading text-xl font-semibold tracking-tight">
            {user.name ?? "Your account"}
          </h1>
          <Badge variant="outline">{user.role === "ADMIN" ? "Admin" : "User"}</Badge>
        </div>

        <div className="mt-6">
          <ProfileField label="Username" field="username" value={user.username} />
          <ProfileField label="Email" field="email" value={user.email} type="email" />
          <ProfileField label="Address" field="address" value={user.address} />
          <ProfileField label="Nickname" field="nickname" value={user.nickname} />
          <ProfileField
            label="DOB"
            field="dateOfBirth"
            value={dobValue}
            displayValue={dobDisplay}
            type="date"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <LogoutButton />
      </div>
    </div>
  );
}
