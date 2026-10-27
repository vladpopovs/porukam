import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import type { LucideIcon } from "lucide-react";
import {
    ArrowRight,
    CheckCircle2,
    Flag,
    Handshake,
    HeartHandshake,
    LockKeyhole,
    MapPin,
    MessageCircle,
    PackageCheck,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    UserCheck,
    WalletCards,
} from "lucide-react";

export const metadata = {
    title: "Как работает доверие",
    description:
        "Как ПоРукам помогает покупать и продавать честно: сделки, модерация, проверка продавцов, жалобы и отзывы.",
};

export default function TrustPage() {
    return (
        <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
            <SiteHeader compact />

            <HeroSection />
            <TrustStats />
            <HowItWorks />
            <PorukamDeal />
            <SafetySection />
            <ModerationSection />
            <ReviewsSection />
            <FinalCta />
        </main>
    );
}

function HeroSection() {
    return (
        <section className="relative overflow-hidden">
            <div className="absolute left-[-120px] top-[-140px] h-80 w-80 rounded-full bg-[#ff4b00]/20 blur-3xl" />
            <div className="absolute bottom-[-160px] right-[-120px] h-96 w-96 rounded-full bg-[#2ecc71]/20 blur-3xl" />

            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-12 lg:grid-cols-[1fr_0.9fr] lg:px-8 lg:py-20">
                <div className="relative z-10 flex flex-col justify-center">
                    <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#ff4b00] shadow-sm">
                        <Sparkles size={18} />
                        Доверие — главная фишка ПоРукам
                    </div>

                    <h1 className="max-w-3xl text-6xl font-black leading-[0.95] tracking-tight md:text-7xl">
                        Не просто
                        <br />
                        объявления.
                        <br />
                        <span className="text-[#ff4b00]">Честная сделка.</span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-xl leading-9 text-neutral-700">
                        ПоРукам помогает покупателю и продавцу не потеряться в переписке:
                        договорились о цене — нажали «По рукам» — зафиксировали товар,
                        сумму и стороны сделки.
                    </p>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                        <Link
                            href="/search"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-8 py-4 text-lg font-black text-white shadow-xl shadow-orange-200 transition hover:-translate-y-0.5"
                        >
                            <Search size={22} />
                            Найти объявление
                        </Link>

                        <Link
                            href="/new"
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#ff4b00] bg-white px-8 py-4 text-lg font-black text-[#ff4b00] transition hover:-translate-y-0.5"
                        >
                            Подать объявление
                            <ArrowRight size={22} />
                        </Link>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#111111] p-6 text-white shadow-2xl shadow-orange-100">
                        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#ff4b00]" />
                        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#2ecc71]" />

                        <div className="relative z-10 rounded-[2rem] bg-white p-5 text-[#111111] shadow-xl">
                            <div className="flex items-start gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#ff4b00] text-white">
                                    <Handshake size={34} strokeWidth={3} />
                                </div>

                                <div className="flex-1">
                                    <div className="text-sm font-black text-neutral-500">
                                        Карточка сделки
                                    </div>
                                    <h2 className="mt-1 text-2xl font-black">
                                        Покупатель готов купить за
                                    </h2>
                                    <div className="mt-2 text-5xl font-black">18 000 ₽</div>

                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        <MiniConfirm title="Покупатель" active />
                                        <MiniConfirm title="Продавец" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-5 rounded-[2rem] bg-white/10 p-5 backdrop-blur">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2ecc71] text-white">
                                    <CheckCircle2 size={26} />
                                </div>
                                <div>
                                    <div className="font-black">Деньги не резервируются</div>
                                    <p className="mt-1 text-sm leading-6 text-neutral-300">
                                        ПоРукам фиксирует договорённость, а не списывает оплату.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-5 grid grid-cols-2 gap-4">
                            <DarkMetric value="2" label="подтверждения" />
                            <DarkMetric value="0₽" label="скрытых комиссий" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function TrustStats() {
    return (
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-5 lg:grid-cols-4 lg:px-8">
            <StatCard
                icon={ShieldCheck}
                value="Модерация"
                label="новые объявления проходят проверку"
            />
            <StatCard
                icon={UserCheck}
                value="Проверка"
                label="продавцы могут получить статус доверия"
            />
            <StatCard
                icon={Flag}
                value="Жалобы"
                label="подозрительные объявления уходят админу"
            />
            <StatCard
                icon={Star}
                value="Отзывы"
                label="оценки появляются после завершённых сделок"
            />
        </section>
    );
}

function HowItWorks() {
    return (
        <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
            <SectionTitle
                badge="Как работает"
                title="Три шага вместо хаоса в переписке"
                text="Покупатель и продавец общаются как обычно, но ключевой момент сделки фиксируется отдельной кнопкой."
            />

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
                <StepCard
                    number="1"
                    icon={Search}
                    title="Нашёл"
                    text="Покупатель выбирает объявление рядом с собой, смотрит город, район, описание и продавца."
                />
                <StepCard
                    number="2"
                    icon={MessageCircle}
                    title="Договорился"
                    text="Стороны обсуждают цену, время и место встречи. Когда всё понятно — нажимают «По рукам»."
                    active
                />
                <StepCard
                    number="3"
                    icon={PackageCheck}
                    title="Забрал"
                    text="После встречи сделку можно завершить, объявление становится проданным, а стороны оставляют отзывы."
                />
            </div>
        </section>
    );
}

function PorukamDeal() {
    return (
        <section className="mx-auto max-w-7xl px-5 pb-14 lg:px-8">
            <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="bg-[#ff4b00] p-8 text-white md:p-10">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-black">
                            <Handshake size={18} />
                            Фирменная функция
                        </div>

                        <h2 className="mt-6 text-5xl font-black tracking-tight">
                            Что значит «По рукам»?
                        </h2>

                        <p className="mt-5 text-lg leading-8 text-orange-50">
                            Это момент, когда договорённость становится понятной обеим
                            сторонам. Мы фиксируем сумму, товар, покупателя, продавца и
                            статус сделки.
                        </p>

                        <div className="mt-8 rounded-[2rem] bg-white p-6 text-[#111111]">
                            <div className="text-sm font-black text-neutral-500">
                                Формулировка сделки
                            </div>
                            <div className="mt-2 text-3xl font-black">
                                Покупатель готов купить за 18 000 ₽
                            </div>
                            <p className="mt-3 text-sm leading-6 text-neutral-600">
                                Не “готов оплатить”, потому что деньги не резервируются.
                                ПоРукам фиксирует намерение и договорённость.
                            </p>
                        </div>
                    </div>

                    <div className="p-8 md:p-10">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <FeatureCard
                                icon={WalletCards}
                                title="Без предоплаты"
                                text="Площадка не просит переводить деньги незнакомому человеку."
                            />
                            <FeatureCard
                                icon={LockKeyhole}
                                title="Без скрытых условий"
                                text="Понятная карточка сделки без сложных схем и мелкого шрифта."
                            />
                            <FeatureCard
                                icon={CheckCircle2}
                                title="Два подтверждения"
                                text="Покупатель и продавец отдельно подтверждают договорённость."
                            />
                            <FeatureCard
                                icon={PackageCheck}
                                title="Продано после завершения"
                                text="Когда сделка завершена, объявление получает статус «Продано»."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SafetySection() {
    return (
        <section id="safety" className="mx-auto max-w-7xl px-5 pb-14 lg:px-8">
            <SectionTitle
                badge="Безопасность"
                title="Что помогает не попасть в неприятную ситуацию"
                text="ПоРукам не заменяет внимательность, но делает важные правила заметными и понятными."
            />

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
                <SafetyCard
                    icon={MapPin}
                    title="Встречайтесь в понятном месте"
                    text="Лучше выбирать людные места, торговые центры, метро или другие безопасные точки."
                />
                <SafetyCard
                    icon={PackageCheck}
                    title="Проверяйте товар до оплаты"
                    text="Состояние, комплектацию, серийные номера и работоспособность стоит проверить на месте."
                />
                <SafetyCard
                    icon={WalletCards}
                    title="Не переводите предоплату"
                    text="Если продавец давит, торопит или просит перевести деньги заранее — это повод насторожиться."
                />
            </div>
        </section>
    );
}

function ModerationSection() {
    return (
        <section className="mx-auto max-w-7xl px-5 pb-14 lg:px-8">
            <div className="rounded-[2.5rem] bg-[#111111] p-8 text-white md:p-10">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-black text-orange-100">
                            <ShieldCheck size={18} />
                            Центр доверия
                        </div>

                        <h2 className="mt-6 text-5xl font-black tracking-tight">
                            Модерация, проверки и жалобы — в одном месте
                        </h2>

                        <p className="mt-5 text-lg leading-8 text-neutral-300">
                            Админ видит объявления на проверке, заявки продавцов и жалобы.
                            Это превращает площадку из обычной доски объявлений в управляемую
                            систему доверия.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <DarkFeature
                            icon={ShieldCheck}
                            title="Объявления"
                            text="Новые объявления сначала получают статус «На проверке»."
                        />
                        <DarkFeature
                            icon={UserCheck}
                            title="Продавцы"
                            text="Пользователь может отправить заявку на проверку профиля."
                        />
                        <DarkFeature
                            icon={Flag}
                            title="Жалобы"
                            text="Покупатели могут пожаловаться на подозрительное объявление."
                        />
                        <DarkFeature
                            icon={CheckCircle2}
                            title="Решения"
                            text="Админ одобряет, отклоняет, закрывает или игнорирует жалобы."
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

function ReviewsSection() {
    return (
        <section className="mx-auto max-w-7xl px-5 pb-14 lg:px-8">
            <SectionTitle
                badge="Отзывы"
                title="Отзывы появляются после реальных сделок"
                text="Оценка привязывается к завершённой сделке, поэтому доверие строится не на пустых обещаниях."
            />

            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
                <ReviewMock
                    name="Мария"
                    text="Договорились через «По рукам», встретились у метро, всё прошло спокойно."
                />
                <ReviewMock
                    name="Иван"
                    text="Понравилось, что сумма сделки была зафиксирована. Никто потом не переобувался."
                />
                <ReviewMock
                    name="Алексей"
                    text="Покупатель подтвердил сделку, приехал вовремя, товар забрал без лишних вопросов."
                />
            </div>
        </section>
    );
}

function FinalCta() {
    return (
        <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#ff4b00] p-8 text-white shadow-2xl shadow-orange-200 md:p-10">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/15" />
                <div className="absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-black/10" />

                <div className="relative z-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                    <div>
                        <h2 className="text-5xl font-black tracking-tight">
                            Готовы договориться по-честному?
                        </h2>
                        <p className="mt-4 max-w-2xl text-lg leading-8 text-orange-50">
                            Найдите объявление рядом, договоритесь о цене и зафиксируйте
                            сделку через «По рукам».
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                            href="/search"
                            className="rounded-2xl bg-white px-7 py-4 text-center font-black text-[#ff4b00]"
                        >
                            В каталог
                        </Link>
                        <Link
                            href="/new"
                            className="rounded-2xl bg-[#111111] px-7 py-4 text-center font-black text-white"
                        >
                            Подать объявление
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

function MiniConfirm({ title, active = false }: { title: string; active?: boolean }) {
    return (
        <div
            className={`rounded-2xl px-4 py-3 ${active ? "bg-green-100 text-green-700" : "bg-orange-50 text-neutral-600"
                }`}
        >
            <div className="text-xs font-black">{title}</div>
            <div className="mt-1 flex items-center gap-1 text-sm font-black">
                {active ? <CheckCircle2 size={15} /> : <ShieldCheck size={15} />}
                {active ? "Подтвердил" : "Ждёт"}
            </div>
        </div>
    );
}

function DarkMetric({ value, label }: { value: string; label: string }) {
    return (
        <div className="rounded-[2rem] bg-white/10 p-5 backdrop-blur">
            <div className="text-4xl font-black">{value}</div>
            <div className="mt-1 text-sm font-bold text-neutral-300">{label}</div>
        </div>
    );
}

function StatCard({
    icon: Icon,
    value,
    label,
}: {
    icon: LucideIcon;
    value: string;
    label: string;
}) {
    return (
        <div className="rounded-[2rem] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#ff4b00]">
                <Icon size={28} />
            </div>
            <div className="mt-5 text-2xl font-black">{value}</div>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{label}</p>
        </div>
    );
}

function SectionTitle({
    badge,
    title,
    text,
}: {
    badge: string;
    title: string;
    text: string;
}) {
    return (
        <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#ff4b00] shadow-sm">
                <Sparkles size={18} />
                {badge}
            </div>
            <h2 className="max-w-4xl text-5xl font-black tracking-tight">
                {title}
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-700">
                {text}
            </p>
        </div>
    );
}

function StepCard({
    number,
    icon: Icon,
    title,
    text,
    active = false,
}: {
    number: string;
    icon: LucideIcon;
    title: string;
    text: string;
    active?: boolean;
}) {
    return (
        <div
            className={`rounded-[2rem] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${active ? "bg-[#ff4b00] text-white" : "bg-white"
                }`}
        >
            <div className="flex items-center justify-between">
                <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${active ? "bg-white text-[#ff4b00]" : "bg-orange-50 text-[#ff4b00]"
                        }`}
                >
                    <Icon size={28} />
                </div>
                <div
                    className={`text-5xl font-black ${active ? "text-white/25" : "text-orange-100"
                        }`}
                >
                    {number}
                </div>
            </div>

            <h3 className="mt-6 text-3xl font-black">{title}</h3>
            <p
                className={`mt-3 leading-7 ${active ? "text-orange-50" : "text-neutral-600"
                    }`}
            >
                {text}
            </p>
        </div>
    );
}

function FeatureCard({
    icon: Icon,
    title,
    text,
}: {
    icon: LucideIcon;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-[2rem] bg-[#fff7ed] p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#ff4b00] shadow-sm">
                <Icon size={28} />
            </div>
            <h3 className="mt-5 text-2xl font-black">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-neutral-600">{text}</p>
        </div>
    );
}

function SafetyCard({
    icon: Icon,
    title,
    text,
}: {
    icon: LucideIcon;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                <Icon size={28} />
            </div>
            <h3 className="mt-5 text-2xl font-black">{title}</h3>
            <p className="mt-3 leading-7 text-neutral-600">{text}</p>
        </div>
    );
}

function DarkFeature({
    icon: Icon,
    title,
    text,
}: {
    icon: LucideIcon;
    title: string;
    text: string;
}) {
    return (
        <div className="rounded-[2rem] bg-white/10 p-6 backdrop-blur">
            <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white text-[#ff4b00]">
                <Icon size={26} />
            </div>
            <h3 className="mt-5 text-2xl font-black">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-neutral-300">{text}</p>
        </div>
    );
}

function ReviewMock({ name, text }: { name: string; text: string }) {
    return (
        <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-1 text-[#ff4b00]">
                <Star size={18} className="fill-[#ff4b00]" />
                <Star size={18} className="fill-[#ff4b00]" />
                <Star size={18} className="fill-[#ff4b00]" />
                <Star size={18} className="fill-[#ff4b00]" />
                <Star size={18} className="fill-[#ff4b00]" />
            </div>

            <p className="mt-5 text-lg font-bold leading-8 text-neutral-700">
                “{text}”
            </p>

            <div className="mt-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#ff4b00]">
                    <HeartHandshake size={26} />
                </div>
                <div className="font-black">{name}</div>
            </div>
        </div>
    );
}