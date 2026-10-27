import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createDeal } from "@/app/deals/actions";
import { createReport } from "@/app/reports/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { FavoriteButton } from "@/components/FavoriteButton";
import { BusinessAdBlock } from "@/components/BusinessAdBlock";
import {
  ArrowLeft,
  Check,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";

type SellerReview = {
  id: string;
  rating: number;
  text: string;
  createdAt: Date;
  reviewer: {
    name: string;
  };
};

export default async function ListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    reported?: string;
  }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const wasReported = query.reported === "1";

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const product = await prisma.listing.findUnique({
    where: {
      id: slug,
    },
    include: {
      seller: true,
    },
  });

  if (!product) {
    notFound();
  }

  await prisma.listing.update({
    where: {
      id: product.id,
    },
    data: {
      views: {
        increment: 1,
      },
    },
  });

  let sellerCompletedDealsCount = 0;
  let sellerReviews: SellerReview[] = [];

  if (product.sellerId) {
    sellerCompletedDealsCount = await prisma.deal.count({
      where: {
        sellerId: product.sellerId,
        status: "completed",
      },
    });

    sellerReviews = await prisma.review.findMany({
      where: {
        receiverId: product.sellerId,
      },
      select: {
        id: true,
        rating: true,
        text: true,
        createdAt: true,
        reviewer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    });
  }

  const averageRating =
    sellerReviews.length > 0
      ? sellerReviews.reduce((sum, review) => sum + review.rating, 0) /
      sellerReviews.length
      : null;

  const isOwnListing = Boolean(user?.id && product.sellerId === user.id);
  const canCreateDeal =
    product.status === "active" && Boolean(product.sellerId) && !isOwnListing;

  const sellerName = product.seller?.name || product.sellerName;
  const sellerCity = product.seller?.city || product.city;
  const sellerVerificationStatus =
    product.seller?.verificationStatus || "none";
  const sellerIsVerified = Boolean(product.seller?.isVerified);

  return (
    <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
      <SiteHeader compact />

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <Link
          href="/search"
          className="mb-6 inline-flex items-center gap-2 font-black text-[#ff4b00]"
        >
          <ArrowLeft size={18} />
          Назад к объявлениям
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_390px]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
              <div
                className="h-[420px] bg-cover bg-center"
                style={{ backgroundImage: `url(${product.image})` }}
              />

              {product.images.length > 1 && (
                <div className="grid grid-cols-3 gap-3 p-4">
                  {product.images.map((image) => (
                    <div
                      key={image}
                      className="h-28 rounded-2xl bg-cover bg-center"
                      style={{ backgroundImage: `url(${image})` }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${getListingStatusClass(
                        product.status
                      )}`}
                    >
                      {getListingStatusLabel(product.status)}
                    </span>

                    {sellerIsVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
                        <ShieldCheck size={14} />
                        Продавец проверен
                      </span>
                    )}
                  </div>

                  <h1 className="text-4xl font-black tracking-tight">
                    {product.title}
                  </h1>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold text-neutral-600">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={16} className="text-[#ff4b00]" />
                      {product.location}
                    </span>
                    <span>{formatDate(product.published)}</span>
                    <span>{product.views + 1} просмотров</span>
                  </div>
                </div>

                <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#ff4b00]">
                  <Heart size={22} />
                </button>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-black">Описание</h2>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-700">
                  {product.description}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <InfoCard title="Состояние" value={product.condition} />
                <InfoCard title="Категория" value={product.category} />
                <InfoCard title="Способ сделки" value={product.dealMethod} />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoCard title="Город" value={product.city} />
                <InfoCard
                  title="Район / место"
                  value={
                    product.address
                      ? `${product.district}, ${product.address}`
                      : product.district
                  }
                />
              </div>
            </div>

            <ReviewsBlock reviews={sellerReviews} />
          </div>

          <aside className="space-y-5">
            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="text-sm font-black text-neutral-500">Цена</div>
              <div className="mt-2 break-words text-4xl font-black leading-tight md:text-5xl">
                {product.price.toLocaleString("ru-RU")} ₽
              </div>
              {isOwnListing && product.status !== "sold" && (
                <Link
                  href={`/listing/${product.id}/edit`}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#111111] px-6 py-4 text-lg font-black text-white"
                >
                  Редактировать объявление
                </Link>
              )}
              <div className="mt-5">
                <FavoriteButton
                  listingId={product.id}
                  sellerId={product.sellerId}
                  favoritesCount={product.favorites}
                  variant="wide"
                />
              </div>
              <div className="mt-6 grid grid-cols-1 gap-3">
                <Link
                  href={`/chat/${product.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-6 py-4 text-lg font-black text-white shadow-xl shadow-orange-200 transition hover:-translate-y-0.5"
                >
                  <MessageCircle size={22} />
                  Написать продавцу
                </Link>

                <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-6 py-4 text-lg font-black text-[#ff4b00]">
                  <Phone size={22} />
                  Показать телефон
                </button>

                {canCreateDeal ? (
                  <form
                    action={createDeal}
                    className="mt-5 rounded-3xl bg-orange-50 p-5"
                  >
                    <input type="hidden" name="listingId" value={product.id} />

                    <div className="text-sm font-black text-neutral-500">
                      Предложить сделку
                    </div>

                    <div className="mt-1 font-black">
                      Покупатель готов купить за
                    </div>

                    <input
                      name="amount"
                      defaultValue={product.price}
                      className="mt-3 w-full rounded-2xl border border-orange-100 bg-white px-4 py-4 text-2xl font-black outline-none focus:border-[#ff4b00]"
                    />

                    <button className="mt-3 w-full rounded-2xl bg-[#ff4b00] px-5 py-4 font-black text-white">
                      По рукам
                    </button>

                    <p className="mt-3 text-xs font-bold leading-5 text-neutral-500">
                      Мы не резервируем деньги. Фиксируем только договорённость:
                      товар, продавца, покупателя и сумму.
                    </p>
                  </form>
                ) : (
                  <DealUnavailableBlock
                    status={product.status}
                    isOwnListing={isOwnListing}
                    hasSeller={Boolean(product.sellerId)}
                  />
                )}
              </div>
            </div>

            <SellerCard
              sellerId={product.sellerId}
              name={sellerName}
              city={sellerCity}
              verificationStatus={sellerVerificationStatus}
              isVerified={sellerIsVerified}
              completedDealsCount={sellerCompletedDealsCount}
              reviewsCount={sellerReviews.length}
              averageRating={averageRating}
            />
            <ReportCard
              listingId={product.id}
              isOwnListing={isOwnListing}
              wasReported={wasReported}
            />
            <BusinessAdBlock variant="listing" />

            <div className="rounded-[2rem] bg-[#111111] p-6 text-white">
              <h2 className="text-2xl font-black">Безопасность</h2>
              <div className="mt-5 space-y-4 text-sm leading-6 text-neutral-200">
                <SafetyTip text="Не переводите предоплату незнакомым людям." />
                <SafetyTip text="Проверяйте товар перед оплатой." />
                <SafetyTip text="Фиксируйте договорённость через «По рукам»." />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function SellerCard({
  sellerId,
  name,
  city,
  verificationStatus,
  isVerified,
  completedDealsCount,
  reviewsCount,
  averageRating,
}: {
  sellerId: string | null;
  name: string;
  city: string;
  verificationStatus: string;
  isVerified: boolean;
  completedDealsCount: number;
  reviewsCount: number;
  averageRating: number | null;
}) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">Продавец</h2>

      <div className="mt-5 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-100 text-[#ff4b00]">
          <UserRound size={34} />
        </div>

        <div>
          {sellerId ? (
            <Link
              href={`/seller/${sellerId}`}
              className="text-xl font-black hover:text-[#ff4b00]"
            >
              {name}
            </Link>
          ) : (
            <div className="text-xl font-black">{name}</div>
          )}
          <div className="mt-1 flex items-center gap-1 text-sm font-bold text-neutral-600">
            <MapPin size={15} className="text-[#ff4b00]" />
            {city}
          </div>

          <div className="mt-1 flex items-center gap-1 text-sm font-bold text-neutral-600">
            <Star size={15} className="fill-[#ff4b00] text-[#ff4b00]" />
            {averageRating ? averageRating.toFixed(1) : "нет отзывов"} ·{" "}
            {completedDealsCount} сделок
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <SellerBadge
          text={getVerificationLabel(verificationStatus)}
          active={isVerified}
        />
        <SellerBadge
          text={`${completedDealsCount} завершённых сделок «По рукам»`}
          active={completedDealsCount > 0}
        />
        <SellerBadge
          text={`${reviewsCount} отзывов`}
          active={reviewsCount > 0}
        />
      </div>
    </div>
  );
}

function ReviewsBlock({ reviews }: { reviews: SellerReview[] }) {
  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-2xl font-black">Отзывы о продавце</h2>

      <div className="mt-5 space-y-4">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-3xl border border-orange-100 bg-[#fff7ed] p-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-black">{review.reviewer.name}</div>

                <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-black text-[#ff4b00]">
                  <Star size={15} className="fill-[#ff4b00] text-[#ff4b00]" />
                  {review.rating}
                </span>

                <span className="text-xs font-bold text-neutral-500">
                  {formatDate(review.createdAt)}
                </span>
              </div>

              <p className="mt-3 leading-7 text-neutral-700">
                {review.text || "Пользователь оставил оценку без текста."}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-3xl bg-[#fff7ed] p-6 text-center font-bold text-neutral-600">
            У продавца пока нет отзывов
          </div>
        )}
      </div>
    </div>
  );
}

function DealUnavailableBlock({
  status,
  isOwnListing,
  hasSeller,
}: {
  status: string;
  isOwnListing: boolean;
  hasSeller: boolean;
}) {
  let title = "Сделка недоступна";
  let text = "Сейчас нельзя создать сделку по этому объявлению.";

  if (isOwnListing) {
    title = "Это ваше объявление";
    text = "Покупатель сможет нажать «По рукам» со своей стороны.";
  } else if (!hasSeller) {
    title = "Продавец не привязан";
    text = "Это старое объявление без аккаунта продавца. Сделку создать нельзя.";
  } else if (status === "moderation") {
    title = "Объявление на проверке";
    text = "Сделку можно будет создать после одобрения модератором.";
  } else if (status === "rejected") {
    title = "Объявление отклонено";
    text = "По отклонённому объявлению нельзя создать сделку.";
  } else if (status === "sold") {
    title = "Товар продан";
    text = "Сделка по этому объявлению уже завершена.";
  }

  return (
    <div className="mt-5 rounded-3xl bg-orange-50 p-5">
      <div className="font-black">{title}</div>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl bg-[#fff7ed] p-5">
      <div className="text-sm font-black text-neutral-500">{title}</div>
      <div className="mt-2 text-xl font-black">{value || "Не указано"}</div>
    </div>
  );
}

function SellerBadge({ text, active }: { text: string; active: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm font-bold text-neutral-700">
      <ShieldCheck
        size={18}
        className={active ? "text-[#2ecc71]" : "text-neutral-400"}
      />
      {text}
    </div>
  );
}

function SafetyTip({ text }: { text: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2ecc71] text-white">
        <Check size={12} strokeWidth={4} />
      </span>
      <span>{text}</span>
    </div>
  );
}

function getListingStatusLabel(status: string) {
  if (status === "active") return "Активно";
  if (status === "moderation") return "На модерации";
  if (status === "rejected") return "Отклонено";
  if (status === "sold") return "Продано";

  return status;
}

function getListingStatusClass(status: string) {
  if (status === "active") return "bg-green-100 text-green-700";
  if (status === "moderation") return "bg-orange-100 text-[#ff4b00]";
  if (status === "rejected") return "bg-red-100 text-red-700";
  if (status === "sold") return "bg-neutral-200 text-neutral-700";

  return "bg-neutral-100 text-neutral-600";
}

function getVerificationLabel(status: string) {
  if (status === "approved") return "Проверен";
  if (status === "pending") return "Заявка на проверке";
  if (status === "rejected") return "Проверка отклонена";

  return "Не проверен";
}

function ReportCard({
  listingId,
  isOwnListing,
  wasReported,
}: {
  listingId: string;
  isOwnListing: boolean;
  wasReported: boolean;
}) {
  if (isOwnListing) {
    return (
      <div className="rounded-[2rem] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black">Жалоба</h2>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Это ваше объявление, поэтому пожаловаться на него нельзя.
        </p>
      </div>
    );
  }

  if (wasReported) {
    return (
      <div className="rounded-[2rem] bg-green-50 p-6 shadow-sm">
        <h2 className="text-2xl font-black text-green-800">
          Жалоба отправлена
        </h2>
        <p className="mt-3 text-sm leading-6 text-green-900">
          Спасибо. Модератор проверит объявление в центре доверия ПоРукам.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-black">Пожаловаться</h2>

      <p className="mt-3 text-sm leading-6 text-neutral-600">
        Если объявление выглядит подозрительно, отправьте жалобу. Модератор
        проверит её в центре доверия.
      </p>

      <form action={createReport} className="mt-5 space-y-3">
        <input type="hidden" name="listingId" value={listingId} />

        <select name="reason" className="input bg-[#fff7ed]" defaultValue="">
          <option value="" disabled>
            Выберите причину
          </option>
          <option value="Похоже на мошенничество">
            Похоже на мошенничество
          </option>
          <option value="Неверная цена или описание">
            Неверная цена или описание
          </option>
          <option value="Запрещённый товар">Запрещённый товар</option>
          <option value="Дубликат объявления">Дубликат объявления</option>
          <option value="Другое">Другое</option>
        </select>

        <textarea
          name="text"
          placeholder="Коротко опишите проблему"
          className="input min-h-28 resize-none bg-[#fff7ed]"
        />

        <button className="w-full rounded-2xl bg-[#111111] px-5 py-4 font-black text-white">
          Отправить жалобу
        </button>
      </form>
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