import Link from "next/link";
import { CitySelect } from "@/components/CitySelect";
import { signIn, signUp } from "./actions";
import { Check, LogIn, UserPlus } from "lucide-react";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    message?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
      <header className="border-b border-orange-100 bg-[#fff7ed]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff4b00] text-white shadow-lg shadow-orange-200">
              <Check size={25} strokeWidth={4} />
              <div className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-[#2ecc71] ring-4 ring-white" />
            </div>
            <div className="text-2xl font-black">ПоРукам</div>
          </Link>

          <Link
            href="/"
            className="rounded-2xl border border-orange-200 bg-white px-5 py-3 font-black text-[#ff4b00]"
          >
            На главную
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-8">
          <h1 className="text-5xl font-black tracking-tight">
            Вход в ПоРукам
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-neutral-700">
            Войдите или создайте аккаунт, чтобы подавать объявления, писать
            продавцам и подтверждать сделки “По рукам”.
          </p>
        </div>

        {params.message && (
          <div className="mb-6 rounded-3xl border border-orange-200 bg-white p-5 font-bold text-[#ff4b00] shadow-sm">
            {params.message}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <form
            action={signIn}
            className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff4b00] text-white">
                <LogIn size={26} />
              </div>
              <div>
                <h2 className="text-3xl font-black">Войти</h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Для тех, у кого уже есть аккаунт.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <Field label="Email">
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="input"
                />
              </Field>

              <Field label="Пароль">
                <input
                  name="password"
                  type="password"
                  placeholder="Введите пароль"
                  className="input"
                />
              </Field>
            </div>

            <button className="mt-8 w-full rounded-2xl bg-[#ff4b00] px-7 py-4 text-lg font-black text-white shadow-xl shadow-orange-200">
              Войти
            </button>
          </form>

          <form
            action={signUp}
            className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#111111] text-white">
                <UserPlus size={26} />
              </div>
              <div>
                <h2 className="text-3xl font-black">Создать аккаунт</h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Имя и город появятся в вашем профиле.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <Field label="Имя">
                <input
                  name="name"
                  placeholder="Например: Алексей"
                  className="input"
                />
              </Field>

              <Field label="Город">
                <CitySelect
                  name="city"
                  defaultValue="Москва"
                  includeAllRussia={false}
                />
              </Field>

              <Field label="Email">
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="input"
                />
              </Field>

              <Field label="Пароль">
                <input
                  name="password"
                  type="password"
                  placeholder="Минимум 6 символов"
                  className="input"
                />
              </Field>
            </div>

            <button className="mt-8 w-full rounded-2xl bg-[#111111] px-7 py-4 text-lg font-black text-white">
              Зарегистрироваться
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-neutral-700">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}