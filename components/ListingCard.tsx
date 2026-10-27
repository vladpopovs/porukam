import Link from "next/link";
import { Camera, MapPin } from "lucide-react";
import { FavoriteButton } from "./FavoriteButton";

type ListingCardItem = {
    id: string;
    title: string;
    price: number | string;
    location: string;
    badge?: string | null;
    image: string;
    images?: string[];
    sellerId?: string | null;
    favorites?: number;
    status?: string;
};

type ListingCardProps = {
    listing: ListingCardItem;
};

export async function ListingCard({ listing }: ListingCardProps) {
    const badge = listing.badge || getStatusLabel(listing.status || "active");
    const image = listing.images?.[0] || listing.image;
    const photosCount = listing.images?.length || 1;

    return (
        <article className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="relative overflow-hidden bg-neutral-100">
                <Link href={`/listing/${listing.id}`} className="block">
                    <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                        <img
                            src={image}
                            alt={listing.title}
                            className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                        />
                    </div>
                </Link>

                <div className="absolute right-2 top-2">
                    <FavoriteButton
                        listingId={listing.id}
                        sellerId={listing.sellerId}
                        favoritesCount={listing.favorites || 0}
                    />
                </div>

                {photosCount > 1 && (
                    <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/75 px-2.5 py-1 text-xs font-black text-white">
                        <Camera size={13} />
                        {photosCount}
                    </div>
                )}
            </div>

            <div className="p-3.5">
                <Link href={`/listing/${listing.id}`} className="block">
                    <h3 className="line-clamp-2 min-h-10 text-sm font-black leading-5 transition hover:text-[#ff4b00]">
                        {listing.title}
                    </h3>

                    <p className="mt-2 text-xl font-black">{formatPrice(listing.price)}</p>
                </Link>

                <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                    <span className="inline-flex min-w-0 items-center gap-1 text-neutral-500">
                        <MapPin size={13} className="shrink-0" />
                        <span className="truncate">{listing.location}</span>
                    </span>

                    <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-black ${listing.status === "sold"
                                ? "bg-neutral-900 text-white"
                                : "bg-green-100 text-green-700"
                            }`}
                    >
                        {badge}
                    </span>
                </div>
            </div>
        </article>
    );
}

function formatPrice(price: number | string) {
    if (typeof price === "number") {
        return `${price.toLocaleString("ru-RU")} ₽`;
    }

    return price;
}

function getStatusLabel(status: string) {
    if (status === "active") return "Активно";
    if (status === "sold") return "Продано";
    if (status === "moderation") return "На проверке";
    if (status === "rejected") return "Отклонено";

    return status;
}