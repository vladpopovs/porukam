import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { CitySelect } from "@/components/CitySelect";
import { prisma } from "@/lib/prisma";
import { requireUserProfile } from "@/lib/auth";
import { updateListing } from "./actions";
import { EditPhotosInput } from "./EditPhotosInput";
import { SaveListingButton } from "./SaveListingButton";
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

type EditListingPageProps = {
    params: Promise<{
        slug: string;
    }>;
    searchParams: Promise<{
        error?: string;
    }>;
};

const errorMessages: Record<string, string> = {
    required: "Заполните все обязательные поля.",
    price: "Укажите корректную цену.",
    photo: "Нужно оставить хотя бы одно фото.",
    photoCount: "Можно оставить максимум 10 фото.",
    photoType: "Можно загружать только изображения.",
    photoSize: "Каждое фото должно быть не больше 5 МБ.",
    upload: "Не получилось загрузить фото. Проверьте Supabase Storage.",
};

export default async function EditListingPage({
    params,
    searchParams,
}: EditListingPageProps) {
    const { slug } = await params;
    const query = await searchParams;
    const { profile } = await requireUserProfile();

    const listing = await prisma.listing.findUnique({
        where: {
            id: slug,
        },
    });

    if (!listing) {
        notFound();
    }

    if (listing.sellerId !== profile.id) {
        redirect("/profile");
    }

    if (listing.status === "sold") {
        redirect(`/listing/${listing.id}`);
    }

    const errorText = query.error ? errorMessages[query.error] : "";

    const initialImages = listing.images?.length
        ? listing.images
        : listing.image
            ? [listing.image]
            : [];

    return (
        <main className="min-h-screen bg-[#fff7ed] text-[#111111]">
            <SiteHeader compact />

            <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
                <Link
                    href={`/listing/${listing.id}`}
                    className="mb-6 inline-flex items-center gap-2 font-black text-[#ff4b00]"
                >
                    <ArrowLeft size={18} />
                    Назад к объявлению
                </Link>

                <div className="mb-8 rounded-[2.5rem] bg-white p-6 shadow-sm md:p-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-black text-[#ff4b00]">
                        <Sparkles size={18} />
                        После изменений объявление снова уйдёт на проверку
                    </div>

                    <h1 className="text-5xl font-black tracking-tight">
                        Редактировать объявление
                    </h1>

                    <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-700">
                        Можно изменить описание, цену, категорию, город и фотографии.
                        После сохранения объявление получит статус “На проверке”.
                    </p>
                </div>

                {errorText && (
                    <div className="mb-6 rounded-[2rem] border border-red-200 bg-red-50 p-5 font-black text-red-700">
                        {errorText}
                    </div>
                )}

                <form
                    action={updateListing}
                    encType="multipart/form-data"
                    className="rounded-[2rem] bg-white p-5 shadow-sm md:p-8"
                >
                    <input type="hidden" name="listingId" value={listing.id} />

                    <SectionTitle
                        icon={<Camera size={22} />}
                        title="Фотографии"
                        text="Удалите лишние фото или добавьте новые. Первая фотография будет главной."
                    />

                    <div className="mt-5">
                        <EditPhotosInput initialImages={initialImages} />
                    </div>

                    <div className="mt-8">
                        <SectionTitle
                            icon={<ClipboardList size={22} />}
                            title="Описание объявления"
                            text="Проверьте данные перед отправкой на модерацию."
                        />
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Field label="Название объявления">
                            <input
                                name="title"
                                required
                                defaultValue={listing.title}
                                className="input"
                            />
                        </Field>

                        <Field label="Цена">
                            <input
                                name="price"
                                required
                                inputMode="numeric"
                                defaultValue={listing.price}
                                className="input"
                            />
                        </Field>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Field label="Категория">
                            <select
                                name="category"
                                required
                                className="input"
                                defaultValue={listing.category}
                            >
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
                                defaultValue={listing.city || "Москва"}
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
                                    defaultValue={listing.district}
                                    className="w-full bg-transparent outline-none"
                                />
                            </div>
                        </Field>

                        <Field label="Ориентир / место встречи">
                            <input
                                name="address"
                                defaultValue={listing.address}
                                className="input"
                            />
                        </Field>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                        <Field label="Состояние">
                            <select
                                name="condition"
                                required
                                className="input"
                                defaultValue={listing.condition}
                            >
                                <option value="">Выберите состояние</option>
                                {LISTING_CONDITIONS.map((condition) => (
                                    <option key={condition} value={condition}>
                                        {condition}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Способ сделки">
                            <select
                                name="dealMethod"
                                required
                                className="input"
                                defaultValue={listing.dealMethod}
                            >
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
                                defaultValue={listing.description}
                                className="input min-h-44 resize-none"
                            />
                        </Field>
                    </div>

                    <div className="mt-6 rounded-3xl bg-orange-50 p-5">
                        <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ff4b00] text-white">
                                <Check size={15} strokeWidth={4} />
                            </span>

                            <div>
                                <div className="font-black">Повторная модерация</div>
                                <p className="mt-1 text-sm leading-6 text-neutral-600">
                                    После сохранения объявление временно исчезнет из каталога и
                                    попадёт на проверку модератору.
                                </p>
                            </div>
                        </div>
                    </div>

                    <SaveListingButton />
                </form>
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