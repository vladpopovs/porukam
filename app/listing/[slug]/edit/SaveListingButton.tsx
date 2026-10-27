"use client";

import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";

export function SaveListingButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ff4b00] px-7 py-4 text-lg font-black text-white shadow-xl shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-[#eb4500] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
            {pending ? (
                <>
                    <Loader2 size={22} className="animate-spin" />
                    Сохраняем и отправляем на проверку...
                </>
            ) : (
                <>
                    <Save size={22} />
                    Сохранить изменения
                </>
            )}
        </button>
    );
}