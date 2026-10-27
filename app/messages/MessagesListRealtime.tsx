"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function MessagesListRealtime({ userId }: { userId: string }) {
    const router = useRouter();

    useEffect(() => {
        const supabase = createSupabaseBrowserClient();

        const channel = supabase
            .channel(`messages-list:${userId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "Conversation",
                    filter: `buyerId=eq.${userId}`,
                },
                () => {
                    router.refresh();
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "Conversation",
                    filter: `sellerId=eq.${userId}`,
                },
                () => {
                    router.refresh();
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "Deal",
                    filter: `buyerId=eq.${userId}`,
                },
                () => {
                    router.refresh();
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "Deal",
                    filter: `sellerId=eq.${userId}`,
                },
                () => {
                    router.refresh();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [router, userId]);

    return null;
}