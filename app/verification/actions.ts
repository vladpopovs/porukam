"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUserProfile } from "@/lib/auth";

export async function requestVerification(formData: FormData) {
  const { profile } = await requireUserProfile();

  const text = String(formData.get("text") || "").trim();

  const existing = await prisma.verificationRequest.findFirst({
    where: {
      userId: profile.id,
      status: "pending",
    },
  });

  if (!existing) {
    await prisma.verificationRequest.create({
      data: {
        userId: profile.id,
        text,
        status: "pending",
      },
    });
  }

  await prisma.user.update({
    where: {
      id: profile.id,
    },
    data: {
      verificationStatus: "pending",
    },
  });

  redirect("/profile");
}