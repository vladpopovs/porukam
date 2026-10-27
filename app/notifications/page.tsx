import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/prisma";
import { requireUserProfile } from "@/lib/auth";
import {
    Bell,
    CheckCircle2,
    Clock3,
    Edit3,
    Handshake,
    Loader2,
    MessageCircle,
    PackageCheck,
    Search,
    ShieldCheck,
    Star,
    XCircle,
} from "lucide-react";

export const metadata = {
    title: "Уведомления",
};

export default async function NotificationsPage() {
    const { profile } = await requireUserProfile();

    const [
        unreadConversations,
        dealsNeedAction,
        moderationListings,
        rejectedListings,
        verificationRequest,
        recentReviews,
        completedDeals,
    ] = await Promise.all([
        prisma.conversation.findMany({
            where: {
                OR: [
                    {
                        buyerId: profile.id,
                        buyerUnreadCount: {
                            gt: 0,
                        },
                    },
                    {
                        sellerId: profile.id,
                        sellerUnreadCount: {
                            gt: 0,
                        },
                    },
                ],
            },
            include: {
                listing: true,
                buyer: true,
                seller: true,
                messages: {
                    take: 1,
                    orderBy: {
                        createdAt: "desc",
                    },
                    include: {
                        sender: true,
                    },
                },
            },
            orderBy: {
                lastMessageAt: "desc",
            },
        }),

        prisma.deal.findMany({
            where: {
                OR: [
                    {
                        buyerId: profile.id,
                        status: {
                            in: ["pending", "confirmed"],
                        },
                        buyerConfirmed: false,
                    },
                    {
                        sellerId: profile.id,
                        status: {
                            in: ["pending", "confirmed"],
                        },
                        sellerConfirmed: false,
                    },
                ],
            },
            include: {
                listing: true,
                buyer: true,
                seller: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.listing.findMany({
            where: {
                sellerId: profile.id,
                status: "moderation",
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 8,
        }),

        prisma.listing.findMany({
            where: {
                sellerId: profile.id,
                status: "rejected",
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 8,
        }),

        prisma.verificationRequest.findFirst({
            where: {
                userId: profile.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        }),

        prisma.review.findMany({
            where: {
                receiverId: profile.id,
            },
            include: {
                reviewer: true,
                listing: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 6,
        }),

        prisma.deal.findMany({
            where: {
                OR: [
                    {
                        buyerId: profile.id,
                    },
                    {
                        sellerId: profile.id,
                    },
                ],
                status: "completed",
            },
            include: {
                listing: true,
                buyer: true,
                seller: true,
                reviews: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 10,
        }),
    ]);

    const reviewNeededDeals = completedDeals.filter((deal) => {
        return !deal.reviews.some((review) => review.reviewerId === profile.id);
    });

    const unreadMessagesCount = unreadConversations.reduce((sum, conversation) => {
        const count =
            conversation.buyerId === profile.id
                ? conversation.buyerUnreadCount
                : conversation.sellerUnreadCount;

        return sum + count;
    }, 0);

    const importantCount =
        unreadMessagesCount +
        dealsNeedAction.length +
        rejectedListings.length +
        reviewNeededDeals.length;

    return (
        <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
            <SiteHeader compact />

            <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <div className="mb-8 overflow-hidden rounded-[2.5rem] bg-[#111111] text-white shadow-sm">
                    <div className="relative p-7 md:p-10">
                        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#ff4b00]/40 blur-2xl" />
                        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#2ecc71]/25 blur-2xl" />

                        <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                            <div>
                                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-orange-100">
                                    <Bell size={18} />
                                    Центр событий
                                </div>

                                <h1 className="text-5xl font-black tracking-tight md:text-6xl">
                                    Уведомления
                                </h1>

                                <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-300">
                                    Здесь собраны сообщения, сделки, модерация объявлений,
                                    проверка профиля и отзывы.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[560px]">
                                <DarkStat value={String(importantCount)} label="важных" />
                                <DarkStat value={String(unreadMessagesCount)} label="сообщений" />
                                <DarkStat value={String(dealsNeedAction.length)} label="сделок" />
                                <DarkStat value={String(rejectedListings.length)} label="правок" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                    <div className="space-y-6">
                        <section className="rounded-[2rem] bg-white p-5 shadow-sm md:p-6">
                            <SectionTitle
                                icon={<Bell size={22} />}
                                title="Требует внимания"
                                text="То, на что лучше отреагировать сейчас."
                            />

                            <div className="mt-5 space-y-4">
                                {importantCount === 0 ? (
                                    <EmptyBlock
                                        title="Всё спокойно"
                                        text="Нет непрочитанных сообщений, срочных сделок и объявлений с ошибками."
                                    />
                                ) : (
                                    <>
                                        {unreadConversations.map((conversation) => {
                                            const partner =
                                                conversation.buyerId === profile.id
                                                    ? conversation.seller
                                                    : conversation.buyer;

                                            const unreadCount =
                                                conversation.buyerId === profile.id
                                                    ? conversation.buyerUnreadCount
                                                    : conversation.sellerUnreadCount;

                                            const lastMessage = conversation.messages[0];

                                            return (
                                                <NotificationCard
                                                    key={conversation.id}
                                                    icon={<MessageCircle size={24} />}
                                                    tone="orange"
                                                    title={`${unreadCount} непрочитанных сообщений`}
                                                    text={
                                                        lastMessage
                                                            ? `${lastMessage.sender.name}: ${lastMessage.text}`
                                                            : `Диалог с пользователем ${partner.name}`
                                                    }
                                                    meta={conversation.listing.title}
                                                    href={`/messages/${conversation.id}`}
                                                    action="Открыть диалог"
                                                />
                                            );
                                        })}

                                        {dealsNeedAction.map((deal) => {
                                            const partner =
                                                deal.buyerId === profile.id ? deal.seller : deal.buyer;

                                            const needsConfirm =
                                                deal.buyerId === profile.id
                                                    ? !deal.buyerConfirmed
                                                    : !deal.sellerConfirmed;

                                            return (
                                                <NotificationCard
                                                    key={deal.id}
                                                    icon={<Handshake size={24} />}
                                                    tone="green"
                                                    title={
                                                        needsConfirm
                                                            ? "Сделка ждёт вашего подтверждения"
                                                            : "Сделка требует действия"
                                                    }
                                                    text={`По товару “${deal.listing.title}” с пользователем ${partner.name}. Сумма: ${deal.amount.toLocaleString(
                                                        "ru-RU"
                                                    )} ₽.`}
                                                    meta={getDealStatusLabel(deal.status)}
                                                    href="/deals"
                                                    action="Открыть сделки"
                                                />
                                            );
                                        })}

                                        {rejectedListings.map((listing) => (
                                            <NotificationCard
                                                key={listing.id}
                                                icon={<XCircle size={24} />}
                                                tone="red"
                                                title="Объявление отклонено"
                                                text={
                                                    listing.rejectionReason ||
                                                    "Модератор отклонил объявление. Исправьте его и отправьте повторно."
                                                }
                                                meta={listing.title}
                                                href={`/listing/${listing.id}/edit`}
                                                action="Исправить"
                                            />
                                        ))}

                                        {reviewNeededDeals.map((deal) => {
                                            const partner =
                                                deal.buyerId === profile.id ? deal.seller : deal.buyer;

                                            return (
                                                <NotificationCard
                                                    key={deal.id}
                                                    icon={<Star size={24} />}
                                                    tone="orange"
                                                    title="Оставьте отзыв после сделки"
                                                    text={`Сделка по товару “${deal.listing.title}” завершена. Можно оценить пользователя ${partner.name}.`}
                                                    meta="Отзывы помогают доверию"
                                                    href="/deals"
                                                    action="Оставить отзыв"
                                                />
                                            );
                                        })}
                                    </>
                                )}
                            </div>
                        </section>

                        <section className="rounded-[2rem] bg-white p-5 shadow-sm md:p-6">
                            <SectionTitle
                                icon={<Clock3 size={22} />}
                                title="На рассмотрении"
                                text="Эти процессы уже запущены. Обычно нужно просто подождать."
                            />

                            <div className="mt-5 space-y-4">
                                {moderationListings.length === 0 && !verificationRequest ? (
                                    <EmptyBlock
                                        title="Ничего не ждёт проверки"
                                        text="Когда вы подадите объявление или заявку на проверку профиля, они появятся здесь."
                                    />
                                ) : (
                                    <>
                                        {moderationListings.map((listing) => (
                                            <NotificationCard
                                                key={listing.id}
                                                icon={<Loader2 size={24} className="animate-spin" />}
                                                tone="gray"
                                                title="Объявление на модерации"
                                                text="Оно уже сохранено, но пока не видно в каталоге. После одобрения покупатели смогут написать вам."
                                                meta={listing.title}
                                                href={`/listing/${listing.id}`}
                                                action="Открыть"
                                            />
                                        ))}

                                        {verificationRequest && (
                                            <NotificationCard
                                                icon={
                                                    verificationRequest.status === "approved" ? (
                                                        <CheckCircle2 size={24} />
                                                    ) : verificationRequest.status === "rejected" ? (
                                                        <XCircle size={24} />
                                                    ) : (
                                                        <Loader2 size={24} className="animate-spin" />
                                                    )
                                                }
                                                tone={
                                                    verificationRequest.status === "approved"
                                                        ? "green"
                                                        : verificationRequest.status === "rejected"
                                                            ? "red"
                                                            : "gray"
                                                }
                                                title="Проверка профиля"
                                                text={getVerificationText(verificationRequest.status)}
                                                meta={getVerificationStatusLabel(
                                                    verificationRequest.status
                                                )}
                                                href="/verification"
                                                action="Открыть проверку"
                                            />
                                        )}
                                    </>
                                )}
                            </div>
                        </section>

                        <section className="rounded-[2rem] bg-white p-5 shadow-sm md:p-6">
                            <SectionTitle
                                icon={<Star size={22} />}
                                title="Последние отзывы"
                                text="Отзывы после завершённых сделок."
                            />

                            <div className="mt-5 space-y-4">
                                {recentReviews.length > 0 ? (
                                    recentReviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="rounded-[1.5rem] bg-[#fff7ed] p-5"
                                        >
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-black">
                                                    {review.reviewer.name}
                                                </span>

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
                                                    className="mt-2 block text-sm font-black text-[#ff4b00]"
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
                                    <EmptyBlock
                                        title="Отзывов пока нет"
                                        text="После завершённых сделок отзывы появятся здесь."
                                    />
                                )}
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-5">
                        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                            <h2 className="text-2xl font-black">Быстрые действия</h2>

                            <div className="mt-5 grid grid-cols-1 gap-3">
                                <QuickLink
                                    href="/messages"
                                    icon={<MessageCircle size={20} />}
                                    title="Сообщения"
                                />
                                <QuickLink
                                    href="/deals"
                                    icon={<Handshake size={20} />}
                                    title="Сделки"
                                />
                                <QuickLink
                                    href="/profile"
                                    icon={<PackageCheck size={20} />}
                                    title="Профиль"
                                />
                                <QuickLink
                                    href="/search"
                                    icon={<Search size={20} />}
                                    title="Каталог"
                                />
                            </div>
                        </div>

                        <div className="rounded-[2rem] bg-[#111111] p-6 text-white">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="mt-1 shrink-0 text-[#ff4b00]" />
                                <div>
                                    <h2 className="text-2xl font-black">Как работает</h2>
                                    <p className="mt-3 text-sm leading-6 text-neutral-300">
                                        Уведомления собираются из реальных данных: чатов, сделок,
                                        объявлений, отзывов и проверки профиля.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    );
}

function DarkStat({ value, label }: { value: string; label: string }) {
    return (
        <div className="rounded-[1.5rem] bg-white/10 p-4 text-center backdrop-blur">
            <div className="text-3xl font-black">{value}</div>
            <div className="mt-1 text-xs font-bold text-neutral-300">{label}</div>
        </div>
    );
}

function SectionTitle({
    icon,
    title,
    text,
}: {
    icon: ReactNode;
    title: string;
    text: string;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ff4b00] text-white">
                {icon}
            </div>

            <div>
                <h2 className="text-3xl font-black">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-neutral-600">{text}</p>
            </div>
        </div>
    );
}

function NotificationCard({
    icon,
    tone,
    title,
    text,
    meta,
    href,
    action,
}: {
    icon: ReactNode;
    tone: "orange" | "green" | "red" | "gray";
    title: string;
    text: string;
    meta: string;
    href: string;
    action: string;
}) {
    return (
        <div className="grid grid-cols-1 gap-4 rounded-[1.5rem] border border-orange-100 bg-[#fff7ed] p-5 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${getToneClass(
                    tone
                )}`}
            >
                {icon}
            </div>

            <div className="min-w-0">
                <div className="font-black">{title}</div>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-neutral-600">
                    {text}
                </p>
                <div className="mt-2 text-xs font-black text-neutral-500">{meta}</div>
            </div>

            <Link
                href={href}
                className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-black text-[#ff4b00] shadow-sm"
            >
                {action}
            </Link>
        </div>
    );
}

function EmptyBlock({ title, text }: { title: string; text: string }) {
    return (
        <div className="rounded-[1.5rem] bg-[#fff7ed] p-8 text-center">
            <div className="text-2xl font-black">{title}</div>
            <p className="mx-auto mt-2 max-w-xl leading-7 text-neutral-600">{text}</p>
        </div>
    );
}

function QuickLink({
    href,
    icon,
    title,
}: {
    href: string;
    icon: ReactNode;
    title: string;
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 rounded-2xl bg-[#fff7ed] px-5 py-4 font-black text-[#111111] transition hover:bg-orange-50 hover:text-[#ff4b00]"
        >
            <span className="text-[#ff4b00]">{icon}</span>
            {title}
        </Link>
    );
}

function getToneClass(tone: "orange" | "green" | "red" | "gray") {
    if (tone === "green") return "bg-green-100 text-green-700";
    if (tone === "red") return "bg-red-100 text-red-700";
    if (tone === "gray") return "bg-neutral-200 text-neutral-700";

    return "bg-orange-100 text-[#ff4b00]";
}

function getDealStatusLabel(status: string) {
    if (status === "pending") return "Ожидает подтверждения";
    if (status === "confirmed") return "Подтверждена";
    if (status === "completed") return "Завершена";
    if (status === "cancelled") return "Отменена";

    return status;
}

function getVerificationStatusLabel(status: string) {
    if (status === "pending") return "На проверке";
    if (status === "approved") return "Одобрено";
    if (status === "rejected") return "Отклонено";

    return status;
}

function getVerificationText(status: string) {
    if (status === "approved") {
        return "Профиль проверен. Покупатели будут видеть знак доверия.";
    }

    if (status === "rejected") {
        return "Заявка отклонена. Можно исправить данные и попробовать снова.";
    }

    return "Заявка отправлена. Модератор проверяет профиль.";
}

function formatDate(date: Date) {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}