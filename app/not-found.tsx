import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Home, Search } from "lucide-react";

export default function NotFound() {
    return (
        <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
            <SiteHeader compact />

            <section className="mx-auto flex max-w-4xl flex-col items-center px-5 py-24 text-center">
                <div className="rounded-full bg-orange-100 px-5 py-3 text-sm font-black text-[#ff4b00]">
                    404
                </div>

                <h1 className="mt-8 text-5xl font-black tracking-tight">
                    Страница не найдена
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-700">
                    Такой страницы на ПоРукам нет. Возможно, ссылка устарела или адрес
                    набран с ошибкой.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Link
                        href="/search"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-7 py-4 font-black text-white shadow-lg shadow-orange-200"
                    >
                        <Search size={20} />
                        Перейти в каталог
                    </Link>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-7 py-4 font-black text-[#ff4b00]"
                    >
                        <Home size={20} />
                        На главную
                    </Link>
                </div>
            </section>
        </main>
    );
}