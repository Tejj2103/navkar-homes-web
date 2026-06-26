import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const profileUpdateSchema = z
  .object({
    username: z.string().min(1).max(30),
    email: z.string().email(),
    address: z.string().max(200),
    nickname: z.string().max(50),
    dateOfBirth: z.coerce.date(),
    image: z.string().url(),
  })
  .partial();

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  if (Object.keys(parsed.data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  if (parsed.data.username) {
    const existing = await prisma.user.findUnique({
      where: { username: parsed.data.username },
    });
    if (existing && existing.id !== session.user.id) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
  }

  if (parsed.data.email) {
    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing && existing.id !== session.user.id) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: parsed.data,
  });

  return NextResponse.json({
    username: updated.username,
    email: updated.email,
    address: updated.address,
    nickname: updated.nickname,
    dateOfBirth: updated.dateOfBirth,
    image: updated.image,
  });
}
