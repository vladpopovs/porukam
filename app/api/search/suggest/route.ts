import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
    POPULAR_SEARCHES,
    getSearchScore,
    getSearchVariants,
    normalizeSearchText,
} from "@/lib/search";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const q = String(searchParams.get("q") || "").trim();
    const city = String(searchParams.get("city") || "").trim();

    if (!q) {
        return NextResponse.json({
            suggestions: POPULAR_SEARCHES.map((query) => ({
                query,
                subtitle: "Популярный запрос",
                type: "popular",
            })),
        });
    }

    const variants = getSearchVariants(q);

    const cityFilter =
        city && city !== "Вся Россия"
            ? {
                city,
            }
            : {};

    const candidateListings = await prisma.listing.findMany({
        where: {
            status: "active",
            ...cityFilter,
        },
        select: {
            id: true,
            title: true,
            description: true,
            category: true,
            location: true,
            price: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 250,
    });

    const scored = candidateListings
        .map((listing) => ({
            listing,
            score: getSearchScore({
                query: q,
                title: listing.title,
                description: listing.description,
                category: listing.category,
                location: listing.location,
            }),
        }))
        .filter((item) => item.score > 8)
        .sort((a, b) => b.score - a.score);

    const suggestions = new Map<
        string,
        {
            query: string;
            subtitle: string;
            type: string;
        }
    >();

    for (const item of scored.slice(0, 8)) {
        const key = normalizeSearchText(item.listing.title);

        if (!suggestions.has(key)) {
            suggestions.set(key, {
                query: item.listing.title,
                subtitle: `${item.listing.category} · ${item.listing.price.toLocaleString(
                    "ru-RU"
                )} ₽`,
                type: "listing",
            });
        }
    }

    for (const variant of variants.slice(0, 6)) {
        const key = normalizeSearchText(variant);

        if (!suggestions.has(key)) {
            suggestions.set(key, {
                query: variant,
                subtitle: "Похожий запрос",
                type: "variant",
            });
        }
    }

    return NextResponse.json({
        suggestions: Array.from(suggestions.values()).slice(0, 10),
    });
}