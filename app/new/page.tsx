import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { CitySelect } from "@/components/CitySelect";
import { createListing } from "./actions";
import { PhotosInput } from "./PhotosInput";
import { SubmitListingButton } from "./SubmitListingButton";
import {
  DEAL_METHODS,
  LISTING_CONDITIONS,
  MARKETPLACE_CATEGORIES,
} from "@/lib/marketplace";
import {
  ArrowLeft,
  Camera,
  Check,
  ClipboardList,
  MapPin,
  Sparkles,
} from "lucide-react";

type NewListingPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  required: "Заполните все обязательные поля.",
  price: "Укажите корректную цену.",
  photo: "Добавьте хотя бы одно фото.",
  photoCount: "Можно добавить максимум 10 фото.",
  photoType: "Можно загружать только изображения.",
  photoSize: "Каждое фото должно быть не больше 5 МБ.",
  upload: "Не получилось загрузить фото. Проверьте Supabase Storage.",
};

export default async function NewListingPage({
  searchParams,
}: NewListingPageProps) {
  const query = await searchParams;
  const errorText = query.error ? errorMessages[query.error] : "";

  return (
    <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
      <SiteHeader compact />

      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 font-black text-[#ff4b00]"
        >
          <ArrowLeft size={18} />
          На главную
        </Link>

        <div className="mb-8 rounded-[2.5rem] bg-white p-6 shadow-sm md:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-[#ff4b00]">
            <Sparkles size={18} />
            Для частных пользователей бесплатно
          </div>

          <h1 className="text-5xl font-black tracking-tight">
            Подать объявление
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-700">
            Добавьте до 10 фото, выберите категорию, город, район и опишите
            товар. После публикации объявление уйдёт на модерацию.
          </p>
        </div>

        {errorText && (
          <div className="mb-6 rounded-[2rem] border border-red-200 bg-red-50 p-5 font-black text-red-700">
            {errorText}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <form
            action={createListing}
            encType="multipart/form-data"
            className="rounded-[2rem] bg-white p-5 shadow-sm md:p-8"
          >
            <SectionTitle
              icon={<Camera size={22} />}
              title="Фото товара"
              text="Добавьте реальные фотографии. Первая фотография станет главной в каталоге."
            />

            <div className="mt-5">
              <PhotosInput />
            </div>

            <div className="mt-8">
              <SectionTitle
                icon={<ClipboardList size={22} />}
                title="Описание объявления"
                text="Чем точнее данные, тем быстрее покупатель примет решение."
              />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Название объявления">
                <input
                  name="title"
                  required
                  placeholder="Например: iPhone 13, 128 ГБ"
                  className="input"
                />
              </Field>

              <Field label="Цена">
                <input
                  name="price"
                  required
                  inputMode="numeric"
                  placeholder="25 000 ₽"
                  className="input"
                />
              </Field>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Категория">
                <select name="category" required className="input" defaultValue="">
                  <option value="">Выберите категорию</option>
                  {MARKETPLACE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Город">
                <CitySelect
                  name="city"
                  defaultValue="Москва"
                  includeAllRussia={false}
                />
              </Field>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Район / метро">
                <div className="input flex items-center gap-2">
                  <MapPin size={18} className="text-[#ff4b00]" />
                  <input
                    name="district"
                    required
                    placeholder="Например: Марьино"
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </Field>

              <Field label="Ориентир / место встречи">
                <input
                  name="address"
                  placeholder="Например: у метро, ТЦ, улица"
                  className="input"
                />
              </Field>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Состояние">
                <select name="condition" required className="input" defaultValue="">
                  <option value="">Выберите состояние</option>
                  {LISTING_CONDITIONS.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Способ сделки">
                <select name="dealMethod" required className="input" defaultValue="">
                  <option value="">Выберите способ</option>
                  {DEAL_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-5">
              <Field label="Описание">
                <textarea
                  name="description"
                  required
                  placeholder="Расскажите о состоянии, комплектации, причине продажи, дефектах, гарантии..."
                  className="input min-h-44 resize-none"
                />
              </Field>
            </div>

            <div className="mt-6 rounded-3xl bg-green-50 p-5">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2ecc71] text-white">
                  <Check size={15} strokeWidth={4} />
                </span>

                <div>
                  <div className="font-black">Размещение для физлиц — 0 ₽</div>
                  <p className="mt-1 text-sm leading-6 text-neutral-600">
                    Частные пользователи размещают объявления бесплатно. Бизнес
                    и ИП подключаются через отдельные тарифы.
                  </p>
                </div>
              </div>
            </div>

            <SubmitListingButton />

            <Link
              href="/profile"
              className="mt-3 inline-flex w-full items-center justify-center rounded-2xl border border-orange-200 bg-white px-7 py-4 text-lg font-black text-[#ff4b00]"
            >
              В профиль
            </Link>
          </form>

          <aside className="space-y-5">
            <div className="rounded-[2rem] bg-[#111111] p-6 text-white">
              <h2 className="text-2xl font-black">Как сделать фото лучше</h2>

              <div className="mt-5 space-y-4 text-sm leading-6 text-neutral-200">
                <Tip text="Сделайте главное фото на светлом фоне." />
                <Tip text="Не используйте логотипы вместо фото товара." />
                <Tip text="Добавьте фото дефектов, комплекта и коробки." />
                <Tip text="Первое фото будет главным в каталоге." />
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">Модерация</h2>

              <p className="mt-3 text-sm leading-6 text-neutral-600">
                Новые объявления сначала получают статус “На проверке”. После
                одобрения они появятся в каталоге и поиске.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function SectionTitle({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ff4b00] text-white">
        {icon}
      </div>

      <div>
        <h2 className="text-3xl font-black">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-neutral-600">{text}</p>
      </div>
    </div>
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
      <span className="mb-2 block font-black">{label}</span>
      {children}
    </label>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <div className="flex gap-3">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#ff4b00]" />
      <span>{text}</span>
    </div>
  );
}