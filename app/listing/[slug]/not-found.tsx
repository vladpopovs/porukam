import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { AlertTriangle, Home, Plus, Search } from "lucide-react";

export default function ListingNotFound() {
    return (
        <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
            <SiteHeader compact />

            <section className="mx-auto flex max-w-4xl flex-col items-center px-5 py-20 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-orange-100 text-[#ff4b00]">
                    <AlertTriangle size={42} />
                </div>

                <h1 className="mt-8 text-5xl font-black tracking-tight">
                    Объявление не найдено
                </h1>

                <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-700">
                    Возможно, объявление было удалено, продано, отклонено модерацией или
                    ссылка устарела. Старые ссылки вроде <span className="font-black">/listing/1</span>{" "}
                    больше могут не работать, потому что объявления теперь берутся из базы.
                </p>

                <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-4 md:grid-cols-3">
                    <Link
                        href="/search"
                        className="flex items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-6 py-4 font-black text-white shadow-lg shadow-orange-200"
                    >
                        <Search size={20} />
                        В каталог
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-6 py-4 font-black text-[#ff4b00]"
                    >
                        <Home size={20} />
                        На главную
                    </Link>

                    <Link
                        href="/new"
                        className="flex items-center justify-center gap-2 rounded-2xl bg-[#111111] px-6 py-4 font-black text-white"
                    >
                        <Plus size={20} />
                        Подать
                    </Link>
                </div>

                <div className="mt-10 rounded-[2rem] bg-white p-6 text-left shadow-sm">
                    <h2 className="text-2xl font-black">Почему так бывает?</h2>

                    <div className="mt-4 space-y-3 text-sm font-bold leading-6 text-neutral-600">
                        <p>— объявление ещё на модерации и не видно покупателям;</p>
                        <p>— продавец удалил или продал товар;</p>
                        <p>— ссылка ведёт на старый тестовый id;</p>
                        <p>— объявление отклонил модератор.</p>
                    </div>
                </div>
            </section>
        </main>
    );
}