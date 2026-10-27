import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "./Logo";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { signOut } from "@/app/logout/actions";
import {
  Bell,
  Heart,
  MessageCircle,
  ShieldCheck,
  Building2,
  Megaphone,
  Search,
  Handshake,
  UserCheck,
  Sparkles,
  LockKeyhole,
} from "lucide-react";

type SiteHeaderProps = {
  compact?: boolean;
};

type HeaderNavLink = {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: number;
};

export async function SiteHeader({ compact = false }: SiteHeaderProps) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let isAdmin = false;
  let unreadMessagesCount = 0;
  let favoritesCount = 0;
  let notificationsCount = 0;

  if (user) {
    const [
      profile,
      buyerUnread,
      sellerUnread,
      favoritesTotal,
      dealsNeedActionCount,
      rejectedListingsCount,
    ] = await Promise.all([
      prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          role: true,
        },
      }),

      prisma.conversation.aggregate({
        where: {
          buyerId: user.id,
        },
        _sum: {
          buyerUnreadCount: true,
        },
      }),

      prisma.conversation.aggregate({
        where: {
          sellerId: user.id,
        },
        _sum: {
          sellerUnreadCount: true,
        },
      }),

      prisma.favorite.count({
        where: {
          userId: user.id,
        },
      }),

      prisma.deal.count({
        where: {
          OR: [
            {
              buyerId: user.id,
              status: {
                in: ["pending", "confirmed"],
              },
              buyerConfirmed: false,
            },
            {
              sellerId: user.id,
              status: {
                in: ["pending", "confirmed"],
              },
              sellerConfirmed: false,
            },
          ],
        },
      }),

      prisma.listing.count({
        where: {
          sellerId: user.id,
          status: "rejected",
        },
      }),
    ]);

    isAdmin = profile?.role === "admin";

    unreadMessagesCount =
      (buyerUnread._sum.buyerUnreadCount || 0) +
      (sellerUnread._sum.sellerUnreadCount || 0);

    favoritesCount = favoritesTotal;

    notificationsCount =
      unreadMessagesCount + dealsNeedActionCount + rejectedListingsCount;
  }

  const navLinks: HeaderNavLink[] = [
    {
      href: "/search",
      label: "Каталог",
      icon: <Search size={17} />,
    },
    ...(user
      ? [
        {
          href: "/notifications",
          label: "Уведомления",
          icon: <Bell size={17} />,
          badge: notificationsCount,
        },
        {
          href: "/deals",
          label: "Сделки",
          icon: <Handshake size={17} />,
        },
        {
          href: "/messages",
          label: "Сообщения",
          icon: <MessageCircle size={17} />,
          badge: unreadMessagesCount,
        },
        {
          href: "/favorites",
          label: "Избранное",
          icon: <Heart size={17} />,
          badge: favoritesCount,
        },
        {
          href: "/verification",
          label: "Проверка",
          icon: <UserCheck size={17} />,
        },
      ]
      : []),
    ...(isAdmin
      ? [
        {
          href: "/moderation",
          label: "Модерация",
          icon: <ShieldCheck size={17} />,
        },
      ]
      : []),
    {
      href: "/pricing",
      label: "Бизнес",
      icon: <Building2 size={17} />,
    },
    {
      href: "/advertising",
      label: "Реклама",
      icon: <Megaphone size={17} />,
    },
    {
      href: "/trust",
      label: "Как работает",
      icon: <Sparkles size={17} />,
    },
    {
      href: "/trust#safety",
      label: "Безопасность",
      icon: <LockKeyhole size={17} />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100 bg-[#fff7ed]/95 backdrop-blur-xl">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 lg:px-8 ${compact ? "py-3" : "py-4"
          }`}
      >
        <div className="min-w-0 shrink-0">
          <Logo />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <>
              <Link
                href="/profile"
                className="hidden rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-black text-[#ff4b00] shadow-sm transition hover:border-[#ff4b00] sm:block"
              >
                Профиль
              </Link>

              <form action={signOut}>
                <button className="hidden rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-black text-neutral-700 shadow-sm transition hover:border-[#ff4b00] sm:block">
                  Выйти
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-2xl border border-orange-200 bg-white px-4 py-3 text-sm font-black text-[#ff4b00] shadow-sm transition hover:border-[#ff4b00] sm:block"
            >
              Войти
            </Link>
          )}

          <Link
            href="/new"
            className="rounded-2xl bg-[#ff4b00] px-4 py-3 text-sm font-black text-white shadow-lg shadow-orange-200 transition hover:bg-[#eb4500] sm:px-5"
          >
            Подать
          </Link>
        </div>
      </div>

      <div className="border-t border-orange-100">
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-3 lg:px-8">
          {navLinks.map((link) => (
            <HeaderNavPill
              key={link.href}
              href={link.href}
              icon={link.icon}
              badge={link.badge}
            >
              {link.label}
            </HeaderNavPill>
          ))}
        </nav>
      </div>
    </header>
  );
}

function HeaderNavPill({
  href,
  icon,
  badge = 0,
  children,
}: {
  href: string;
  icon: ReactNode;
  badge?: number;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-black text-neutral-900 shadow-sm transition hover:bg-orange-50 hover:text-[#ff4b00]"
    >
      <span className="shrink-0">{icon}</span>
      <span className="whitespace-nowrap">{children}</span>

      {badge > 0 && (
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#ff4b00] px-2 text-xs font-black text-white">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}