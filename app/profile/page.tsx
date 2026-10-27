import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/prisma";
import { requireUserProfile } from "@/lib/auth";
import {
  CheckCircle2,
  Clock3,
  Edit3,
  Loader2,
  MessageCircle,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  Star,
  UserRound,
  XCircle,
} from "lucide-react";

export const metadata = {
  title: "Профиль",
};

export default async function ProfilePage() {
  const { profile } = await requireUserProfile();

  const [listings, deals, reviews] = await Promise.all([
    prisma.listing.findMany({
      where: {
        sellerId: profile.id,
      },
      orderBy: {
        createdAt: "desc",
      },
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
      },
      include: {
        listing: true,
        buyer: true,
        seller: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
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
  ]);

  const activeListingsCount = listings.filter(
    (listing) => listing.status === "active"
  ).length;

  const moderationListingsCount = listings.filter(
    (listing) => listing.status === "moderation"
  ).length;

  const completedDealsCount = deals.filter(
    (deal) => deal.status === "completed"
  ).length;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) /
      reviews.length
      : null;

  return (
    <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
      <SiteHeader compact />

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-5">
            <div className="overflow-hidden rounded-[2.2rem] bg-white shadow-sm">
              <div className="relative bg-gradient-to-br from-orange-100 via-white to-orange-200 p-6">
                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#ff4b00]/20" />
                <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#2ecc71]/20" />

                <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-[#ff4b00] text-white shadow-xl shadow-orange-200">
                  <UserRound size={52} />
                </div>

                {profile.isVerified && (
                  <div className="relative z-10 mt-5 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700">
                    <CheckCircle2 size={18} />
                    Проверенный профиль
                  </div>
                )}
              </div>

              <div className="p-6">
                <h1 className="text-4xl font-black tracking-tight">
                  {profile.name}
                </h1>

                <div className="mt-2 text-sm font-bold text-neutral-600">
                  {profile.email}
                </div>

                <div className="mt-2 text-sm font-bold text-neutral-600">
                  {profile.city}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <MiniStat
                    value={String(activeListingsCount)}
                    label="активно"
                    icon={<PackageCheck size={18} />}
                  />
                  <MiniStat
                    value={String(moderationListingsCount)}
                    label="на проверке"
                    icon={<Loader2 size={18} className="animate-spin" />}
                  />
                  <MiniStat
                    value={String(completedDealsCount)}
                    label="сделок"
                    icon={<ShieldCheck size={18} />}
                  />
                  <MiniStat
                    value={averageRating ? averageRating.toFixed(1) : "—"}
                    label="рейтинг"
                    icon={
                      <Star
                        size={18}
                        className="fill-[#ff4b00] text-[#ff4b00]"
                      />
                    }
                  />
                </div>

                <Link
                  href="/new"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-6 py-4 font-black text-white shadow-lg shadow-orange-200"
                >
                  <Plus size={20} />
                  Подать объявление
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#111111] p-6 text-white">
              <h2 className="text-2xl font-black">Статусы объявлений</h2>

              <div className="mt-5 space-y-4 text-sm leading-6 text-neutral-300">
                <StatusHint
                  icon={<Loader2 size={18} className="animate-spin" />}
                  title="На рассмотрении"
                  text="Объявление сохранено, но пока не видно в каталоге."
                />
                <StatusHint
                  icon={<CheckCircle2 size={18} />}
                  title="Активно"
                  text="Объявление прошло модерацию и видно покупателям."
                />
                <StatusHint
                  icon={<XCircle size={18} />}
                  title="Отклонено"
                  text="Нужно исправить объявление и отправить заново."
                />
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <section className="rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-[#ff4b00]">
                    <PackageCheck size={18} />
                    Мои объявления
                  </div>

                  <h2 className="text-4xl font-black tracking-tight">
                    Управление объявлениями
                  </h2>

                  <p className="mt-2 text-neutral-600">
                    Здесь видно, какие объявления активны, а какие ожидают
                    решения модератора.
                  </p>
                </div>

                <Link
                  href="/search"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-6 py-4 font-black text-[#ff4b00]"
                >
                  <Search size={20} />
                  Каталог
                </Link>
              </div>

              {listings.length > 0 ? (
                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {listings.map((listing) => (
                    <OwnListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[2rem] bg-[#fff7ed] p-10 text-center">
                  <h3 className="text-3xl font-black">
                    Объявлений пока нет
                  </h3>
                  <p className="mt-2 text-neutral-600">
                    Подайте первое объявление — оно появится здесь.
                  </p>

                  <Link
                    href="/new"
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-7 py-4 font-black text-white"
                  >
                    <Plus size={20} />
                    Подать объявление
                  </Link>
                </div>
              )}
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h2 className="text-3xl font-black">Последние сделки</h2>

              <div className="mt-5 space-y-3">
                {deals.length > 0 ? (
                  deals.map((deal) => {
                    const partner =
                      deal.buyerId === profile.id ? deal.seller : deal.buyer;

                    return (
                      <Link
                        key={deal.id}
                        href="/deals"
                        className="block rounded-3xl bg-[#fff7ed] p-5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="font-black">
                              {deal.listing.title}
                            </div>
                            <div className="mt-1 text-sm font-bold text-neutral-600">
                              С пользователем {partner.name}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-black">
                              {deal.amount.toLocaleString("ru-RU")} ₽
                            </div>
                            <div className="mt-1 text-sm font-black text-[#ff4b00]">
                              {getDealStatusLabel(deal.status)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="rounded-3xl bg-[#fff7ed] p-8 text-center text-neutral-600">
                    Сделок пока нет.
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h2 className="text-3xl font-black">Отзывы</h2>

              <div className="mt-5 space-y-3">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-3xl bg-[#fff7ed] p-5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-black">
                          {review.reviewer.name}
                        </div>

                        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-black text-[#ff4b00]">
                          <Star
                            size={15}
                            className="fill-[#ff4b00] text-[#ff4b00]"
                          />
                          {review.rating}
                        </span>
                      </div>

                      <p className="mt-3 leading-7 text-neutral-700">
                        {review.text || "Пользователь оставил оценку без текста."}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-3xl bg-[#fff7ed] p-8 text-center text-neutral-600">
                    Отзывов пока нет.
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

function OwnListingCard({
  listing,
}: {
  listing: {
    id: string;
    title: string;
    price: number;
    image: string;
    location: string;
    status: string;
    rejectionReason: string | null;
    createdAt: Date;
  };
}) {
  const isModeration = listing.status === "moderation";
  const isRejected = listing.status === "rejected";
  const isSold = listing.status === "sold";

  return (
    <div
      className={`overflow-hidden rounded-[2rem] border shadow-sm transition ${isModeration
          ? "border-neutral-200 bg-neutral-100 opacity-85"
          : "border-orange-100 bg-white hover:-translate-y-1 hover:shadow-xl"
        }`}
    >
      <div className="relative">
        <div
          className={`h-56 bg-cover bg-center ${isModeration ? "grayscale-[0.3]" : ""
            }`}
          style={{
            backgroundImage: `url(${listing.image})`,
          }}
        />

        <div className="absolute left-4 top-4">
          <ListingStatusBadge status={listing.status} />
        </div>
      </div>

      <div className="p-5">
        <h3 className="line-clamp-2 text-2xl font-black">{listing.title}</h3>

        <div className="mt-2 text-3xl font-black">
          {listing.price.toLocaleString("ru-RU")} ₽
        </div>

        <div className="mt-2 text-sm font-bold text-neutral-600">
          {listing.location}
        </div>

        {isModeration && (
          <div className="mt-4 rounded-3xl bg-white p-4">
            <div className="flex items-center gap-2 font-black text-neutral-700">
              <Loader2 size={18} className="animate-spin" />
              Объявление на рассмотрении
            </div>

            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Оно уже сохранено и отправлено модератору. В каталоге появится
              после одобрения.
            </p>
          </div>
        )}

        {isRejected && (
          <div className="mt-4 rounded-3xl bg-red-50 p-4 text-red-800">
            <div className="font-black">Объявление отклонено</div>

            <p className="mt-2 text-sm leading-6">
              {listing.rejectionReason ||
                "Исправьте объявление и отправьте на проверку повторно."}
            </p>
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href={`/listing/${listing.id}`}
            className="rounded-2xl border border-orange-200 bg-white px-5 py-3 text-center font-black text-[#ff4b00]"
          >
            Открыть
          </Link>

          {!isSold && (
            <Link
              href={`/listing/${listing.id}/edit`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#111111] px-5 py-3 font-black text-white"
            >
              <Edit3 size={18} />
              Редактировать
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function ListingStatusBadge({ status }: { status: string }) {
  if (status === "moderation") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-neutral-200 px-4 py-2 text-sm font-black text-neutral-700 shadow-sm">
        <Loader2 size={16} className="animate-spin" />
        На рассмотрении
      </span>
    );
  }

  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-700 shadow-sm">
        <CheckCircle2 size={16} />
        Активно
      </span>
    );
  }

  if (status === "rejected") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-sm font-black text-red-700 shadow-sm">
        <XCircle size={16} />
        Отклонено
      </span>
    );
  }

  if (status === "sold") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-4 py-2 text-sm font-black text-white shadow-sm">
        <PackageCheck size={16} />
        Продано
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-2 text-sm font-black text-[#ff4b00] shadow-sm">
      <Clock3 size={16} />
      {status}
    </span>
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

function StatusHint({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="mt-1 text-[#ff4b00]">{icon}</div>
      <div>
        <div className="font-black text-white">{title}</div>
        <div>{text}</div>
      </div>
    </div>
  );
}

function getDealStatusLabel(status: string) {
  if (status === "pending") return "Ожидает подтверждения";
  if (status === "confirmed") return "Подтверждена";
  if (status === "completed") return "Завершена";
  if (status === "cancelled") return "Отменена";

  return status;
}