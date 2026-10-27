import Link from "next/link";
import { cookies } from "next/headers";
import type { Prisma } from "@prisma/client";
import { SiteHeader } from "@/components/SiteHeader";
import { ListingCard } from "@/components/ListingCard";
import { BusinessAdBlock } from "@/components/BusinessAdBlock";
import { SmartSearchBox } from "@/components/SmartSearchBox";
import { prisma } from "@/lib/prisma";
import { setCity } from "@/app/actions/city";
import { CitySelect } from "@/components/CitySelect";
import {
  MARKETPLACE_CATEGORIES,
  MARKETPLACE_CATEGORY_GROUPS,
} from "@/lib/marketplace";
import { getSearchScore } from "@/lib/search";
import {
  Building2,
  Car,
  Check,
  ChevronDown,
  Drill,
  Gamepad2,
  PawPrint,
  Search as SearchIcon,
  Shirt,
  SlidersHorizontal,
  Smartphone,
  User,
  BriefcaseBusiness,
} from "lucide-react";

const quickCategories = [
  { title: "Все", Icon: SearchIcon },
  { title: "Транспорт", Icon: Car },
  { title: "Недвижимость", Icon: Building2 },
  { title: "Электроника", Icon: Smartphone },
  { title: "Услуги", Icon: BriefcaseBusiness },
  { title: "Для дома и дачи", Icon: Drill },
  { title: "Личные вещи", Icon: Shirt },
  { title: "Детские товары", Icon: User },
  { title: "Животные", Icon: PawPrint },
  { title: "Хобби и отдых", Icon: Gamepad2 },
];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    city?: string;
    min?: string;
    max?: string;
  }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();

  const savedCity = cookieStore.get("porukam_city")?.value || "Москва";

  const q = params.q?.trim() || "";
  const category = params.category?.trim() || "";
  const city = params.city?.trim() || savedCity;
  const min = Number(params.min || 0);
  const max = Number(params.max || 0);

  const filters: Prisma.ListingWhereInput[] = [
    {
      status: "active",
    },
  ];

  if (category && category !== "Все") {
    const categoryValues = getCategoryValues(category);

    filters.push({
      category: {
        in: categoryValues,
      },
    });
  }

  if (city && city !== "Вся Россия") {
    filters.push({
      city,
    });
  }

  if (min > 0) {
    filters.push({
      price: {
        gte: min,
      },
    });
  }

  if (max > 0) {
    filters.push({
      price: {
        lte: max,
      },
    });
  }

  const rawListings = await prisma.listing.findMany({
    where: {
      AND: filters,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: q ? 600 : 100,
  });

  const listings = q
    ? rawListings
      .map((listing) => ({
        listing,
        score: getSearchScore({
          query: q,
          title: listing.title,
          description: listing.description,
          category: listing.category,
          location: listing.location,
        }),
      }))
      .filter((item) => item.score > 8)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return b.listing.createdAt.getTime() - a.listing.createdAt.getTime();
      })
      .map((item) => item.listing)
    : rawListings;

  const cityText = city === "Вся Россия" ? "по всей России" : `в городе ${city}`;

  return (
    <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
      <SiteHeader compact />

      <section className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        <div className="rounded-[2rem] bg-white p-4 shadow-sm md:p-5">
          <form
            action="/search"
            className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_260px_160px]"
          >
            <SmartSearchBox defaultValue={q} city={city} />

            <CitySelect name="city" defaultValue={city} />

            <button
              type="submit"
              className="rounded-2xl bg-[#ff4b00] px-6 py-4 font-black text-white shadow-lg shadow-orange-200"
            >
              Найти
            </button>
          </form>

          <form
            action={setCity}
            className="mt-4 flex flex-col gap-3 rounded-3xl bg-orange-50 p-4 md:flex-row md:items-center"
          >
            <input type="hidden" name="returnTo" value="/search" />

            <div className="font-black">Мой город:</div>

            <div className="w-full md:w-72">
              <CitySelect name="city" defaultValue={city} />
            </div>

            <button className="rounded-2xl bg-[#ff4b00] px-5 py-3 font-black text-white">
              Запомнить
            </button>

            <div className="text-sm font-bold text-neutral-500">
              Будем показывать объявления сначала в этом городе.
            </div>
          </form>

          <div className="mt-5 flex flex-wrap gap-2.5">
            {quickCategories.map(({ title, Icon }) => {
              const isActive = (!category && title === "Все") || category === title;

              return (
                <Link
                  key={title}
                  href={makeCategoryHref({
                    city,
                    q,
                    category: title,
                  })}
                  className={`inline-flex items-center gap-2 rounded-2xl px-3.5 py-2.5 text-sm font-black transition ${isActive
                    ? "bg-[#ff4b00] text-white"
                    : "bg-orange-50 text-[#ff4b00] hover:bg-orange-100"
                    }`}
                >
                  <Icon size={17} />
                  {title}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-[2rem] bg-white p-5 shadow-sm lg:sticky lg:top-32">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={22} className="text-[#ff4b00]" />
              <h2 className="text-2xl font-black">Фильтры</h2>
            </div>

            <form action="/search">
              <input type="hidden" name="q" value={q} />
              <input type="hidden" name="city" value={city} />

              <FilterBlock title="Категория">
                <select name="category" defaultValue={category} className="input">
                  <option value="">Все категории</option>

                  {MARKETPLACE_CATEGORY_GROUPS.map((group) => (
                    <optgroup key={group.title} label={group.title}>
                      <option value={group.title}>{group.title}</option>

                      {group.categories.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </FilterBlock>

              <FilterBlock title="Цена">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="min"
                    defaultValue={params.min || ""}
                    placeholder="от"
                    className="input"
                  />
                  <input
                    name="max"
                    defaultValue={params.max || ""}
                    placeholder="до"
                    className="input"
                  />
                </div>
              </FilterBlock>

              <FilterBlock title="Район">
                <button
                  type="button"
                  className="input flex items-center justify-between text-left"
                >
                  <span className="text-neutral-500">Выбрать район</span>
                  <ChevronDown size={18} />
                </button>
              </FilterBlock>

              <FilterBlock title="Состояние">
                <div className="space-y-3">
                  <Checkbox label="Новое" />
                  <Checkbox label="Отличное" />
                  <Checkbox label="Б/у" />
                </div>
              </FilterBlock>

              <FilterBlock title="Особенности">
                <div className="space-y-3">
                  <Checkbox label="Проверенный продавец" />
                  <Checkbox label="Можно забрать сегодня" />
                  <Checkbox label="Только рядом со мной" />
                </div>
              </FilterBlock>

              <button className="mt-6 w-full rounded-2xl bg-[#111111] px-5 py-4 font-black text-white">
                Применить
              </button>

              <Link
                href="/search"
                className="mt-3 block w-full rounded-2xl border border-orange-200 bg-white px-5 py-4 text-center font-black text-[#ff4b00]"
              >
                Сбросить
              </Link>
            </form>
          </aside>

          <div className="min-w-0">
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-4xl font-black tracking-tight">
                  {q ? `Поиск: ${q}` : "Объявления рядом"}
                </h1>

                <p className="mt-2 text-neutral-600">
                  Найдено {listings.length} объявлений {cityText}
                </p>
              </div>

              <button className="inline-flex items-center justify-between gap-3 rounded-2xl bg-white px-5 py-3 font-black shadow-sm">
                Сначала подходящие
                <ChevronDown size={18} />
              </button>
            </div>

            <div className="mb-5">
              <BusinessAdBlock variant="catalog" />
            </div>

            {listings.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {listings.map((item) => (
                  <ListingCard key={item.id} listing={item} />
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] bg-white p-8 text-center shadow-sm">
                <div className="text-3xl font-black">Ничего не найдено</div>

                <p className="mt-3 text-neutral-600">
                  Попробуйте написать проще: “айфон”, “iphone”, “ноутбук”,
                  “плойка”, “диван” или выбрать другой город.
                </p>

                <Link
                  href="/search?city=Вся%20Россия"
                  className="mt-6 inline-flex rounded-2xl bg-[#ff4b00] px-6 py-4 font-black text-white"
                >
                  Смотреть по всей России
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function getCategoryValues(category: string) {
  const group = MARKETPLACE_CATEGORY_GROUPS.find(
    (item) => item.title === category
  );

  if (group) {
    return group.categories;
  }

  if (MARKETPLACE_CATEGORIES.includes(category)) {
    return [category];
  }

  return [category];
}

function makeCategoryHref({
  city,
  q,
  category,
}: {
  city: string;
  q: string;
  category: string;
}) {
  const query = new URLSearchParams();

  query.set("city", city);

  if (q) {
    query.set("q", q);
  }

  if (category !== "Все") {
    query.set("category", category);
  }

  return `/search?${query.toString()}`;
}

function FilterBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 font-black">{title}</h3>
      {children}
    </div>
  );
}

function Checkbox({ label }: { label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 font-bold text-neutral-700">
      <span className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-orange-200 bg-orange-50">
        <Check size={13} className="text-[#ff4b00]" strokeWidth={4} />
      </span>
      {label}
    </label>
  );
}