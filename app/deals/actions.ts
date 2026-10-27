"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUserProfile } from "@/lib/auth";

export async function createDeal(formData: FormData) {
  const { profile } = await requireUserProfile();

  const listingId = String(formData.get("listingId") || "");
  const amountRaw = String(formData.get("amount") || "").replace(/\D/g, "");

  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing || listing.status !== "active") {
    redirect("/search");
  }

  if (!listing.sellerId) {
    redirect(`/listing/${listingId}`);
  }

  if (listing.sellerId === profile.id) {
    redirect(`/listing/${listingId}`);
  }

  const amount = Number(amountRaw || listing.price);

  if (!Number.isFinite(amount) || amount <= 0) {
    redirect(`/listing/${listingId}`);
  }

  const existingDeal = await prisma.deal.findFirst({
    where: {
      listingId,
      buyerId: profile.id,
      status: {
        in: ["pending", "confirmed"],
      },
    },
  });

  if (existingDeal) {
    redirect("/deals");
  }

  await prisma.deal.create({
    data: {
      listingId,
      buyerId: profile.id,
      sellerId: listing.sellerId,
      amount,
      status: "pending",
      buyerConfirmed: true,
      sellerConfirmed: false,
    },
  });

  await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      messages: {
        increment: 1,
      },
    },
  });

  redirect("/deals");
}

export async function confirmDeal(formData: FormData) {
  const { profile } = await requireUserProfile();

  const dealId = String(formData.get("dealId") || "");

  const deal = await prisma.deal.findUnique({
    where: {
      id: dealId,
    },
  });

  if (!deal) {
    redirect("/deals");
  }

  if (deal.status !== "pending" && deal.status !== "confirmed") {
    redirect("/deals");
  }

  const isBuyer = deal.buyerId === profile.id;
  const isSeller = deal.sellerId === profile.id;

  if (!isBuyer && !isSeller) {
    redirect("/deals");
  }

  const buyerConfirmed = isBuyer ? true : deal.buyerConfirmed;
  const sellerConfirmed = isSeller ? true : deal.sellerConfirmed;

  await prisma.deal.update({
    where: {
      id: dealId,
    },
    data: {
      buyerConfirmed,
      sellerConfirmed,
      status: buyerConfirmed && sellerConfirmed ? "confirmed" : "pending",
    },
  });

  redirect("/deals");
}

export async function completeDeal(formData: FormData) {
  const { profile } = await requireUserProfile();

  const dealId = String(formData.get("dealId") || "");

  const deal = await prisma.deal.findUnique({
    where: {
      id: dealId,
    },
  });

  if (!deal) {
    redirect("/deals");
  }

  const isBuyer = deal.buyerId === profile.id;
  const isSeller = deal.sellerId === profile.id;

  if (!isBuyer && !isSeller) {
    redirect("/deals");
  }

  if (deal.status !== "confirmed") {
    redirect("/deals");
  }

  await prisma.$transaction([
    prisma.deal.update({
      where: {
        id: dealId,
      },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    }),

    prisma.listing.update({
      where: {
        id: deal.listingId,
      },
      data: {
        status: "sold",
        badge: "Продано",
      },
    }),

    prisma.deal.updateMany({
      where: {
        listingId: deal.listingId,
        id: {
          not: deal.id,
        },
        status: {
          in: ["pending", "confirmed"],
        },
      },
      data: {
        status: "cancelled",
      },
    }),
  ]);

  redirect("/deals");
}

export async function cancelDeal(formData: FormData) {
  const { profile } = await requireUserProfile();

  const dealId = String(formData.get("dealId") || "");

  const deal = await prisma.deal.findUnique({
    where: {
      id: dealId,
    },
  });

  if (!deal) {
    redirect("/deals");
  }

  if (deal.buyerId !== profile.id && deal.sellerId !== profile.id) {
    redirect("/deals");
  }

  if (deal.status === "completed") {
    redirect("/deals");
  }

  await prisma.deal.update({
    where: {
      id: dealId,
    },
    data: {
      status: "cancelled",
    },
  });

  redirect("/deals");
}

export async function createReview(formData: FormData) {
  const { profile } = await requireUserProfile();

  const dealId = String(formData.get("dealId") || "");
  const ratingRaw = Number(formData.get("rating") || 5);
  const text = String(formData.get("text") || "").trim();

  const rating = Math.min(5, Math.max(1, ratingRaw));

  const deal = await prisma.deal.findUnique({
    where: {
      id: dealId,
    },
  });

  if (!deal || deal.status !== "completed") {
    redirect("/deals");
  }

  if (deal.buyerId !== profile.id && deal.sellerId !== profile.id) {
    redirect("/deals");
  }

  const receiverId = deal.buyerId === profile.id ? deal.sellerId : deal.buyerId;

  const existingReview = await prisma.review.findFirst({
    where: {
      dealId,
      reviewerId: profile.id,
    },
  });

  if (!existingReview) {
    await prisma.review.create({
      data: {
        dealId,
        listingId: deal.listingId,
        reviewerId: profile.id,
        receiverId,
        rating,
        text,
      },
    });
  }

  redirect("/deals");
}