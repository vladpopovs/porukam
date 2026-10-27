import Link from "next/link";
import { ArrowRight, Building2, Megaphone, Sparkles } from "lucide-react";

type BusinessAdBlockProps = {
    variant?: "home" | "catalog" | "listing" | "compact";
};

export function BusinessAdBlock({ variant = "home" }: BusinessAdBlockProps) {
    if (variant === "catalog") {
        return (
            <div className="overflow-hidden rounded-3xl bg-[#111111] p-5 text-white shadow-sm">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-orange-100">
                            <Sparkles size={15} />
                            Реклама в категории
                        </div>

                        <h2 className="mt-3 text-2xl font-black tracking-tight">
                            Тут может быть ваш бренд
                        </h2>

                        <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-neutral-300">
                            Покажите магазин, сервис или федеральный бренд пользователям,
                            которые уже выбирают товар.
                        </p>
                    </div>

                    <Link
                        href="/advertising"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-5 py-3 text-sm font-black text-white"
                    >
                        Реклама от 50 000 ₽
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        );
    }

    if (variant === "listing") {
        return (
            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-[#ff4b00]">
                    <Building2 size={15} />
                    Партнёрский блок
                </div>

                <h2 className="mt-4 text-2xl font-black">Реклама рядом со сделкой</h2>

                <p className="mt-3 text-sm leading-6 text-neutral-600">
                    Доставка, ремонт, страховка, проверка товара или сервис рядом с
                    покупкой.
                </p>

                <Link
                    href="/advertising"
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111111] px-5 py-4 font-black text-white"
                >
                    Разместиться
                    <ArrowRight size={18} />
                </Link>
            </div>
        );
    }

    if (variant === "compact") {
        return (
            <div className="rounded-[2rem] bg-[#111111] p-6 text-white shadow-sm">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-black text-orange-100">
                    <Megaphone size={15} />
                    Для бизнеса
                </div>

                <h2 className="mt-4 text-2xl font-black">Тут может быть ваш бренд</h2>

                <p className="mt-3 text-sm leading-6 text-neutral-300">
                    Размещения для ИП, магазинов, сервисов и брендов.
                </p>

                <Link
                    href="/advertising"
                    className="mt-5 inline-flex items-center gap-2 font-black text-[#ff4b00]"
                >
                    Узнать условия
                    <ArrowRight size={18} />
                </Link>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#111111] p-7 text-white shadow-xl shadow-orange-100 md:p-8">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#ff4b00]/35 blur-2xl" />
            <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-[#2ecc71]/20 blur-2xl" />

            <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-orange-100">
                        <Megaphone size={18} />
                        Бизнес и реклама
                    </div>

                    <h2 className="mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
                        Тут может быть ваш бренд
                    </h2>

                    <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-300 md:text-lg md:leading-8">
                        Покажите сервис, магазин или федеральный бренд покупателям и
                        продавцам рядом с моментом сделки.
                    </p>
                </div>

                <div className="rounded-[2rem] bg-white p-5 text-[#111111] lg:w-80">
                    <div className="text-sm font-black text-neutral-500">
                        Размещения для бизнеса
                    </div>

                    <div className="mt-2 text-3xl font-black">от 50 000 ₽</div>

                    <p className="mt-3 text-sm leading-6 text-neutral-600">
                        Город, категория, главная, федеральный пакет или спецпроект.
                    </p>

                    <Link
                        href="/advertising"
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-5 py-4 font-black text-white"
                    >
                        Узнать условия
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
}