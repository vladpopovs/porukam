import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/prisma";
import { requireUserProfile } from "@/lib/auth";
import { MessagesListRealtime } from "./MessagesListRealtime";
import {
    ArrowRight,
    Inbox,
    MessageCircle,
    PackageCheck,
    Search,
    UserRound,
} from "lucide-react";

export const metadata = {
    title: "Сообщения",
};

export default async function MessagesPage() {
    const { profile } = await requireUserProfile();

    const conversations = await prisma.conversation.findMany({
        where: {
            OR: [
                {
                    buyerId: profile.id,
                },
                {
                    sellerId: profile.id,
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
    });

    return (
        <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
            <SiteHeader compact />

            <MessagesListRealtime userId={profile.id} />

            <section className="mx-auto max-w-6xl px-5 py-10 lg:px-8">
                <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#ff4b00] shadow-sm">
                            <MessageCircle size={18} />
                            Реальные диалоги
                        </div>

                        <h1 className="text-5xl font-black tracking-tight">Сообщения</h1>

                        <p className="mt-3 max-w-2xl text-lg leading-8 text-neutral-700">
                            Здесь хранятся настоящие переписки покупателей и продавцов.
                        </p>
                    </div>

                    <Link
                        href="/search"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-6 py-4 font-black text-white shadow-lg shadow-orange-200"
                    >
                        <Search size={20} />
                        Найти объявление
                    </Link>
                </div>

                {conversations.length > 0 ? (
                    <div className="space-y-4">
                        {conversations.map((conversation) => {
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
                                <Link
                                    key={conversation.id}
                                    href={`/messages/${conversation.id}`}
                                    className="group grid grid-cols-[92px_1fr] gap-4 rounded-[2rem] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl md:grid-cols-[120px_1fr_auto]"
                                >
                                    <div
                                        className="h-24 rounded-[1.5rem] bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${conversation.listing.image})`,
                                        }}
                                    />

                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-[#ff4b00]">
                                                <UserRound size={14} />
                                                {partner.name}
                                            </span>

                                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                                                <PackageCheck size={14} />
                                                {conversation.buyerId === profile.id
                                                    ? "Вы покупатель"
                                                    : "Вы продавец"}
                                            </span>
                                        </div>

                                        <h2 className="mt-3 truncate text-2xl font-black">
                                            {conversation.listing.title}
                                        </h2>

                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-neutral-600">
                                            {lastMessage
                                                ? `${lastMessage.sender.name}: ${lastMessage.text}`
                                                : "Диалог создан. Напишите первое сообщение."}
                                        </p>

                                        <div className="mt-3 text-sm font-black text-neutral-500">
                                            {conversation.listing.price.toLocaleString("ru-RU")} ₽
                                        </div>
                                    </div>

                                    <div className="hidden items-center justify-center gap-4 text-[#ff4b00] md:flex">
                                        {unreadCount > 0 && (
                                            <span className="flex h-9 min-w-9 items-center justify-center rounded-full bg-[#ff4b00] px-3 text-sm font-black text-white shadow-lg shadow-orange-200">
                                                {unreadCount}
                                            </span>
                                        )}

                                        <ArrowRight className="transition group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="rounded-[2.5rem] bg-white p-10 text-center shadow-sm">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-orange-100 text-[#ff4b00]">
                            <Inbox size={42} />
                        </div>

                        <h2 className="mt-6 text-3xl font-black">Сообщений пока нет</h2>

                        <p className="mx-auto mt-3 max-w-xl leading-7 text-neutral-600">
                            Откройте объявление и нажмите “Написать продавцу”. После этого
                            диалог появится здесь.
                        </p>

                        <Link
                            href="/search"
                            className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-7 py-4 font-black text-white"
                        >
                            <Search size={20} />
                            Перейти в каталог
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
}