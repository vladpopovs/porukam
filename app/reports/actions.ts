"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUserProfile } from "@/lib/auth";

export async function createReport(formData: FormData) {
    const { profile } = await requireUserProfile();

    const listingId = String(formData.get("listingId") || "");
    const reason = String(formData.get("reason") || "").trim();
    const text = String(formData.get("text") || "").trim();

    if (!listingId || !reason) {
        redirect("/search");
    }

    const listing = await prisma.listing.findUnique({
        where: {
            id: listingId,
        },
    });

    if (!listing) {
        redirect("/search");
    }

    if (listing.sellerId === profile.id) {
        redirect(`/listing/${listingId}`);
    }

    const existingReport = await prisma.report.findFirst({
        where: {
            listingId,
            userId: profile.id,
            status: "new",
        },
    });

    if (!existingReport) {
        await prisma.report.create({
            data: {
                listingId,
                userId: profile.id,
                reason,
                text,
                status: "new",
            },
        });
    }

    redirect(`/listing/${listingId}?reported=1`);
}