import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import {
    ArrowRight,
    BadgeRussianRuble,
    Building2,
    Check,
    Crown,
    Globe2,
    Handshake,
    MapPin,
    Megaphone,
    PackageCheck,
    ShieldCheck,
    Sparkles,
    Target,
    Zap,
} from "lucide-react";

export const metadata = {
    title: "Реклама на ПоРукам",
    description:
        "Рекламные размещения, спецпроекты и партнёрства на ПоРукам для бизнеса и крупных брендов.",
};

const adProducts = [
    {
        title: "Городское размещение",
        price: "от 50 000 ₽",
        period: "в неделю",
        icon: MapPin,
        text: "Для сервисов и магазинов, которые работают в конкретном городе.",
        items: ["Москва, Санкт-Петербург, Казань и другие города", "Показы в каталоге", "Показы рядом с объявлениями", "Подходит локальному бизнесу"],
    },
    {
        title: "Категорийное размещение",
        price: "от 120 000 ₽",
        period: "в неделю",
        icon: Target,
        text: "Для брендов, которым важна аудитория конкретной категории.",
        items: ["Электроника", "Авто", "Недвижимость", "Услуги", "Дом и ремонт"],
    },
    {
        title: "Главная страница",
        price: "от 250 000 ₽",
        period: "в неделю",
        icon: Crown,
        text: "Большой бренд-блок на главной странице ПоРукам.",
        items: ["Максимальная видимость", "Федеральный охват", "Крупный визуальный формат", "Подходит для запусков"],
    },
    {
        title: "Федеральный пакет",
        price: "от 900 000 ₽",
        period: "в месяц",
        icon: Globe2,
        text: "Показы по всей площадке: главная, каталог, категории и объявления.",
        items: ["Главная", "Каталог", "Категории", "Города", "Страницы объявлений"],
    },
    {
        title: "Эксклюзив категории",
        price: "от 2 000 000 ₽",
        period: "в месяц",
        icon: ShieldCheck,
        text: "Бренд становится партнёром отдельной категории.",
        items: ["Эксклюзивный статус", "Нативные блоки", "Категорийная витрина", "Индивидуальный медиаплан"],
    },
    {
        title: "Спецпроект",
        price: "от 5 000 000 ₽",
        period: "за проект",
        icon: Zap,
        text: "Нативная интеграция бренда в сценарий покупки и продажи.",
        items: ["Лендинг", "Брендированные блоки", "Интеграция в сделку", "Подборки и спецмеханики"],
    },
];

const examples = [
    {
        title: "Авиасейлс",
        text: "Спецпроект «Путешествия по рукам»: билеты, поездки, объявления рядом с отпуском и переездом.",
    },
    {
        title: "Банк",
        text: "Партнёр раздела «Недвижимость»: ипотека, страхование, проверка документов.",
    },
    {
        title: "Доставка",
        text: "Партнёр сценария сделки: доставить товар, перевезти мебель, организовать переезд.",
    },
    {
        title: "Страховая",
        text: "Партнёр разделов «Авто» и «Электроника»: страховка покупки и проверка товара.",
    },
];

