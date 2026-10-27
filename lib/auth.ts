import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireUserProfile() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=Войдите в аккаунт");
  }

  const email = user.email || `${user.id}@porukam.local`;
  const name = String(user.user_metadata?.name || "Пользователь");
  const city = String(user.user_metadata?.city || "Москва");

  const profile = await prisma.user.upsert({
    where: {
      id: user.id,
    },
    update: {
      email,
    },
    create: {
      id: user.id,
      email,
      name,
      city,
    },
  });

  return {
    authUser: user,
    profile,
  };
}

export async function requireAdmin() {
  const { profile } = await requireUserProfile();

  if (profile.role !== "admin") {
    redirect("/profile");
  }

  return profile;
}