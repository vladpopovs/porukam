import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import {
    ArrowRight,
    BadgeCheck,
    BarChart3,
    Building2,
    Check,
    Crown,
    Handshake,
    Megaphone,
    ShieldCheck,
    Sparkles,
    Store,
    UsersRound,
} from "lucide-react";

export const metadata = {
    title: "Тарифы для бизнеса",
    description:
        "Тарифы ПоРукам для ИП, магазинов, сервисов, сетей и федеральных брендов. Для частных пользователей сервис бесплатен.",
};

const sellerPlans = [
    {
        name: "Частный пользователь",
        price: "0 ₽",
        period: "навсегда",
        badge: "Для физлиц",
        description:
            "Обычные люди размещают объявления, общаются и заключают сделки бесплатно.",
        icon: Handshake,
        features: [
            "Бесплатная подача объявлений",
            "Чат с покупателями и продавцами",
            "Сделка «По рукам»",
            "Избранное",
            "Отзывы после сделок",
            "Базовая проверка профиля",
        ],
        cta: "Пользоваться бесплатно",
        href: "/new",
        highlighted: false,
    },
    {
        name: "ИП Старт",
        price: "4 900 ₽",
        period: "в месяц",
        badge: "Для ИП",
        description:
            "Для регулярных продавцов, мастеров, небольших сервисов и самозанятых.",
        icon: Store,
        features: [
            "До 100 активных объявлений",
            "Витрина бизнес-продавца",
            "Значок «Бизнес-продавец»",
            "Статистика просмотров",
            "Приоритетная модерация",
            "Базовая поддержка",
        ],
        cta: "Оставить заявку",
        href: "/advertising#contact",
        highlighted: false,
    },
    {
        name: "Бизнес",
        price: "19 900 ₽",
        period: "в месяц",
        badge: "Популярно",
        description:
            "Для магазинов, сервисов, локальных компаний и продавцов с большим каталогом.",
        icon: Building2,
        features: [
            "До 500 активных объявлений",
            "Логотип и описание компании",
            "Расширенная витрина",
            "Приоритет в выдаче",
            "20 поднятий объявлений в месяц",
            "Заявки от покупателей",
            "Менеджер поддержки",
        ],
        cta: "Подключить бизнес",
        href: "/advertising#contact",
        highlighted: true,
    },
    {
        name: "Регион",
        price: "79 900 ₽",
        period: "в месяц",
        badge: "Для сетей",
        description:
            "Для компаний с несколькими точками, региональных брендов и сетей.",
        icon: UsersRound,
        features: [
            "До 3 000 объявлений",
            "Несколько городов",
            "Категорийные размещения",
            "Закрепление в городе",
            "Расширенная аналитика",
            "Персональный менеджер",
            "Индивидуальные условия",
        ],
        cta: "Обсудить условия",
        href: "/advertising#contact",
        highlighted: false,
    },
];

