"use client";

import { useFormStatus } from "react-dom";
import { Heart, Loader2 } from "lucide-react";

type FavoriteSubmitButtonProps = {
    isFavorite: boolean;
    favoritesCount: number;
    variant?: "icon" | "wide";
};

export function FavoriteSubmitButton({
    isFavorite,
    favoritesCount,
    variant = "icon",
}: FavoriteSubmitButtonProps) {
    const { pending } = useFormStatus();

    if (variant === "wide") {
        return (
            <button
                type="submit"
                disabled={pending}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-lg font-black shadow-sm transition disabled:cursor-not-allowed disabled:opacity-70 ${isFavorite
                        ? "bg-[#ff4b00] text-white shadow-orange-200"
                        : "border border-orange-200 bg-white text-[#ff4b00]"
                    }`}
            >
                {pending ? (
                    <>
                        <Loader2 size={22} className="animate-spin" />
                        Сохраняем...
                    </>
                ) : (
                    <>
                        <Heart size={22} fill={isFavorite ? "currentColor" : "none"} />
                        {isFavorite ? "В избранном" : "В избранное"}
                        {favoritesCount > 0 && (
                            <span className="rounded-full bg-black/10 px-2 py-0.5 text-sm">
                                {favoritesCount}
                            </span>
                        )}
                    </>
                )}
            </button>
        );
    }

    return (
        <button
            type="submit"
            disabled={pending}
            aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
            className={`inline-flex h-11 min-w-11 items-center justify-center gap-1 rounded-full px-3 shadow transition disabled:cursor-not-allowed disabled:opacity-70 ${isFavorite
                    ? "bg-[#ff4b00] text-white"
                    : "bg-white/95 text-neutral-700 hover:text-[#ff4b00]"
                }`}
        >
            {pending ? (
                <Loader2 size={19} className="animate-spin" />
            ) : (
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            )}

            {favoritesCount > 0 && (
                <span className="text-xs font-black">
                    {favoritesCount > 99 ? "99+" : favoritesCount}
                </span>
            )}
        </button>
    );
}