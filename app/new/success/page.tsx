import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/prisma";
import { requireUserProfile } from "@/lib/auth";
import {
    CheckCircle2,
    Clock3,
    Loader2,
    Plus,
    ShieldCheck,
    UserRound,
} from "lucide-react";

export const metadata = {
    title: "Объявление отправлено",
};

export default async function NewListingSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{
        id?: string;
    }>;
}) {
    const query = await searchParams;
    const listingId = query.id;

    if (!listingId) {
        redirect("/profile");
    }

    const { profile } = await requireUserProfile();

    const listing = await prisma.listing.findUnique({
        where: {
            id: listingId,
        },
    });

    if (!listing || listing.sellerId !== profile.id) {
        redirect("/profile");
    }

    return (
        <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
            <SiteHeader compact />

            <section className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
                <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-sm">
                    <div className="relative bg-[#111111] p-8 text-white md:p-10">
                        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#ff4b00]/40 blur-2xl" />
                        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#2ecc71]/30 blur-2xl" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-orange-100">
                                <Loader2 size={18} className="animate-spin" />
                                На рассмотрении
                            </div>

                            <h1 className="mt-6 max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
                                Объявление отправлено на проверку
                            </h1>

                            <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-300">
                                Всё получилось. Мы сохранили объявление и передали его в
                                модерацию. После одобрения оно появится в каталоге.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 p-6 md:p-8 lg:grid-cols-[320px_1fr]">
                        <div className="overflow-hidden rounded-[2rem] bg-neutral-100 opacity-80">
                            <div
                                className="h-56 bg-cover bg-center grayscale-[0.25]"
                                style={{
                                    backgroundImage: `url(${listing.image})`,
                                }}
                            />

                            <div className="p-5">
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-neutral-200 px-3 py-1 text-xs font-black text-neutral-700">
                                    <Loader2 size={14} className="animate-spin" />
                                    На рассмотрении
                                </div>

                                <h2 className="text-2xl font-black">{listing.title}</h2>

                                <div className="mt-2 text-3xl font-black">
                                    {listing.price.toLocaleString("ru-RU")} ₽
                                </div>

                                <div className="mt-2 text-sm font-bold text-neutral-600">
                                    {listing.location}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <StatusStep
                                icon={<CheckCircle2 size={24} />}
                                title="Объявление сохранено"
                                text="Фото, описание, цена и город записаны в базу."
                                done
                            />

                            <StatusStep
                                icon={<Loader2 size={24} className="animate-spin" />}
                                title="Модератор проверяет объявление"
                                text="Пока объявление не видно в каталоге. Это нормально."
                            />

                            <StatusStep
                                icon={<ShieldCheck size={24} />}
                                title="После одобрения появится в поиске"
                                text="Статус изменится на «Активно», и покупатели смогут написать вам."
                            />

                            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                <Link
                                    href="/profile"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-5 py-4 font-black text-white shadow-lg shadow-orange-200"
                                >
                                    <UserRound size={20} />
                                    В профиль
                                </Link>

                                <Link
                                    href="/new"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-5 py-4 font-black text-[#ff4b00]"
                                >
                                    <Plus size={20} />
                                    Подать ещё
                                </Link>

                                <Link
                                    href={`/listing/${listing.id}`}
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#111111] px-5 py-4 font-black text-white"
                                >
                                    <Clock3 size={20} />
                                    Открыть
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

function StatusStep({
    icon,
    title,
    text,
    done = false,
}: {
    icon: React.ReactNode;
    title: string;
    text: string;
    done?: boolean;
}) {
    return (
        <div className="flex gap-4 rounded-[2rem] bg-[#fff7ed] p-5">
            <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${done ? "bg-[#2ecc71] text-white" : "bg-neutral-200 text-neutral-700"
                    }`}
            >
                {icon}
            </div>

            <div>
                <h2 className="text-xl font-black">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-neutral-600">{text}</p>
            </div>
        </div>
    );
}