import Link from "next/link";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/prisma";
import { requireUserProfile } from "@/lib/auth";
import { AlertTriangle, ArrowLeft, MessageCircle, Search } from "lucide-react";

export default async function StartChatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const listing = await prisma.listing.findUnique({
    where: {
      id: slug,
    },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!listing) {
    return (
      <ChatProblem
        title="Объявление не найдено"
        text="Чат нельзя открыть, потому что такого объявления нет в базе."
      >
        <LinkButton href="/search">В каталог</LinkButton>
      </ChatProblem>
    );
  }

  if (!listing.sellerId || !listing.seller) {
    return (
      <ChatProblem
        title="У объявления нет продавца"
        text="Объявление есть в базе, но у него не заполнен sellerId. Для чата нужно знать, кто продавец."
      >
        <div className="rounded-3xl bg-orange-50 p-5 text-left text-sm font-bold leading-6 text-neutral-700">
          <div className="font-black text-[#111111]">Что сделать:</div>
          <p className="mt-2">
            Открой Prisma Studio, найди это объявление в таблице Listing и
            проверь поле sellerId. Оно должно быть id реального пользователя из
            таблицы User.
          </p>
        </div>

        <LinkButton href={`/listing/${listing.id}`}>
          Вернуться к объявлению
        </LinkButton>
      </ChatProblem>
    );
  }

  const { profile } = await requireUserProfile();

  if (listing.sellerId === profile.id) {
    return (
      <ChatProblem
        title="Это ваше объявление"
        text="Нельзя начать чат с самим собой. Войдите под другим аккаунтом покупателя, чтобы проверить переписку."
      >
        <LinkButton href={`/listing/${listing.id}`}>
          Вернуться к объявлению
        </LinkButton>
      </ChatProblem>
    );
  }

  const conversation = await prisma.conversation.upsert({
    where: {
      listingId_buyerId_sellerId: {
        listingId: listing.id,
        buyerId: profile.id,
        sellerId: listing.sellerId,
      },
    },
    update: {
      lastMessageAt: new Date(),
    },
    create: {
      listingId: listing.id,
      buyerId: profile.id,
      sellerId: listing.sellerId,
      status: "open",
    },
  });

  redirect(`/messages/${conversation.id}`);
}

function ChatProblem({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
      <SiteHeader compact />

      <section className="mx-auto flex max-w-3xl flex-col items-center px-5 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-orange-100 text-[#ff4b00]">
          <AlertTriangle size={42} />
        </div>

        <h1 className="mt-8 text-5xl font-black tracking-tight">{title}</h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-700">
          {text}
        </p>

        <div className="mt-8 flex w-full flex-col gap-4">{children}</div>

        <Link
          href="/search"
          className="mt-6 inline-flex items-center gap-2 font-black text-[#ff4b00]"
        >
          <ArrowLeft size={18} />
          В каталог
        </Link>
      </section>
    </main>
  );
}

function LinkButton({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-7 py-4 font-black text-white shadow-lg shadow-orange-200"
    >
      <MessageCircle size={20} />
      {children}
    </Link>
  );
}