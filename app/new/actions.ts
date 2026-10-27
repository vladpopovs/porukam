"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserProfile } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES_COUNT = 10;

export async function createListing(formData: FormData) {
  const { profile } = await requireUserProfile();

  const title = String(formData.get("title") || "").trim();
  const priceRaw = String(formData.get("price") || "").replace(/\D/g, "");
  const category = String(formData.get("category") || "").trim();
  const city = String(formData.get("city") || profile.city || "Москва").trim();
  const district = String(formData.get("district") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const condition = String(formData.get("condition") || "").trim();
  const dealMethod = String(formData.get("dealMethod") || "").trim();
  const description = String(formData.get("description") || "").trim();

  const photos = formData
    .getAll("photos")
    .filter((photo): photo is File => photo instanceof File && photo.size > 0);

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
    redirect("/new?error=required");
  }

  const price = Number(priceRaw);

  if (!Number.isFinite(price) || price <= 0) {
    redirect("/new?error=price");
  }

  if (photos.length === 0) {
    redirect("/new?error=photo");
  }

  if (photos.length > MAX_IMAGES_COUNT) {
    redirect("/new?error=photoCount");
  }

  for (const photo of photos) {
    if (!photo.type.startsWith("image/")) {
      redirect("/new?error=photoType");
    }

    if (photo.size > MAX_IMAGE_SIZE) {
      redirect("/new?error=photoSize");
    }
  }

  const supabase = await createSupabaseServerClient();

  const uploadedUrls: string[] = [];

  for (const photo of photos) {
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
      redirect("/new?error=upload");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("listing-images").getPublicUrl(filePath);

    uploadedUrls.push(publicUrl);
  }

  const location = [city, district, address].filter(Boolean).join(", ");

  const listing = await prisma.listing.create({
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
      badge: "На проверке",
      status: "moderation",
      sellerId: profile.id,
      sellerName: profile.name,
      image: uploadedUrls[0],
      images: uploadedUrls,
      description,
      views: 0,
      messages: 0,
      favorites: 0,
    },
  });

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/profile");
  revalidatePath("/moderation");

  redirect(`/new/success?id=${listing.id}`);
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