import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { requireUserProfile } from "@/lib/auth";
import { requestVerification } from "./actions";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  XCircle,
} from "lucide-react";

export default async function VerificationPage() {
  const { profile } = await requireUserProfile();

  const isApproved = profile.verificationStatus === "approved";
  const isPending = profile.verificationStatus === "pending";
  const isRejected = profile.verificationStatus === "rejected";

  const statusLabel = getVerificationLabel(profile.verificationStatus);
  const statusClass = getVerificationClass(profile.verificationStatus);

  return (
    <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
      <SiteHeader compact />

      <section className="mx-auto max-w-4xl px-5 py-10">
        <Link
          href="/profile"
          className="mb-6 inline-flex items-center gap-2 font-black text-[#ff4b00]"
        >
          <ArrowLeft size={18} />
          В профиль
        </Link>

        <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-[#ff4b00] text-white">
                <ShieldCheck size={34} />
              </div>

              <div>
                <h1 className="text-4xl font-black">Проверка продавца</h1>
                <p className="mt-3 max-w-2xl leading-7 text-neutral-700">
                  Проверенный профиль вызывает больше доверия у покупателей.
                  После одобрения рядом с вашим именем появится статус
                  «Проверен».
                </p>
              </div>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-black ${statusClass}`}
            >
              {statusLabel}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <InfoCard
              title="1. Заявка"
              text="Вы коротко рассказываете, почему профиль можно проверить."
            />
            <InfoCard
              title="2. Модерация"
              text="Админ смотрит заявку на странице модерации."
            />
            <InfoCard
              title="3. Статус"
              text="После одобрения профиль получает отметку «Проверен»."
            />
          </div>

          {isApproved && <ApprovedBlock />}

          {isPending && <PendingBlock />}

          {isRejected && <RejectedBlock />}

          {!isApproved && !isPending && (
            <VerificationForm isRejected={isRejected} />
          )}
        </div>
      </section>
    </main>
  );
}

function VerificationForm({ isRejected }: { isRejected: boolean }) {
  return (
    <form action={requestVerification} className="mt-8 rounded-3xl bg-[#fff7ed] p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ff4b00] text-white">
          <ShieldCheck size={24} />
        </div>

        <div>
          <h2 className="text-2xl font-black">
            {isRejected ? "Отправить заявку повторно" : "Отправить заявку"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            Напишите пару предложений. Например: продаю лично, готов подтвердить
            профиль, регулярно отвечаю покупателям.
          </p>
        </div>
      </div>

      <textarea
        name="text"
        placeholder="Например: продаю лично, готов пройти проверку, аккаунт использую для реальных объявлений."
        className="input mt-5 min-h-36 resize-none bg-white"
      />

      <button className="mt-4 rounded-2xl bg-[#ff4b00] px-6 py-4 font-black text-white shadow-lg shadow-orange-200">
        Отправить на проверку
      </button>
    </form>
  );
}

function ApprovedBlock() {
  return (
    <div className="mt-8 rounded-3xl bg-green-50 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2ecc71] text-white">
          <CheckCircle2 size={26} />
        </div>

        <div>
          <h2 className="text-2xl font-black text-green-800">
            Профиль уже проверен
          </h2>
          <p className="mt-2 leading-7 text-green-900">
            Отлично. Покупатели будут видеть, что продавец прошёл проверку.
          </p>

          <Link
            href="/profile"
            className="mt-5 inline-flex rounded-2xl bg-[#2ecc71] px-5 py-3 font-black text-white"
          >
            Вернуться в профиль
          </Link>
        </div>
      </div>
    </div>
  );
}

function PendingBlock() {
  return (
    <div className="mt-8 rounded-3xl bg-orange-50 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ff4b00] text-white">
          <Clock3 size={26} />
        </div>

        <div>
          <h2 className="text-2xl font-black text-[#ff4b00]">
            Заявка уже на проверке
          </h2>
          <p className="mt-2 leading-7 text-neutral-700">
            Повторно отправлять ничего не нужно. Админ увидит заявку на странице
            модерации и сможет одобрить или отклонить её.
          </p>

          <Link
            href="/profile"
            className="mt-5 inline-flex rounded-2xl bg-[#ff4b00] px-5 py-3 font-black text-white"
          >
            Вернуться в профиль
          </Link>
        </div>
      </div>
    </div>
  );
}

function RejectedBlock() {
  return (
    <div className="mt-8 rounded-3xl bg-red-50 p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white">
          <XCircle size={26} />
        </div>

        <div>
          <h2 className="text-2xl font-black text-red-700">
            Прошлая заявка отклонена
          </h2>
          <p className="mt-2 leading-7 text-neutral-700">
            Можно отправить заявку повторно. Напишите подробнее, почему профиль
            можно проверить.
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-[#fff7ed] p-5">
      <div className="font-black">{title}</div>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
    </div>
  );
}

function getVerificationLabel(status: string) {
  if (status === "approved") return "Проверен";
  if (status === "pending") return "Заявка на проверке";
  if (status === "rejected") return "Проверка отклонена";

  return "Не проверен";
}

function getVerificationClass(status: string) {
  if (status === "approved") return "bg-green-100 text-green-700";
  if (status === "pending") return "bg-orange-100 text-[#ff4b00]";
  if (status === "rejected") return "bg-red-100 text-red-700";

  return "bg-neutral-100 text-neutral-600";
}