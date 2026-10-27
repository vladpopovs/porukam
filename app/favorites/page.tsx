import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { ListingCard } from "@/components/ListingCard";
import { prisma } from "@/lib/prisma";
import { requireUserProfile } from "@/lib/auth";
import { Heart, Search, Sparkles } from "lucide-react";

export const metadata = {
    title: "Избранное",
};

export default async function FavoritesPage() {
    const { profile } = await requireUserProfile();

    const favorites = await prisma.favorite.findMany({
        where: {
            userId: profile.id,
            listing: {
                status: {
                    in: ["active", "sold"],
                },
            },
        },
        include: {
            listing: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const activeCount = favorites.filter(
        (favorite) => favorite.listing.status === "active"
    ).length;

    return (
        <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
            <SiteHeader compact />

            <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="mb-8 grid grid-cols-1 gap-5 rounded-[2.5rem] bg-white p-6 shadow-sm md:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-[#ff4b00]">
                            <Heart size={18} fill="currentColor" />
                            Сохранённые объявления
                        </div>

                        <h1 className="text-5xl font-black tracking-tight">Избранное</h1>

                        <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-700">
                            Здесь лежат объявления, которые вы сохранили. Можно вернуться к
                            ним позже, написать продавцу или договориться “По рукам”.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:w-80">
                        <Stat value={String(favorites.length)} label="всего" />
                        <Stat value={String(activeCount)} label="активно" />
                    </div>
                </div>

                {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {favorites.map((favorite) => (
                            <ListingCard key={favorite.id} listing={favorite.listing} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-[2.5rem] bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-orange-100 text-[#ff4b00]">
                            <Sparkles size={42} />
                        </div>

                        <h2 className="mt-6 text-3xl font-black">
                            В избранном пока пусто
                        </h2>

                        <p className="mx-auto mt-3 max-w-xl leading-7 text-neutral-600">
                            Нажмите сердечко на карточке объявления, и оно появится здесь.
                        </p>

                        <Link
                            href="/search"
                            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-7 py-4 font-black text-white shadow-lg shadow-orange-200"
                        >
                            <Search size={20} />
                            Смотреть объявления
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div className="rounded-3xl bg-[#fff7ed] p-5 text-center">
            <div className="text-3xl font-black">{value}</div>
            <div className="mt-1 text-sm font-bold text-neutral-500">{label}</div>
        </div>
    );
}