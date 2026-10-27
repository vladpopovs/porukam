"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function setCity(formData: FormData) {
  const city = String(formData.get("city") || "Москва");
  const returnTo = String(formData.get("returnTo") || "/search");

  const cookieStore = await cookies();

  cookieStore.set("porukam_city", city, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  const separator = returnTo.includes("?") ? "&" : "?";

  redirect(`${returnTo}${separator}city=${encodeURIComponent(city)}`);
}