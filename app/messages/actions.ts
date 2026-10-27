"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserProfile } from "@/lib/auth";

export async function sendMessage(formData: FormData) {
    const { profile } = await requireUserProfile();

    const conversationId = String(formData.get("conversationId") || "");
    const text = String(formData.get("text") || "").trim();

    if (!conversationId) {
        redirect("/messages");
    }

    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId,
        },
    });

    if (!conversation) {
        redirect("/messages");
    }

    const isBuyer = conversation.buyerId === profile.id;
    const isSeller = conversation.sellerId === profile.id;

    if (!isBuyer && !isSeller) {
        redirect("/messages");
    }

    if (!text) {
        redirect(`/messages/${conversationId}`);
    }

    await prisma.$transaction([
        prisma.message.create({
            data: {
                conversationId,
                senderId: profile.id,
                text,
            },
        }),

        prisma.conversation.update({
            where: {
                id: conversationId,
            },
            data: {
                lastMessageAt: new Date(),

                ...(isBuyer
                    ? {
                        sellerUnreadCount: {
                            increment: 1,
                        },
                    }
                    : {
                        buyerUnreadCount: {
                            increment: 1,
                        },
                    }),
            },
        }),

        prisma.listing.update({
            where: {
                id: conversation.listingId,
            },
            data: {
                messages: {
                    increment: 1,
                },
            },
        }),
    ]);

    revalidatePath("/messages");
    revalidatePath(`/messages/${conversationId}`);
    revalidatePath(`/listing/${conversation.listingId}`);

    redirect(`/messages/${conversationId}`);
}

export async function markConversationRead(conversationId: string) {
    const { profile } = await requireUserProfile();

    const conversation = await prisma.conversation.findUnique({
        where: {
            id: conversationId,
        },
    });

    if (!conversation) {
        return;
    }

    const isBuyer = conversation.buyerId === profile.id;
    const isSeller = conversation.sellerId === profile.id;

    if (!isBuyer && !isSeller) {
        return;
    }

    await prisma.conversation.update({
        where: {
            id: conversationId,
        },
        data: isBuyer
            ? {
                buyerUnreadCount: 0,
            }
            : {
                sellerUnreadCount: 0,
            },
    });

    revalidatePath("/messages");
    revalidatePath(`/messages/${conversationId}`);
}