const enterpriseFeatures = [
    "Федеральные размещения",
    "Спецпроекты",
    "Эксклюзив категории",
    "Интеграции в сценарий сделки",
    "Медиапакет",
    "Индивидуальная аналитика",
];

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
            <SiteHeader compact />

            <section className="relative overflow-hidden">
                <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#ff4b00]/20 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#2ecc71]/20 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-20">
                    <div className="max-w-4xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#ff4b00] shadow-sm">
                            <Sparkles size={18} />
                            Физлицам бесплатно. Бизнес платит за рост.
                        </div>

                        <h1 className="text-6xl font-black leading-[0.95] tracking-tight md:text-7xl">
                            Тарифы для
                            <br />
                            <span className="text-[#ff4b00]">бизнеса</span>
                        </h1>

                        <p className="mt-6 max-w-3xl text-xl leading-9 text-neutral-700">
                            ПоРукам остаётся бесплатным для обычных людей. Мы не берём
                            комиссию с частных сделок. Платные продукты доступны для ИП,
                            магазинов, сервисов, сетей и рекламодателей.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/advertising"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-7 py-4 font-black text-white shadow-xl shadow-orange-200"
                            >
                                Реклама для брендов
                                <ArrowRight size={20} />
                            </Link>

                            <Link
                                href="/new"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-white px-7 py-4 font-black text-[#ff4b00]"
                            >
                                Подать как физлицо
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-14 lg:px-8">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
                    {sellerPlans.map((plan) => (
                        <PlanCard key={plan.name} plan={plan} />
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-14 lg:px-8">
                <div className="overflow-hidden rounded-[2.5rem] bg-[#111111] text-white shadow-2xl shadow-orange-100">
                    <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_0.9fr]">
                        <div className="relative p-8 md:p-10">
                            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#ff4b00]/40 blur-2xl" />

                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-orange-100">
                                    <Crown size={18} />
                                    Enterprise
                                </div>

                                <h2 className="mt-6 text-5xl font-black tracking-tight">
                                    Федеральный партнёр
                                </h2>

                                <p className="mt-5 max-w-2xl text-lg leading-8 text-neutral-300">
                                    Для банков, страховых, travel-сервисов, доставки,
                                    маркетплейсов и крупных брендов, которые хотят быть рядом с
                                    моментом сделки.
                                </p>

                                <div className="mt-7 text-5xl font-black">
                                    от 500 000 ₽
                                    <span className="ml-2 text-lg font-bold text-neutral-400">
                                        в месяц
                                    </span>
                                </div>

                                <Link
                                    href="/advertising#contact"
                                    className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 font-black text-[#111111]"
                                >
                                    Запросить медиаплан
                                    <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white/5 p-8 md:p-10">
                            <div className="grid grid-cols-1 gap-4">
                                {enterpriseFeatures.map((feature) => (
                                    <div
                                        key={feature}
                                        className="flex items-center gap-3 rounded-2xl bg-white/10 p-4"
                                    >
                                        <Check className="text-[#2ecc71]" size={20} />
                                        <span className="font-black">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 rounded-[2rem] bg-[#ff4b00] p-6">
                                <div className="text-2xl font-black">Важно</div>
                                <p className="mt-2 text-sm font-bold leading-6 text-orange-50">
                                    Бизнес может купить продвижение и рекламу, но не может купить
                                    доверие. Проверка, отзывы и безопасность не продаются.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <PrincipleCard
                        icon={<ShieldCheck size={28} />}
                        title="Честность не продаётся"
                        text="Платные тарифы не дают поддельных отзывов, галочек или обхода правил."
                    />
                    <PrincipleCard
                        icon={<Megaphone size={28} />}
                        title="Бизнес покупает охват"
                        text="Продвижение, витрины, реклама и спецпроекты — это инструменты роста."
                    />
                    <PrincipleCard
                        icon={<BadgeCheck size={28} />}
                        title="Физлица бесплатно"
                        text="Обычные пользователи могут покупать и продавать без комиссии."
                    />
                </div>
            </section>
        </main>
    );
}

function PlanCard({
    plan,
}: {
    plan: {
        name: string;
        price: string;
        period: string;
        badge: string;
        description: string;
        icon: typeof Handshake;
        features: string[];
        cta: string;
        href: string;
        highlighted: boolean;
    };
}) {
    const Icon = plan.icon;

    return (
        <div
            className={`relative overflow-hidden rounded-[2rem] p-6 shadow-sm ${plan.highlighted
                    ? "bg-[#ff4b00] text-white shadow-xl shadow-orange-200"
                    : "bg-white"
                }`}
        >
            {plan.highlighted && (
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/20" />
            )}

            <div className="relative z-10">
                <div
                    className={`mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black ${plan.highlighted
                            ? "bg-white text-[#ff4b00]"
                            : "bg-orange-50 text-[#ff4b00]"
                        }`}
                >
                    <Icon size={16} />
                    {plan.badge}
                </div>

                <h2 className="text-3xl font-black">{plan.name}</h2>

                <p
                    className={`mt-3 min-h-20 text-sm leading-6 ${plan.highlighted ? "text-orange-50" : "text-neutral-600"
                        }`}
                >
                    {plan.description}
                </p>

                <div className="mt-6">
                    <div className="text-4xl font-black">{plan.price}</div>
                    <div
                        className={`mt-1 text-sm font-bold ${plan.highlighted ? "text-orange-100" : "text-neutral-500"
                            }`}
                    >
                        {plan.period}
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                        <div key={feature} className="flex gap-2 text-sm font-bold">
                            <Check
                                size={18}
                                className={plan.highlighted ? "text-white" : "text-[#2ecc71]"}
                            />
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>

                <Link
                    href={plan.href}
                    className={`mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 font-black ${plan.highlighted
                            ? "bg-white text-[#ff4b00]"
                            : "bg-[#111111] text-white"
                        }`}
                >
                    {plan.cta}
                    <ArrowRight size={18} />
                </Link>
            </div>
        </div>
    );
}

function PrincipleCard({
    icon,
    title,
    text,
}: {
    icon: ReactNode;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#ff4b00]">
                {icon}
            </div>
            <h3 className="mt-5 text-2xl font-black">{title}</h3>
            <p className="mt-3 leading-7 text-neutral-600">{text}</p>
        </div>
    );
}