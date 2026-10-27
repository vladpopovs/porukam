import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/prisma";
import { requireUserProfile } from "@/lib/auth";
import {
  cancelDeal,
  completeDeal,
  confirmDeal,
  createReview,
} from "./actions";
import {
  CheckCircle2,
  Clock3,
  Handshake,
  PackageCheck,
  Star,
  XCircle,
} from "lucide-react";

export default async function DealsPage() {
  const { profile } = await requireUserProfile();

  const deals = await prisma.deal.findMany({
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
      reviews: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const activeDeals = deals.filter(
    (deal) => deal.status === "pending" || deal.status === "confirmed"
  );

  const completedDeals = deals.filter((deal) => deal.status === "completed");
  const cancelledDeals = deals.filter((deal) => deal.status === "cancelled");

  return (
    <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
      <SiteHeader compact />

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-[#ff4b00]">
                <Handshake size={18} />
                Фирменная функция ПоРукам
              </div>

              <h1 className="text-4xl font-black tracking-tight">
                Сделки «По рукам»
              </h1>

              <p className="mt-3 max-w-3xl leading-7 text-neutral-600">
                Здесь фиксируется договорённость: товар, покупатель, продавец и
                сумма. Деньги не резервируются — обе стороны просто подтверждают,
                что договорились.
              </p>
            </div>

            <Link
              href="/search"
              className="rounded-2xl bg-[#ff4b00] px-6 py-4 text-center font-black text-white shadow-lg shadow-orange-200"
            >
              Найти объявление
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard label="Активные" value={String(activeDeals.length)} />
            <StatCard label="Завершённые" value={String(completedDeals.length)} />
            <StatCard label="Отменённые" value={String(cancelledDeals.length)} />
            <StatCard label="Всего" value={String(deals.length)} />
          </div>
        </div>

        {deals.length > 0 ? (
          <div className="mt-6 space-y-6">
            {activeDeals.length > 0 && (
              <DealSection
                title="Нужно действие"
                description="Здесь сделки, где кто-то ждёт подтверждения или завершения."
                deals={activeDeals}
                profileId={profile.id}
              />
            )}

            {completedDeals.length > 0 && (
              <DealSection
                title="Завершённые сделки"
                description="После завершения можно оставить отзыв."
                deals={completedDeals}
                profileId={profile.id}
              />
            )}

            {cancelledDeals.length > 0 && (
              <DealSection
                title="Отменённые сделки"
                description="История отменённых договорённостей."
                deals={cancelledDeals}
                profileId={profile.id}
              />
            )}
          </div>
        ) : (
          <EmptyDeals />
        )}
      </section>
    </main>
  );
}

type DealItem = {
  id: string;
  amount: number;
  status: string;
  buyerId: string;
  sellerId: string;
  buyerConfirmed: boolean;
  sellerConfirmed: boolean;
  createdAt: Date;
  completedAt: Date | null;
  listing: {
    id: string;
    title: string;
    image: string;
    status: string;
  };
  buyer: {
    name: string;
  };
  seller: {
    name: string;
  };
  reviews: {
    reviewerId: string;
  }[];
};

function DealSection({
  title,
  description,
  deals,
  profileId,
}: {
  title: string;
  description: string;
  deals: DealItem[];
  profileId: string;
}) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h2 className="text-3xl font-black">{title}</h2>
      <p className="mt-2 text-neutral-600">{description}</p>

      <div className="mt-6 space-y-5">
        {deals.map((deal) => (
          <DealRow key={deal.id} deal={deal} profileId={profileId} />
        ))}
      </div>
    </section>
  );
}

function DealRow({ deal, profileId }: { deal: DealItem; profileId: string }) {
  const isSeller = deal.sellerId === profileId;
  const isBuyer = deal.buyerId === profileId;
  const partner = isSeller ? deal.buyer : deal.seller;

  const myConfirmed = isBuyer ? deal.buyerConfirmed : deal.sellerConfirmed;
  const partnerConfirmed = isBuyer
    ? deal.sellerConfirmed
    : deal.buyerConfirmed;

  const alreadyReviewed = deal.reviews.some(
    (review) => review.reviewerId === profileId
  );

  const canConfirm =
    (deal.status === "pending" || deal.status === "confirmed") && !myConfirmed;

  const canComplete = deal.status === "confirmed";
  const canCancel = deal.status === "pending" || deal.status === "confirmed";
  const canReview = deal.status === "completed" && !alreadyReviewed;

  return (
    <div className="rounded-[2rem] border border-orange-100 bg-[#fff7ed] p-4 md:p-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[130px_1fr_260px]">
        <Link
          href={`/listing/${deal.listing.id}`}
          className="block h-32 overflow-hidden rounded-2xl bg-cover bg-center"
          style={{
            backgroundImage: `url(${deal.listing.image})`,
          }}
        />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/listing/${deal.listing.id}`}
              className="text-2xl font-black hover:text-[#ff4b00]"
            >
              {deal.listing.title}
            </Link>

            <span
              className={`rounded-full px-3 py-1 text-xs font-black ${getDealStatusClass(
                deal.status
              )}`}
            >
              {getDealStatusLabel(deal.status)}
            </span>
          </div>

          <div className="mt-3 rounded-3xl bg-white p-5">
            <div className="text-sm font-black text-neutral-500">
              Зафиксированная договорённость
            </div>

            <div className="mt-1 font-black">
              Покупатель готов купить за
            </div>

            <div className="mt-1 text-4xl font-black">
              {deal.amount.toLocaleString("ru-RU")} ₽
            </div>

            <p className="mt-3 text-xs font-bold leading-5 text-neutral-500">
              Это не оплата и не резерв денег. ПоРукам фиксирует факт
              договорённости между покупателем и продавцом.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <ConfirmBadge
              title="Покупатель"
              confirmed={deal.buyerConfirmed}
              name={deal.buyer.name}
            />
            <ConfirmBadge
              title="Продавец"
              confirmed={deal.sellerConfirmed}
              name={deal.seller.name}
            />
          </div>

          <div className="mt-3 text-sm font-bold text-neutral-600">
            Вы: {isSeller ? "продавец" : "покупатель"} ·{" "}
            {isSeller ? "Покупатель" : "Продавец"}: {partner.name}
          </div>

          <div className="mt-1 text-xs font-bold text-neutral-500">
            Создана: {formatDate(deal.createdAt)}
            {deal.completedAt ? ` · Завершена: ${formatDate(deal.completedAt)}` : ""}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {canConfirm ? (
            <form action={confirmDeal}>
              <input type="hidden" name="dealId" value={deal.id} />
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-5 py-4 font-black text-white shadow-lg shadow-orange-200">
                <CheckCircle2 size={20} />
                {isSeller ? "Подтвердить продажу" : "Подтвердить покупку"}
              </button>
            </form>
          ) : (
            <div className="rounded-2xl bg-white px-5 py-4 text-center text-sm font-black text-neutral-600">
              {myConfirmed ? "Вы подтвердили" : "Подтверждение недоступно"}
            </div>
          )}

          {deal.status !== "completed" && deal.status !== "cancelled" && (
            <div className="rounded-2xl bg-white px-5 py-4 text-sm font-bold leading-6 text-neutral-600">
              {partnerConfirmed
                ? "Вторая сторона уже подтвердила."
                : "Ждём подтверждение второй стороны."}
            </div>
          )}

          {canComplete && (
            <form action={completeDeal}>
              <input type="hidden" name="dealId" value={deal.id} />
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2ecc71] px-5 py-4 font-black text-white">
                <PackageCheck size={20} />
                Завершить после встречи
              </button>
            </form>
          )}

          {canCancel && (
            <form action={cancelDeal}>
              <input type="hidden" name="dealId" value={deal.id} />
              <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-5 py-4 font-black text-[#ff4b00]">
                <XCircle size={20} />
                Отменить
              </button>
            </form>
          )}

          {deal.status === "completed" && alreadyReviewed && (
            <div className="rounded-2xl bg-green-100 px-5 py-4 text-center text-sm font-black text-green-700">
              Отзыв оставлен
            </div>
          )}
        </div>
      </div>

      {canReview && (
        <form action={createReview} className="mt-5 rounded-3xl bg-white p-5">
          <input type="hidden" name="dealId" value={deal.id} />

          <div className="flex items-center gap-2 font-black">
            <Star size={20} className="fill-[#ff4b00] text-[#ff4b00]" />
            Оставить отзыв
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[150px_1fr_auto]">
            <select name="rating" className="input bg-white">
              <option value="5">5 звёзд</option>
              <option value="4">4 звезды</option>
              <option value="3">3 звезды</option>
              <option value="2">2 звезды</option>
              <option value="1">1 звезда</option>
            </select>

            <input
              name="text"
              placeholder="Напишите отзыв после сделки"
              className="input bg-white"
            />

            <button className="rounded-2xl bg-[#111111] px-5 py-4 font-black text-white">
              Отправить
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function ConfirmBadge({
  title,
  name,
  confirmed,
}: {
  title: string;
  name: string;
  confirmed: boolean;
}) {
  return (
    <div
      className={`rounded-2xl px-4 py-3 ${confirmed ? "bg-green-100 text-green-700" : "bg-white text-neutral-600"
        }`}
    >
      <div className="text-xs font-black">{title}</div>
      <div className="mt-1 font-black">{name}</div>
      <div className="mt-1 flex items-center gap-1 text-xs font-black">
        {confirmed ? (
          <>
            <CheckCircle2 size={14} />
            Подтвердил
          </>
        ) : (
          <>
            <Clock3 size={14} />
            Ждёт
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-[#fff7ed] p-5 text-center">
      <div className="text-3xl font-black">{value}</div>
      <div className="mt-1 text-xs font-bold text-neutral-500">{label}</div>
    </div>
  );
}

function EmptyDeals() {
  return (
    <div className="mt-6 rounded-[2rem] bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-50 text-[#ff4b00]">
        <Handshake size={34} />
      </div>

      <div className="mt-5 text-3xl font-black">Сделок пока нет</div>

      <p className="mx-auto mt-3 max-w-xl leading-7 text-neutral-600">
        Когда покупатель нажмёт «По рукам» на объявлении, здесь появится
        карточка сделки с суммой и подтверждениями сторон.
      </p>

      <Link
        href="/search"
        className="mt-6 inline-flex rounded-2xl bg-[#ff4b00] px-6 py-4 font-black text-white"
      >
        Перейти в каталог
      </Link>
    </div>
  );
}

function getDealStatusLabel(status: string) {
  if (status === "pending") return "Ожидает подтверждения";
  if (status === "confirmed") return "Договорились";
  if (status === "completed") return "Завершена";
  if (status === "cancelled") return "Отменена";

  return status;
}

function getDealStatusClass(status: string) {
  if (status === "pending") return "bg-orange-100 text-[#ff4b00]";
  if (status === "confirmed") return "bg-green-100 text-green-700";
  if (status === "completed") return "bg-[#111111] text-white";
  if (status === "cancelled") return "bg-neutral-200 text-neutral-700";

  return "bg-neutral-100 text-neutral-600";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}