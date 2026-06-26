"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ProfileField({
  label,
  field,
  value,
  displayValue,
  type = "text",
}: {
  label: string;
  field: string;
  value: string | null;
  displayValue?: string | null;
  type?: "text" | "email" | "date";
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function save() {
    setError(null);
    setIsSaving(true);

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: draft }),
    });

    setIsSaving(false);

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(data?.error ?? "Something went wrong");
      return;
    }

    setIsEditing(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-1 border-b border-border py-3 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{label}</span>

        {isEditing ? (
          <div className="flex flex-1 items-center justify-end gap-2">
            <Input
              type={type}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="h-8 max-w-[200px]"
              autoFocus
            />
            <button
              type="button"
              onClick={save}
              disabled={isSaving}
              aria-label="Save"
              className="text-accent"
            >
              <Check className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setDraft(value ?? "");
                setError(null);
              }}
              aria-label="Cancel"
              className="text-muted-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {(displayValue ?? value) || "Not set"}
            </span>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              aria-label={`Edit ${label}`}
              className="text-accent"
            >
              <Pencil className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-right text-xs text-destructive">{error}</p>}
    </div>
  );
}
