"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { markConversationRead } from "../actions";

export function MessagesRealtime({
    conversationId,
    listingId,
}: {
    conversationId: string;
    listingId: string;
}) {
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;

        markConversationRead(conversationId).then(() => {
            if (!cancelled) {
                router.refresh();
            }
        });

        const supabase = createSupabaseBrowserClient();

        const channel = supabase
            .channel(`conversation:${conversationId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "Message",
                    filter: `conversationId=eq.${conversationId}`,
                },
                () => {
                    markConversationRead(conversationId).finally(() => {
                        router.refresh();
                    });
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "Deal",
                    filter: `listingId=eq.${listingId}`,
                },
                () => {
                    router.refresh();
                }
            )
            .subscribe();

        return () => {
            cancelled = true;
            supabase.removeChannel(channel);
        };
    }, [conversationId, listingId, router]);

    return null;
}