import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { ListingCard } from "@/components/ListingCard";
import { prisma } from "@/lib/prisma";
import {
    ArrowLeft,
    CheckCircle2,
    MapPin,
    MessageCircle,
    PackageCheck,
    ShieldCheck,
    Star,
    UserRound,
} from "lucide-react";

export default async function SellerPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const seller = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!seller) {
        notFound();
    }

    const [activeListings, completedDealsCount, reviews] = await Promise.all([
        prisma.listing.findMany({
            where: {
                sellerId: seller.id,
                status: "active",
            },
            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.deal.count({
            where: {
                sellerId: seller.id,
                status: "completed",
            },
        }),

        prisma.review.findMany({
            where: {
                receiverId: seller.id,
            },
            include: {
                reviewer: true,
                listing: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        }),
    ]);

    const averageRating =
        reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
            : null;

    return (
        <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
            <SiteHeader compact />

            <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
                <Link
                    href="/search"
                    className="mb-6 inline-flex items-center gap-2 font-black text-[#ff4b00]"
                >
                    <ArrowLeft size={18} />
                    В каталог
                </Link>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
                    <aside className="space-y-5">
                        <div className="overflow-hidden rounded-[2.2rem] bg-white shadow-sm">
                            <div className="relative bg-gradient-to-br from-orange-100 via-white to-orange-200 p-6">
                                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#ff4b00]/20" />
                                <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#2ecc71]/20" />

                                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#ff4b00] text-white shadow-xl shadow-orange-200">
                                    <UserRound size={52} />
                                </div>

                                {seller.isVerified && (
                                    <div className="relative z-10 mt-5 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
                                        <CheckCircle2 size={18} />
                                        Проверенный продавец
                                    </div>
                                )}
                            </div>

                            <div className="p-6">
                                <h1 className="text-4xl font-black tracking-tight">
                                    {seller.name}
                                </h1>

                                <div className="mt-3 flex items-center gap-2 text-sm font-bold text-neutral-600">
                                    <MapPin size={16} className="text-[#ff4b00]" />
                                    {seller.city}
                                </div>

                                <div className="mt-2 break-words text-sm font-bold text-neutral-500">
                                    {seller.email}
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3">
                                    <MiniStat
                                        value={averageRating ? averageRating.toFixed(1) : "—"}
                                        label="рейтинг"
                                        icon={<Star size={18} className="fill-[#ff4b00] text-[#ff4b00]" />}
                                    />
                                    <MiniStat
                                        value={String(completedDealsCount)}
                                        label="сделок"
                                        icon={<PackageCheck size={18} />}
                                    />
                                    <MiniStat
                                        value={String(activeListings.length)}
                                        label="активно"
                                        icon={<MessageCircle size={18} />}
                                    />
                                    <MiniStat
                                        value={String(reviews.length)}
                                        label="отзывов"
                                        icon={<ShieldCheck size={18} />}
                                    />
                                </div>

                                <div className="mt-6 rounded-3xl bg-[#fff7ed] p-5">
                                    <h2 className="font-black">Доверие</h2>

                                    <div className="mt-4 space-y-3 text-sm font-bold text-neutral-700">
                                        <TrustItem
                                            active={seller.isVerified}
                                            text={
                                                seller.isVerified
                                                    ? "Профиль продавца проверен"
                                                    : "Профиль продавца пока не проверен"
                                            }
                                        />
                                        <TrustItem
                                            active={completedDealsCount > 0}
                                            text={`${completedDealsCount} завершённых сделок «По рукам»`}
                                        />
                                        <TrustItem
                                            active={reviews.length > 0}
                                            text={`${reviews.length} отзывов после сделок`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    <div className="space-y-6">
                        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                                <div>
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-[#ff4b00]">
                                        <ShieldCheck size={18} />
                                        Витрина продавца
                                    </div>

                                    <h2 className="text-4xl font-black tracking-tight">
                                        Объявления продавца
                                    </h2>

                                    <p className="mt-2 text-neutral-600">
                                        Активные объявления, отзывы и история доверия.
                                    </p>
                                </div>

                                <Link
                                    href="/search"
                                    className="rounded-2xl bg-[#ff4b00] px-6 py-4 text-center font-black text-white shadow-lg shadow-orange-200"
                                >
                                    Смотреть каталог
                                </Link>
                            </div>
                        </div>

                        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
                            <h2 className="text-3xl font-black">Активные объявления</h2>

                            {activeListings.length > 0 ? (
                                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                    {activeListings.map((listing) => (
                                        <ListingCard key={listing.id} listing={listing} />
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-6 rounded-3xl bg-[#fff7ed] p-8 text-center">
                                    <div className="text-2xl font-black">
                                        Активных объявлений пока нет
                                    </div>
                                    <p className="mt-2 text-neutral-600">
                                        Возможно, объявления продавца проданы или находятся на
                                        модерации.
                                    </p>
                                </div>
                            )}
                        </section>

                        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
                            <h2 className="text-3xl font-black">Отзывы</h2>
                            <p className="mt-2 text-sm leading-6 text-neutral-600">
                                Отзывы появляются после завершённых сделок «По рукам».
                            </p>

                            <div className="mt-6 space-y-4">
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="rounded-3xl border border-orange-100 bg-[#fff7ed] p-5"
                                        >
                                            <div className="flex flex-wrap items-center gap-2">
                                                <div className="font-black">{review.reviewer.name}</div>

                                                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-black text-[#ff4b00]">
                                                    <Star
                                                        size={15}
                                                        className="fill-[#ff4b00] text-[#ff4b00]"
                                                    />
                                                    {review.rating}
                                                </span>

                                                <span className="text-xs font-bold text-neutral-500">
                                                    {formatDate(review.createdAt)}
                                                </span>
                                            </div>

                                            {review.listing && (
                                                <Link
                                                    href={`/listing/${review.listing.id}`}
                                                    className="mt-2 block text-sm font-bold text-[#ff4b00]"
                                                >
                                                    {review.listing.title}
                                                </Link>
                                            )}

                                            <p className="mt-3 leading-7 text-neutral-700">
                                                {review.text || "Пользователь оставил оценку без текста."}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="rounded-3xl bg-[#fff7ed] p-8 text-center">
                                        <div className="text-2xl font-black">Отзывов пока нет</div>
                                        <p className="mt-2 text-neutral-600">
                                            После завершённых сделок отзывы появятся здесь.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </section>
        </main>
    );
}

function MiniStat({
    value,
    label,
    icon,
}: {
    value: string;
    label: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl bg-[#fff7ed] p-4">
            <div className="flex items-center gap-2 text-[#ff4b00]">{icon}</div>
            <div className="mt-3 text-2xl font-black">{value}</div>
            <div className="mt-1 text-xs font-bold text-neutral-500">{label}</div>
        </div>
    );
}

function TrustItem({ text, active }: { text: string; active: boolean }) {
    return (
        <div className="flex items-center gap-2">
            <ShieldCheck
                size={18}
                className={active ? "text-[#2ecc71]" : "text-neutral-400"}
            />
            <span>{text}</span>
        </div>
    );
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}