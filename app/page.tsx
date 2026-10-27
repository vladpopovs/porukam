import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { Logo } from "@/components/Logo";
import { prisma } from "@/lib/prisma";
import { ListingCard } from "@/components/ListingCard";
import { BusinessAdBlock } from "@/components/BusinessAdBlock";
import {
  Bike,
  BriefcaseBusiness,
  Building2,
  Car,
  Check,
  ChevronRight,
  Drill,
  Heart,
  HomeIcon,
  MapPin,
  MessageCircle,
  PackageCheck,
  Plus,
  Search,
  ShieldCheck,
  Shirt,
  Smartphone,
  Sparkles,
  User,
} from "lucide-react";

const categories = [
  { title: "Транспорт", Icon: Car },
  { title: "Недвижимость", Icon: Building2 },
  { title: "Электроника", Icon: Smartphone },
  { title: "Услуги", Icon: BriefcaseBusiness },
  { title: "Дом и ремонт", Icon: Drill },
  { title: "Одежда", Icon: Shirt },
  { title: "Детское", Icon: User },
  { title: "Для бизнеса", Icon: BriefcaseBusiness },
];

export default async function Home() {
  const listings = await prisma.listing.findMany({
    where: {
      status: "active",
    },
    take: 4,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
      <SiteHeader />
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 pb-16 pt-10 lg:grid-cols-[1fr_1fr] lg:px-8 lg:pt-16">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-[#ff4b00] shadow-sm">
            <Sparkles size={18} />
            Новая честная площадка объявлений
          </div>

          <h1 className="max-w-2xl text-6xl font-black leading-[0.95] tracking-tight md:text-7xl">
            Нашёл.
            <br />
            Договорился.
            <br />
            <span className="text-[#ff4b00]">Забрал.</span>
          </h1>

          <p className="mt-6 max-w-xl text-xl leading-8 text-neutral-700">
            Покупай и продавай рядом — просто, честно, без лишнего.
          </p>

          <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-neutral-700">
            <span className="flex items-center gap-2">
              <GreenCheck /> Без платы за просмотры
            </span>
            <span className="flex items-center gap-2">
              <GreenCheck /> Без скрытых условий
            </span>
            <span className="flex items-center gap-2">
              <GreenCheck /> Рядом с вами
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/new"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-8 py-4 text-lg font-black text-white shadow-xl shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-[#eb4500]"
            >
              <Plus size={22} />
              Подать объявление
            </Link>

            <Link
              href="/search"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#ff4b00] bg-white px-8 py-4 text-lg font-black text-[#ff4b00] transition hover:-translate-y-0.5 hover:bg-orange-50"
            >
              <MapPin size={22} />
              Найти рядом
            </Link>
          </div>
        </div>

        <HeroVisual />
      </section>

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-5 lg:grid-cols-3 lg:px-8">
        <FeatureCard icon="0₽" title="Бесплатно" text="для частных продавцов" />
        <FeatureCard icon={<ShieldCheck size={28} />} title="Проверенные" text="продавцы" />
        <FeatureCard icon={<MapPin size={28} />} title="Сделки рядом" text="с вами" />
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <SectionHeader title="Популярные категории" link="Смотреть все" />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
          {categories.map(({ title, Icon }) => (
            <div
              key={title}
              className="group rounded-3xl border border-orange-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-[#ff4b00] transition group-hover:bg-[#ff4b00] group-hover:text-white">
                <Icon size={28} strokeWidth={2.5} />
              </div>
              <div className="mt-3 text-sm font-black">{title}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <BusinessAdBlock />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12 lg:px-8">
        <SectionHeader title="Объявления рядом" link="Смотреть все" />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {listings.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-14 lg:px-8">
        <h2 className="text-3xl font-black">Как это работает</h2>

        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <Step
            number="1"
            Icon={Search}
            title="Нашёл"
            text="Найдите нужное среди объявлений рядом с вами."
          />
          <Step
            number="2"
            Icon={MessageCircle}
            title="Договорился"
            text="Общайтесь в чате. Нажмите «По рукам» — и сделка подтверждена."
            active
          />
          <Step
            number="3"
            Icon={PackageCheck}
            title="Забрал"
            text="Встретьтесь, проверьте и заберите — быстро и безопасно."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
        <h2 className="text-3xl font-black">Почему ПоРукам</h2>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <WhyCard title="Честные условия" text="Без скрытых комиссий и навязанных услуг." />
          <WhyCard title="Простой чат и сделка" text="Чат превращается в сделку одним нажатием." />
          <WhyCard title="Локальные объявления" text="Быстрые встречи и сделки рядом с вами." />
          <WhyCard title="Понятные тарифы" text="Прозрачные цены для частников и бизнеса." />
        </div>
      </section>

<Footer />
    </main>
  );
}

function HeroVisual() {
  return (
    <div className="relative min-h-[520px] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-100 via-white to-orange-300 p-6 shadow-2xl shadow-orange-100">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#ff4b00]" />
      <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-[#2ecc71]" />
      <div className="absolute left-10 top-12 h-28 w-28 rounded-full bg-white/50 blur-sm" />

      <div className="relative z-10 ml-auto flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 font-black text-[#ff4b00] shadow-xl">
        <MapPin size={18} />
        Москва
      </div>

      <div className="relative z-10 mt-10 rounded-3xl bg-white p-4 shadow-xl">
        <div className="flex gap-4">
          <div className="h-20 w-20 rounded-2xl bg-[url('https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=400&auto=format&fit=crop')] bg-cover bg-center" />
          <div>
            <div className="font-black">Велосипед Trek</div>
            <div className="mt-1 text-2xl font-black">32 000 ₽</div>
            <div className="mt-1 text-sm text-neutral-500">Москва, Марьино</div>
            <div className="mt-2 w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">
              Можно сегодня
            </div>
          </div>
        </div>
      </div>

      <ChatBubble align="right" name="Покупатель" text="Здравствуйте! Велосипед ещё актуален?" />
      <ChatBubble align="left" name="Продавец" text="Да, в силе! Можем встретиться сегодня." />

      <div className="relative z-10 mt-6 rounded-[2rem] border-4 border-orange-100 bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#ff4b00] text-white">
            <Check size={34} strokeWidth={4} />
          </div>

          <div className="flex-1">
            <h3 className="text-2xl font-black">Сделка подтверждается</h3>
            <p className="mt-1 text-neutral-600">Покупатель готов купить за</p>
            <div className="mt-2 text-4xl font-black">18 000 ₽</div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button className="rounded-2xl bg-[#ff4b00] px-5 py-4 font-black text-white">
                По рукам!
              </button>
              <button className="rounded-2xl border border-neutral-200 px-5 py-4 font-black">
                Изменить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({
  align,
  name,
  text,
}: {
  align: "left" | "right";
  name: string;
  text: string;
}) {
  return (
    <div
      className={`relative z-10 mt-5 max-w-sm rounded-3xl bg-white p-5 shadow-xl ${align === "right" ? "ml-auto" : ""
        }`}
    >
      <div className="text-sm font-bold text-neutral-500">{name}</div>
      <div className="mt-1 font-black">{text}</div>
    </div>
  );
}

function GreenCheck() {
  return (
    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2ecc71] text-white">
      <Check size={13} strokeWidth={4} />
    </span>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-3xl bg-green-50 p-6 shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2ecc71] text-xl font-black text-white">
        {icon}
      </div>
      <div>
        <div className="font-black">{title}</div>
        <div className="text-sm text-neutral-600">{text}</div>
      </div>
    </div>
  );
}

function SectionHeader({ title, link }: { title: string; link: string }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-3xl font-black">{title}</h2>
      <a className="inline-flex items-center gap-1 font-black text-[#ff4b00]" href="#">
        {link}
        <ChevronRight size={18} />
      </a>
    </div>
  );
}

function Step({
  number,
  Icon,
  title,
  text,
  active,
}: {
  number: string;
  Icon: React.ElementType;
  title: string;
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-[2rem] p-7 shadow-sm ${active ? "bg-[#ff4b00] text-white" : "bg-white text-[#111111]"
        }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full font-black ${active ? "bg-white text-[#ff4b00]" : "bg-[#ff4b00] text-white"
            }`}
        >
          {number}
        </div>
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${active ? "bg-white/20" : "bg-orange-50 text-[#ff4b00]"
            }`}
        >
          <Icon size={34} />
        </div>
      </div>
      <h3 className="mt-6 text-2xl font-black">{title}</h3>
      <p className={`mt-3 leading-7 ${active ? "text-orange-50" : "text-neutral-600"}`}>
        {text}
      </p>
    </div>
  );
}

function WhyCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-green-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
        <ShieldCheck size={26} />
      </div>
      <h3 className="font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>
    </div>
  );
}

function PriceCard({
  title,
  price,
  text,
  active,
}: {
  title: string;
  price: string;
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl p-6 ${active ? "bg-[#ff4b00] text-white" : "bg-white text-[#111111]"
        }`}
    >
      <div className="font-black">{title}</div>
      <div className="mt-3 text-3xl font-black">{price}</div>
      <p className={`mt-3 text-sm leading-6 ${active ? "text-orange-50" : "text-neutral-600"}`}>
        {text}
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-orange-100 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div className="text-xl font-black">ПоРукам</div>
          </div>
          <p className="mt-2 text-sm text-neutral-500">Нашёл. Договорился. Забрал.</p>
        </div>

        <div className="flex flex-wrap gap-5 text-sm font-black text-neutral-600">
          <a href="#">Покупателям</a>
          <a href="#">Продавцам</a>
          <a href="#">Для бизнеса</a>
          <a href="#">Помощь</a>
        </div>
      </div>
    </footer>
  );
}