"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserProfile } from "@/lib/auth";

export async function toggleFavorite(formData: FormData) {
    const { profile } = await requireUserProfile();

    const listingId = String(formData.get("listingId") || "");

    if (!listingId) {
        return;
    }

    const listing = await prisma.listing.findUnique({
        where: {
            id: listingId,
        },
        select: {
            id: true,
            status: true,
            sellerId: true,
        },
    });

    if (!listing) {
        return;
    }

    if (listing.sellerId === profile.id) {
        return;
    }

    await prisma.$transaction(async (tx) => {
        const existingFavorite = await tx.favorite.findUnique({
            where: {
                userId_listingId: {
                    userId: profile.id,
                    listingId,
                },
            },
        });

        if (existingFavorite) {
            await tx.favorite.delete({
                where: {
                    id: existingFavorite.id,
                },
            });
        } else {
            if (listing.status !== "active") {
                return;
            }

            await tx.favorite.create({
                data: {
                    userId: profile.id,
                    listingId,
                },
            });
        }

        const actualFavoritesCount = await tx.favorite.count({
            where: {
                listingId,
            },
        });

        await tx.listing.update({
            where: {
                id: listingId,
            },
            data: {
                favorites: actualFavoritesCount,
            },
        });
    });

    revalidatePath("/");
    revalidatePath("/search");
    revalidatePath("/favorites");
    revalidatePath(`/listing/${listingId}`);
}