export default function AdvertisingPage() {
    return (
        <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
            <SiteHeader compact />

            <section className="relative overflow-hidden bg-[#111111] text-white">
                <div className="absolute -left-28 -top-28 h-96 w-96 rounded-full bg-[#ff4b00]/40 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-[#2ecc71]/25 blur-3xl" />

                <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 lg:grid-cols-[1fr_0.85fr] lg:px-8 lg:py-20">
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-orange-100">
                            <Megaphone size={18} />
                            Реклама для бизнеса и брендов
                        </div>

                        <h1 className="text-6xl font-black leading-[0.95] tracking-tight md:text-7xl">
                            Ваш бренд
                            <br />
                            рядом с моментом
                            <br />
                            <span className="text-[#ff4b00]">сделки</span>
                        </h1>

                        <p className="mt-6 max-w-3xl text-xl leading-9 text-neutral-300">
                            ПоРукам — место, где люди выбирают товар, общаются с продавцом и
                            договариваются о покупке. Реклама здесь появляется не случайно, а
                            рядом с реальным намерением купить.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="#contact"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-7 py-4 font-black text-white shadow-xl shadow-orange-950/40"
                            >
                                Обсудить размещение
                                <ArrowRight size={20} />
                            </Link>

                            <Link
                                href="/pricing"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-black text-[#111111]"
                            >
                                Тарифы для бизнеса
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-[2.5rem] bg-white p-6 text-[#111111] shadow-2xl">
                        <div className="rounded-[2rem] bg-[#fff7ed] p-6">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#ff4b00] shadow-sm">
                                <Sparkles size={18} />
                                Пример блока
                            </div>

                            <h2 className="mt-5 text-4xl font-black">
                                Тут может быть ваш бренд
                            </h2>

                            <p className="mt-4 text-lg leading-8 text-neutral-700">
                                Покажите сервис покупателям и продавцам в момент, когда они уже
                                выбирают товар, город, категорию и способ сделки.
                            </p>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <MiniMetric value="50K+" label="от недели" />
                                <MiniMetric value="B2B" label="только бизнес" />
                            </div>

                            <div className="mt-6 rounded-2xl bg-[#111111] p-5 text-white">
                                <div className="text-sm font-bold text-neutral-300">
                                    Размещения
                                </div>
                                <div className="mt-1 text-3xl font-black">от 50 000 ₽</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
                <div className="mb-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#ff4b00] shadow-sm">
                        <BadgeRussianRuble size={18} />
                        Форматы размещения
                    </div>

                    <h2 className="max-w-4xl text-5xl font-black tracking-tight">
                        Рекламные продукты для разных уровней бизнеса
                    </h2>

                    <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-700">
                        От локального продвижения в городе до федерального партнёрства и
                        спецпроектов.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    {adProducts.map((product) => (
                        <AdProductCard key={product.title} product={product} />
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-14 lg:px-8">
                <div className="rounded-[2.5rem] bg-white p-7 shadow-sm md:p-10">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-[#ff4b00]">
                                <Handshake size={18} />
                                Идеи спецпроектов
                            </div>

                            <h2 className="text-5xl font-black tracking-tight">
                                Бренд можно встроить в сценарий сделки
                            </h2>

                            <p className="mt-4 text-lg leading-8 text-neutral-700">
                                Самые сильные размещения — не просто баннеры. Это полезные
                                интеграции в покупку, продажу, доставку, проверку и безопасность.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {examples.map((example) => (
                                <div
                                    key={example.title}
                                    className="rounded-[2rem] bg-[#fff7ed] p-6"
                                >
                                    <div className="text-2xl font-black">{example.title}</div>
                                    <p className="mt-3 text-sm font-bold leading-6 text-neutral-600">
                                        {example.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section id="contact" className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-[#ff4b00] p-8 text-white shadow-2xl shadow-orange-200 md:p-10">
                    <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15" />
                    <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-black/10" />

                    <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                        <div>
                            <h2 className="text-5xl font-black tracking-tight">
                                Хотите разместиться на ПоРукам?
                            </h2>

                            <p className="mt-4 max-w-2xl text-lg leading-8 text-orange-50">
                                Пока заявки обрабатываются вручную. Напишите нам, какой формат
                                интересен: город, категория, главная, федеральный пакет или
                                спецпроект.
                            </p>

                            <div className="mt-5 rounded-2xl bg-white/15 p-5 text-sm font-bold leading-6">
                                Для частных пользователей сервис остаётся бесплатным. Платные
                                продукты доступны только для бизнеса, ИП, магазинов, сервисов и
                                рекламодателей.
                            </div>
                        </div>

                        <div className="rounded-[2rem] bg-white p-6 text-[#111111] lg:w-96">
                            <div className="text-sm font-black text-neutral-500">
                                Отдел партнёрств
                            </div>

                            <div className="mt-2 text-2xl font-black">
                                partnerships@porukam.ru
                            </div>

                            <p className="mt-3 text-sm leading-6 text-neutral-600">
                                На старте можно заменить на твой реальный email или Telegram.
                            </p>

                            <Link
                                href="mailto:partnerships@porukam.ru"
                                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111111] px-6 py-4 font-black text-white"
                            >
                                Написать
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

function MiniMetric({ value, label }: { value: string; label: string }) {
    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="text-3xl font-black">{value}</div>
            <div className="mt-1 text-sm font-bold text-neutral-500">{label}</div>
        </div>
    );
}

function AdProductCard({
    product,
}: {
    product: {
        title: string;
        price: string;
        period: string;
        icon: typeof MapPin;
        text: string;
        items: string[];
    };
}) {
    const Icon = product.icon;

    return (
        <div className="rounded-[2rem] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#ff4b00]">
                <Icon size={28} />
            </div>

            <h3 className="mt-5 text-3xl font-black">{product.title}</h3>

            <p className="mt-3 min-h-20 text-sm font-bold leading-6 text-neutral-600">
                {product.text}
            </p>

            <div className="mt-6">
                <div className="text-4xl font-black">{product.price}</div>
                <div className="mt-1 text-sm font-bold text-neutral-500">
                    {product.period}
                </div>
            </div>

            <div className="mt-6 space-y-3">
                {product.items.map((item) => (
                    <div key={item} className="flex gap-2 text-sm font-bold">
                        <Check size={18} className="text-[#2ecc71]" />
                        <span>{item}</span>
                    </div>
                ))}
            </div>

            <Link
                href="#contact"
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#111111] px-5 py-4 font-black text-white"
            >
                Обсудить
                <ArrowRight size={18} />
            </Link>
        </div>
    );
}