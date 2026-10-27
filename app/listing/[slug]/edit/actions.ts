"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES_COUNT = 10;

export async function updateListing(formData: FormData) {
    const { profile } = await requireUserProfile();

    const listingId = String(formData.get("listingId") || "");
    const title = String(formData.get("title") || "").trim();
    const priceRaw = String(formData.get("price") || "").replace(/\D/g, "");
    const category = String(formData.get("category") || "").trim();
    const city = String(formData.get("city") || profile.city || "Москва").trim();
    const district = String(formData.get("district") || "").trim();
    const address = String(formData.get("address") || "").trim();
    const condition = String(formData.get("condition") || "").trim();
    const dealMethod = String(formData.get("dealMethod") || "").trim();
    const description = String(formData.get("description") || "").trim();

    if (!listingId) {
        redirect("/profile");
    }

    const listing = await prisma.listing.findUnique({
        where: {
            id: listingId,
        },
    });

    if (!listing) {
        redirect("/profile");
    }

    if (listing.sellerId !== profile.id) {
        redirect("/profile");
    }

    if (listing.status === "sold") {
        redirect(`/listing/${listing.id}`);
    }

    if (
        !title ||
        !priceRaw ||
        !category ||
        !city ||
        !district ||
        !condition ||
        !dealMethod ||
        !description
    ) {
        redirect(`/listing/${listing.id}/edit?error=required`);
    }

    const price = Number(priceRaw);

    if (!Number.isFinite(price) || price <= 0) {
        redirect(`/listing/${listing.id}/edit?error=price`);
    }

    const originalImages = listing.images?.length
        ? listing.images
        : listing.image
            ? [listing.image]
            : [];

    const existingImagesFromForm = formData
        .getAll("existingImages")
        .map((item) => String(item || "").trim())
        .filter(Boolean);

    const safeExistingImages = existingImagesFromForm.filter((image) =>
        originalImages.includes(image)
    );

    const newPhotos = formData
        .getAll("photos")
        .filter((photo): photo is File => photo instanceof File && photo.size > 0);

    if (safeExistingImages.length + newPhotos.length === 0) {
        redirect(`/listing/${listing.id}/edit?error=photo`);
    }

    if (safeExistingImages.length + newPhotos.length > MAX_IMAGES_COUNT) {
        redirect(`/listing/${listing.id}/edit?error=photoCount`);
    }

    for (const photo of newPhotos) {
        if (!photo.type.startsWith("image/")) {
            redirect(`/listing/${listing.id}/edit?error=photoType`);
        }

        if (photo.size > MAX_IMAGE_SIZE) {
            redirect(`/listing/${listing.id}/edit?error=photoSize`);
        }
    }

    const supabase = await createSupabaseServerClient();

    const uploadedUrls: string[] = [];

    for (const photo of newPhotos) {
        const extension = getSafeExtension(photo.name);
        const filePath = `${profile.id}/${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } = await supabase.storage
            .from("listing-images")
            .upload(filePath, photo, {
                contentType: photo.type,
                cacheControl: "3600",
                upsert: false,
            });

        if (uploadError) {
            console.error(uploadError);
            redirect(`/listing/${listing.id}/edit?error=upload`);
        }

        const {
            data: { publicUrl },
        } = supabase.storage.from("listing-images").getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
    }

    const finalImages = [...safeExistingImages, ...uploadedUrls];
    const location = [city, district, address].filter(Boolean).join(", ");

    await prisma.listing.update({
        where: {
            id: listing.id,
        },
        data: {
            title,
            price,
            city,
            location,
            district,
            address,
            category,
            condition,
            dealMethod,
            description,
            image: finalImages[0],
            images: finalImages,
            status: "moderation",
            badge: "На проверке",
            rejectionReason: "",
        },
    });

    revalidatePath("/");
    revalidatePath("/search");
    revalidatePath("/profile");
    revalidatePath("/moderation");
    revalidatePath(`/listing/${listing.id}`);

    redirect("/profile");
}

function getSafeExtension(fileName: string) {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (!extension) {
        return "jpg";
    }

    if (["jpg", "jpeg", "png", "webp"].includes(extension)) {
        return extension;
    }

    return "jpg";
}