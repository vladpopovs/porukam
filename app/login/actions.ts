"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function loginRedirect(message: string) {
  redirect(`/login?message=${encodeURIComponent(message)}`);
}

export async function signUp(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const city = String(formData.get("city") || "Москва").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!name || !email || !password) {
    loginRedirect("Заполните имя, email и пароль");
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        city,
      },
    },
  });

  if (error) {
    loginRedirect(error.message);
  }

  if (data.user) {
    await prisma.user.upsert({
      where: {
        id: data.user.id,
      },
      update: {
        email,
        name,
        city,
      },
      create: {
        id: data.user.id,
        email,
        name,
        city,
      },
    });
  }

  redirect("/profile");
}

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    loginRedirect("Введите email и пароль");
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    loginRedirect(error.message);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const fallbackEmail = user.email || `${user.id}@porukam.local`;
    const name = String(user.user_metadata?.name || "Пользователь");
    const city = String(user.user_metadata?.city || "Москва");

    await prisma.user.upsert({
      where: {
        id: user.id,
      },
      update: {
        email: fallbackEmail,
      },
      create: {
        id: user.id,
        email: fallbackEmail,
        name,
        city,
      },
    });
  }

  redirect("/profile");
}