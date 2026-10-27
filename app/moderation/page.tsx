import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import {
  approveListing,
  approveVerification,
  ignoreReport,
  rejectListing,
  rejectVerification,
  resolveReport,
} from "./actions";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileWarning,
  ShieldCheck,
  UserCheck,
  XCircle,
} from "lucide-react";

export default async function ModerationPage() {
  await requireAdmin();

  const [
    listings,
    verificationRequests,
    reports,
    moderationListingsCount,
    activeListingsCount,
    pendingVerificationCount,
    newReportsCount,
  ] = await Promise.all([
    prisma.listing.findMany({
      where: {
        status: "moderation",
      },
      include: {
        seller: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.verificationRequest.findMany({
      where: {
        status: "pending",
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.report.findMany({
      where: {
        status: "new",
      },
      include: {
        listing: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.listing.count({
      where: {
        status: "moderation",
      },
    }),

    prisma.listing.count({
      where: {
        status: "active",
      },
    }),

    prisma.verificationRequest.count({
      where: {
        status: "pending",
      },
    }),

    prisma.report.count({
      where: {
        status: "new",
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
      <SiteHeader compact />

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-[#ff4b00]">
                <ShieldCheck size={18} />
                Центр доверия ПоРукам
              </div>

              <h1 className="text-4xl font-black tracking-tight">
                Модерация
              </h1>

              <p className="mt-3 max-w-3xl leading-7 text-neutral-600">
                Здесь админ проверяет объявления, заявки продавцов и жалобы.
                Цель — чтобы площадка оставалась честной, живой и безопасной.
              </p>
            </div>

            <Link
              href="/profile"
              className="rounded-2xl bg-[#111111] px-6 py-4 text-center font-black text-white"
            >
              В профиль
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard
              icon={<Clock3 size={22} />}
              label="На модерации"
              value={String(moderationListingsCount)}
            />
            <StatCard
              icon={<CheckCircle2 size={22} />}
              label="Активных"
              value={String(activeListingsCount)}
            />
            <StatCard
              icon={<UserCheck size={22} />}
              label="Заявок"
              value={String(pendingVerificationCount)}
            />
            <StatCard
              icon={<FileWarning size={22} />}
              label="Жалоб"
              value={String(newReportsCount)}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <ListingsModeration listings={listings} />

          <div className="space-y-6">
            <VerificationModeration requests={verificationRequests} />
            <ReportsModeration reports={reports} />
          </div>
        </div>
      </section>
    </main>
  );
}

type ModerationListing = {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  category: string;
  condition: string;
  dealMethod: string;
  description: string;
  sellerName: string;
  createdAt: Date;
  seller: {
    name: string;
    email: string;
    isVerified: boolean;
  } | null;
};

function ListingsModeration({
  listings,
}: {
  listings: ModerationListing[];
}) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black">Объявления на проверке</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Новые объявления не попадают в каталог, пока админ их не одобрит.
          </p>
        </div>

        <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-[#ff4b00]">
          {listings.length}
        </span>
      </div>

      <div className="mt-6 space-y-5">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <div
              key={listing.id}
              className="rounded-[2rem] border border-orange-100 bg-[#fff7ed] p-4"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[150px_1fr]">
                <Link
                  href={`/listing/${listing.id}`}
                  className="h-40 rounded-2xl bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${listing.image})`,
                  }}
                />

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/listing/${listing.id}`}
                      className="text-2xl font-black hover:text-[#ff4b00]"
                    >
                      {listing.title}
                    </Link>

                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-[#ff4b00]">
                      На проверке
                    </span>
                  </div>

                  <div className="mt-2 text-3xl font-black">
                    {listing.price.toLocaleString("ru-RU")} ₽
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-2 text-sm font-bold text-neutral-600 md:grid-cols-2">
                    <div>Место: {listing.location}</div>
                    <div>Категория: {listing.category}</div>
                    <div>Состояние: {listing.condition}</div>
                    <div>Способ сделки: {listing.dealMethod}</div>
                  </div>

                  <p className="mt-4 line-clamp-3 leading-7 text-neutral-700">
                    {listing.description}
                  </p>

                  <div className="mt-4 rounded-3xl bg-white p-4">
                    <div className="text-sm font-black text-neutral-500">
                      Продавец
                    </div>
                    <div className="mt-1 font-black">
                      {listing.seller?.name || listing.sellerName}
                    </div>
                    <div className="mt-1 text-sm font-bold text-neutral-500">
                      {listing.seller?.email || "email не найден"}
                    </div>
                    <div className="mt-2 text-xs font-black">
                      {listing.seller?.isVerified
                        ? "Проверенный продавец"
                        : "Продавец пока не проверен"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <form action={approveListing}>
                  <input type="hidden" name="listingId" value={listing.id} />
                  <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2ecc71] px-5 py-4 font-black text-white">
                    <CheckCircle2 size={20} />
                    Одобрить
                  </button>
                </form>

                <form action={rejectListing} className="space-y-3">
                  <input type="hidden" name="listingId" value={listing.id} />
                  <input
                    name="reason"
                    placeholder="Причина отказа"
                    className="input bg-white"
                  />
                  <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111111] px-5 py-4 font-black text-white">
                    <XCircle size={20} />
                    Отклонить
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <EmptyBlock
            title="Нет объявлений на модерации"
            text="Когда пользователь подаст новое объявление, оно появится здесь."
          />
        )}
      </div>
    </section>
  );
}

type VerificationRequestItem = {
  id: string;
  text: string;
  createdAt: Date;
  user: {
    name: string;
    email: string;
    city: string;
    isVerified: boolean;
    verificationStatus: string;
  };
};

function VerificationModeration({
  requests,
}: {
  requests: VerificationRequestItem[];
}) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black">Проверка продавцов</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Проверенный продавец получает больше доверия у покупателей.
          </p>
        </div>

        <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-[#ff4b00]">
          {requests.length}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div
              key={request.id}
              className="rounded-3xl border border-orange-100 bg-[#fff7ed] p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#ff4b00] text-white">
                  <ShieldCheck size={28} />
                </div>

                <div>
                  <div className="text-xl font-black">
                    {request.user.name}
                  </div>
                  <div className="mt-1 text-sm font-bold text-neutral-600">
                    {request.user.email}
                  </div>
                  <div className="mt-1 text-sm font-bold text-neutral-600">
                    Город: {request.user.city}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-neutral-700">
                    {request.text ||
                      "Пользователь просит проверить профиль."}
                  </p>

                  <div className="mt-2 text-xs font-bold text-neutral-500">
                    Отправлено: {formatDate(request.createdAt)}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <form action={approveVerification}>
                  <input type="hidden" name="requestId" value={request.id} />
                  <button className="w-full rounded-2xl bg-[#2ecc71] px-5 py-4 font-black text-white">
                    Одобрить проверку
                  </button>
                </form>

                <form action={rejectVerification}>
                  <input type="hidden" name="requestId" value={request.id} />
                  <button className="w-full rounded-2xl bg-[#111111] px-5 py-4 font-black text-white">
                    Отказать
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <EmptyBlock
            title="Нет заявок на проверку"
            text="Когда продавец отправит заявку, она появится здесь."
          />
        )}
      </div>
    </section>
  );
}

type ReportItem = {
  id: string;
  reason: string;
  text: string;
  createdAt: Date;
  listing: {
    id: string;
    title: string;
    image: string;
  } | null;
  user: {
    name: string;
    email: string;
  };
};

function ReportsModeration({ reports }: { reports: ReportItem[] }) {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black">Жалобы</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Сюда будут попадать жалобы на объявления и подозрительные действия.
          </p>
        </div>

        <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700">
          {reports.length}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {reports.length > 0 ? (
          reports.map((report) => (
            <div
              key={report.id}
              className="rounded-3xl border border-red-100 bg-red-50 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white">
                  <AlertTriangle size={28} />
                </div>

                <div>
                  <div className="text-xl font-black">
                    {report.reason || "Жалоба"}
                  </div>

                  <div className="mt-1 text-sm font-bold text-neutral-600">
                    От: {report.user.name} · {report.user.email}
                  </div>

                  {report.listing ? (
                    <Link
                      href={`/listing/${report.listing.id}`}
                      className="mt-3 block font-black text-[#ff4b00]"
                    >
                      {report.listing.title}
                    </Link>
                  ) : (
                    <div className="mt-3 font-bold text-neutral-600">
                      Объявление не указано
                    </div>
                  )}

                  <p className="mt-3 text-sm leading-6 text-neutral-700">
                    {report.text || "Текст жалобы не указан."}
                  </p>

                  <div className="mt-2 text-xs font-bold text-neutral-500">
                    Создана: {formatDate(report.createdAt)}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <form action={resolveReport}>
                  <input type="hidden" name="reportId" value={report.id} />
                  <button className="w-full rounded-2xl bg-[#2ecc71] px-5 py-4 font-black text-white">
                    Решено
                  </button>
                </form>

                <form action={ignoreReport}>
                  <input type="hidden" name="reportId" value={report.id} />
                  <button className="w-full rounded-2xl bg-white px-5 py-4 font-black text-red-700">
                    Игнорировать
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <EmptyBlock
            title="Жалоб пока нет"
            text="Позже подключим кнопку жалобы на странице объявления."
          />
        )}
      </div>
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl bg-[#fff7ed] p-5">
      <div className="flex items-center gap-2 text-[#ff4b00]">
        {icon}
        <BarChart3 size={18} />
      </div>
      <div className="mt-3 text-3xl font-black">{value}</div>
      <div className="mt-1 text-xs font-bold text-neutral-500">{label}</div>
    </div>
  );
}

function EmptyBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-[#fff7ed] p-6 text-center">
      <div className="text-2xl font-black">{title}</div>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
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