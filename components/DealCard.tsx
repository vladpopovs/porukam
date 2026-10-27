import { Check, CheckCircle2, Sparkles } from "lucide-react";

type DealCardVariant = "detected" | "confirm" | "confirmed";

type DealCardProps = {
    amount?: string;
    variant?: DealCardVariant;
    title?: string;
    description?: string;
};

export function DealCard({
    amount = "18 000 ₽",
    variant = "confirm",
    title,
    description,
}: DealCardProps) {
    const isConfirmed = variant === "confirmed";
    const isDetected = variant === "detected";

    return (
        <div
            className={`rounded-[2rem] p-6 ${isConfirmed
                    ? "bg-[#111111] text-white"
                    : isDetected
                        ? "border-2 border-dashed border-orange-200 bg-orange-50"
                        : "border-4 border-orange-100 bg-white shadow-xl shadow-orange-100"
                }`}
        >
            <div className="flex items-start gap-4">
                <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white ${isConfirmed
                            ? "bg-[#2ecc71]"
                            : isDetected
                                ? "bg-[#ff4b00]"
                                : "bg-[#ff4b00]"
                        }`}
                >
                    {isConfirmed ? (
                        <CheckCircle2 size={30} />
                    ) : isDetected ? (
                        <Sparkles size={28} />
                    ) : (
                        <Check size={30} strokeWidth={4} />
                    )}
                </div>

                <div className="flex-1">
                    <div
                        className={`text-sm font-black ${isConfirmed
                                ? "text-green-300"
                                : isDetected
                                    ? "text-[#ff4b00]"
                                    : "text-neutral-500"
                            }`}
                    >
                        {isConfirmed
                            ? "Сделка подтверждена"
                            : isDetected
                                ? "Кажется, вы договорились"
                                : "Функция"}
                    </div>

                    <h2 className="mt-1 text-2xl font-black">
                        {title ??
                            (isConfirmed
                                ? `Покупатель готов купить за ${amount}`
                                : isDetected
                                    ? `Сумма сделки: ${amount}`
                                    : "По рукам")}
                    </h2>

                    <p
                        className={`mt-2 text-sm leading-6 ${isConfirmed ? "text-neutral-300" : "text-neutral-600"
                            }`}
                    >
                        {description ??
                            (isConfirmed
                                ? "После второго подтверждения сделка получает статус “Договорились”."
                                : isDetected
                                    ? "Мы нашли сумму в последних сообщениях. Проверьте её перед подтверждением."
                                    : "Когда договоритесь о цене в чате, нажмите кнопку — приложение зафиксирует сумму сделки.")}
                    </p>
                </div>
            </div>

            {!isConfirmed && (
                <div className="mt-5 rounded-3xl bg-orange-50 p-5">
                    <div className="text-sm font-black text-neutral-500">
                        {isDetected ? "Найдена сумма" : "Пример карточки сделки"}
                    </div>
                    <div className="mt-2 font-black">Покупатель готов купить за</div>
                    <div className="mt-1 text-4xl font-black">{amount}</div>
                </div>
            )}

            {!isConfirmed && (
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button className="rounded-2xl bg-[#ff4b00] px-5 py-4 font-black text-white">
                        По рукам
                    </button>

                    <button className="rounded-2xl border border-orange-200 bg-white px-5 py-4 font-black text-[#ff4b00]">
                        Изменить сумму
                    </button>
                </div>
            )}
        </div>
    );
}