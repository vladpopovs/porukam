import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/prisma";
import { requireUserProfile } from "@/lib/auth";
import { sendMessage } from "../actions";
import { createDeal } from "@/app/deals/actions";
import { MessagesRealtime } from "./MessagesRealtime";
import {
    ArrowLeft,
    CheckCircle2,
    Handshake,
    MessageCircle,
    PackageCheck,
    Send,
    ShieldCheck,
    UserRound,
} from "lucide-react";

export const metadata = {
    title: "Диалог",
};

export default async function ConversationPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const conversationId = slug;

    const { profile } = await requireUserProfile();

    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId,
        },
        include: {
            listing: true,
            buyer: true,
            seller: true,
            messages: {
                include: {
                    sender: true,
                },
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    if (!conversation) {
        notFound();
    }

    const isBuyer = conversation.buyerId === profile.id;
    const isSeller = conversation.sellerId === profile.id;

    if (!isBuyer && !isSeller) {
        notFound();
    }

    const partner = isBuyer ? conversation.seller : conversation.buyer;

    const activeDeal = await prisma.deal.findFirst({
        where: {
            listingId: conversation.listingId,
            buyerId: conversation.buyerId,
            sellerId: conversation.sellerId,
            status: {
                in: ["pending", "confirmed"],
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
            <SiteHeader compact />

            <MessagesRealtime
                conversationId={conversation.id}
                listingId={conversation.listingId}
            />

            <section className="mx-auto max-w-6xl px-4 py-5 sm:py-7 lg:px-8">
                <Link
                    href="/messages"
                    className="mb-4 inline-flex items-center gap-2 font-black text-[#ff4b00]"
                >
                    <ArrowLeft size={18} />
                    Все сообщения
                </Link>

                <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
                    <div className="grid grid-cols-1 gap-0 border-b border-orange-100 md:grid-cols-[150px_1fr]">
                        <div
                            className="h-44 bg-cover bg-center md:h-full"
                            style={{
                                backgroundImage: `url(${conversation.listing.image})`,
                            }}
                        />

                        <div className="p-5 md:p-6">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0">
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-black text-[#ff4b00]">
                                        <PackageCheck size={14} />
                                        {getStatusLabel(conversation.listing.status)}
                                    </div>

                                    <h1 className="line-clamp-2 text-3xl font-black tracking-tight md:text-4xl">
                                        {conversation.listing.title}
                                    </h1>

                                    <div className="mt-2 text-3xl font-black">
                                        {conversation.listing.price.toLocaleString("ru-RU")} ₽
                                    </div>

                                    <Link
                                        href={`/listing/${conversation.listing.id}`}
                                        className="mt-3 inline-flex font-black text-[#ff4b00]"
                                    >
                                        Открыть объявление
                                    </Link>
                                </div>

                                <div className="rounded-[1.5rem] bg-[#fff7ed] p-4 lg:w-72">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ff4b00] text-white">
                                            <UserRound size={26} />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="text-xs font-black text-neutral-500">
                                                Диалог с пользователем
                                            </div>
                                            <div className="truncate text-xl font-black">
                                                {partner.name}
                                            </div>
                                            <div className="mt-1 text-xs font-bold text-neutral-500">
                                                {isBuyer ? "Вы покупатель" : "Вы продавец"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px]">
                        <section className="flex min-h-0 flex-col border-orange-100 lg:border-r">
                            <div className="flex items-center justify-between border-b border-orange-100 bg-white px-5 py-4">
                                <div>
                                    <div className="text-sm font-black text-neutral-500">
                                        Переписка
                                    </div>
                                    <div className="text-xl font-black">Сообщения по товару</div>
                                </div>

                                <div className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-[#ff4b00]">
                                    Realtime
                                </div>
                            </div>

                            <div className="h-[52vh] min-h-[360px] max-h-[620px] space-y-4 overflow-y-auto bg-[#fff7ed] p-4 sm:p-5">
                                {conversation.messages.length > 0 ? (
                                    conversation.messages.map((message) => {
                                        const isOwnMessage = message.senderId === profile.id;

                                        return (
                                            <div
                                                key={message.id}
                                                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"
                                                    }`}
                                            >
                                                <div
                                                    className={`max-w-[88%] rounded-[1.5rem] px-5 py-4 shadow-sm sm:max-w-[76%] ${isOwnMessage
                                                            ? "rounded-br-md bg-[#ff4b00] text-white"
                                                            : "rounded-bl-md bg-white text-[#111111]"
                                                        }`}
                                                >
                                                    <div
                                                        className={`mb-1 text-xs font-black ${isOwnMessage
                                                                ? "text-orange-100"
                                                                : "text-neutral-500"
                                                            }`}
                                                    >
                                                        {message.sender.name}
                                                    </div>

                                                    <p className="whitespace-pre-wrap break-words text-sm font-bold leading-6">
                                                        {message.text}
                                                    </p>

                                                    <div
                                                        className={`mt-2 text-[11px] font-bold ${isOwnMessage
                                                                ? "text-orange-100"
                                                                : "text-neutral-400"
                                                            }`}
                                                    >
                                                        {formatTime(message.createdAt)}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="flex h-full items-center justify-center text-center">
                                        <div>
                                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white text-[#ff4b00] shadow-sm">
                                                <MessageCircle size={42} />
                                            </div>

                                            <h2 className="mt-5 text-3xl font-black">
                                                Начните переписку
                                            </h2>

                                            <p className="mx-auto mt-2 max-w-md leading-7 text-neutral-600">
                                                Напишите первое сообщение. Оно сохранится в базе и
                                                появится у второго участника.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <form
                                action={sendMessage}
                                className="border-t border-orange-100 bg-white p-4 sm:p-5"
                            >
                                <input
                                    type="hidden"
                                    name="conversationId"
                                    value={conversation.id}
                                />

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <textarea
                                        name="text"
                                        placeholder="Напишите сообщение..."
                                        className="input min-h-16 flex-1 resize-none bg-[#fff7ed]"
                                    />

                                    <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-6 py-4 font-black text-white shadow-lg shadow-orange-200">
                                        <Send size={20} />
                                        Отправить
                                    </button>
                                </div>
                            </form>
                        </section>

                        <aside className="space-y-4 bg-white p-4 sm:p-5">
                            <div className="rounded-[2rem] bg-[#111111] p-5 text-white">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ff4b00]">
                                        <Handshake size={28} />
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-black">По рукам</h2>
                                        <p className="mt-1 text-sm text-neutral-300">
                                            Зафиксируйте договорённость.
                                        </p>
                                    </div>
                                </div>

                                {activeDeal ? (
                                    <div className="mt-5 rounded-3xl bg-white/10 p-5">
                                        <div className="inline-flex items-center gap-2 rounded-full bg-green-400/20 px-3 py-1 text-sm font-black text-green-200">
                                            <CheckCircle2 size={16} />
                                            Сделка уже создана
                                        </div>

                                        <div className="mt-4 text-sm text-neutral-300">
                                            Покупатель готов купить за
                                        </div>

                                        <div className="mt-1 text-4xl font-black">
                                            {activeDeal.amount.toLocaleString("ru-RU")} ₽
                                        </div>

                                        <Link
                                            href="/deals"
                                            className="mt-5 block rounded-2xl bg-white px-5 py-4 text-center font-black text-[#111111]"
                                        >
                                            Открыть сделки
                                        </Link>
                                    </div>
                                ) : isBuyer && conversation.listing.status === "active" ? (
                                    <form action={createDeal} className="mt-5 space-y-3">
                                        <input
                                            type="hidden"
                                            name="listingId"
                                            value={conversation.listing.id}
                                        />

                                        <input
                                            name="amount"
                                            defaultValue={conversation.listing.price}
                                            className="input bg-white text-[#111111]"
                                            placeholder="Сумма сделки"
                                        />

                                        <button className="w-full rounded-2xl bg-[#2ecc71] px-5 py-4 font-black text-white">
                                            Предложить “По рукам”
                                        </button>

                                        <p className="text-xs leading-5 text-neutral-400">
                                            Деньги не резервируются. Мы фиксируем договорённость:
                                            покупатель готов купить за указанную сумму.
                                        </p>
                                    </form>
                                ) : (
                                    <div className="mt-5 rounded-3xl bg-white/10 p-5 text-sm leading-6 text-neutral-300">
                                        {isSeller
                                            ? "Сделку предлагает покупатель. Когда он нажмёт «По рукам», она появится у вас в разделе сделок."
                                            : "Сейчас сделку создать нельзя: объявление не активно."}
                                    </div>
                                )}
                            </div>

                            <div className="rounded-[2rem] bg-[#fff7ed] p-5">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="mt-1 shrink-0 text-[#ff4b00]" />
                                    <div>
                                        <h2 className="text-xl font-black">Безопасность</h2>
                                        <p className="mt-2 text-sm leading-6 text-neutral-600">
                                            Не переводите предоплату. Проверяйте товар до оплаты.
                                            Встречайтесь в понятном и людном месте.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>
        </main>
    );
}

function formatTime(date: Date) {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

function getStatusLabel(status: string) {
    if (status === "active") return "Активно";
    if (status === "moderation") return "На модерации";
    if (status === "rejected") return "Отклонено";
    if (status === "sold") return "Продано";

    return status;
}