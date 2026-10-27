"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function approveListing(formData: FormData) {
  await requireAdmin();

  const listingId = String(formData.get("listingId") || "");

  await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      status: "active",
      badge: "Проверен",
      rejectionReason: "",
    },
  });

  revalidatePath("/moderation");
  revalidatePath("/search");
  revalidatePath("/");
  revalidatePath(`/listing/${listingId}`);
}

export async function rejectListing(formData: FormData) {
  await requireAdmin();

  const listingId = String(formData.get("listingId") || "");
  const reason = String(formData.get("reason") || "").trim();

  await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      status: "rejected",
      badge: "Отклонено",
      rejectionReason: reason || "Объявление отклонено модератором",
    },
  });

  revalidatePath("/moderation");
  revalidatePath("/profile");
  revalidatePath(`/listing/${listingId}`);
}

export async function approveVerification(formData: FormData) {
  await requireAdmin();

  const requestId = String(formData.get("requestId") || "");

  const request = await prisma.verificationRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: "approved",
    },
  });

  await prisma.user.update({
    where: {
      id: request.userId,
    },
    data: {
      isVerified: true,
      verificationStatus: "approved",
    },
  });

  revalidatePath("/moderation");
  revalidatePath("/profile");
}

export async function rejectVerification(formData: FormData) {
  await requireAdmin();

  const requestId = String(formData.get("requestId") || "");

  const request = await prisma.verificationRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: "rejected",
    },
  });

  await prisma.user.update({
    where: {
      id: request.userId,
    },
    data: {
      isVerified: false,
      verificationStatus: "rejected",
    },
  });

  revalidatePath("/moderation");
  revalidatePath("/profile");
}

export async function resolveReport(formData: FormData) {
  await requireAdmin();

  const reportId = String(formData.get("reportId") || "");

  await prisma.report.update({
    where: {
      id: reportId,
    },
    data: {
      status: "resolved",
    },
  });

  revalidatePath("/moderation");
}

export async function ignoreReport(formData: FormData) {
  await requireAdmin();

  const reportId = String(formData.get("reportId") || "");

  await prisma.report.update({
    where: {
      id: reportId,
    },
    data: {
      status: "ignored",
    },
  });

  revalidatePath("/moderation");
}