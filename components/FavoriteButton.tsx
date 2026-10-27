import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { toggleFavorite } from "@/app/favorites/actions";
import { FavoriteSubmitButton } from "./FavoriteSubmitButton";

type FavoriteButtonProps = {
    listingId: string;
    sellerId?: string | null;
    favoritesCount?: number;
    variant?: "icon" | "wide";
};

export async function FavoriteButton({
    listingId,
    sellerId,
    favoritesCount = 0,
    variant = "icon",
}: FavoriteButtonProps) {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user && sellerId === user.id) {
        return null;
    }

    let isFavorite = false;

    if (user) {
        const favorite = await prisma.favorite.findUnique({
            where: {
                userId_listingId: {
                    userId: user.id,
                    listingId,
                },
            },
            select: {
                id: true,
            },
        });

        isFavorite = Boolean(favorite);
    }

    return (
        <form action={toggleFavorite} className={variant === "wide" ? "w-full" : ""}>
            <input type="hidden" name="listingId" value={listingId} />

            <FavoriteSubmitButton
                isFavorite={isFavorite}
                favoritesCount={favoritesCount}
                variant={variant}
            />
        </form>
    );
}