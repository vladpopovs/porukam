"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Clock3, Search, Sparkles, TrendingUp, X } from "lucide-react";

type Suggestion = {
    query: string;
    subtitle: string;
    type: "popular" | "listing" | "variant" | string;
};

type SmartSearchBoxProps = {
    defaultValue?: string;
    city?: string;
};

const HISTORY_KEY = "porukam_search_history";

export function SmartSearchBox({
    defaultValue = "",
    city = "Москва",
}: SmartSearchBoxProps) {
    const [value, setValue] = useState(defaultValue);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(HISTORY_KEY);
            setHistory(saved ? JSON.parse(saved) : []);
        } catch {
            setHistory([]);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        const timer = window.setTimeout(async () => {
            try {
                const url = new URL("/api/search/suggest", window.location.origin);
                url.searchParams.set("q", value);
                url.searchParams.set("city", city);

                const response = await fetch(url.toString(), {
                    signal: controller.signal,
                });

                const data = await response.json();
                setSuggestions(data.suggestions || []);
            } catch {
                if (!controller.signal.aborted) {
                    setSuggestions([]);
                }
            }
        }, 180);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [value, city]);

    useEffect(() => {
        function handleClick(event: MouseEvent) {
            if (!wrapperRef.current) return;

            if (!wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    function saveToHistory(query: string) {
        const clean = query.trim();

        if (!clean) return;

        const next = [clean, ...history.filter((item) => item !== clean)].slice(0, 8);

        setHistory(next);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    }

    function goToSearch(query: string) {
        const clean = query.trim();

        if (!clean) return;

        saveToHistory(clean);

        const params = new URLSearchParams();
        params.set("q", clean);

        if (city) {
            params.set("city", city);
        }

        window.location.href = `/search?${params.toString()}`;
    }

    function clearHistory() {
        setHistory([]);
        localStorage.removeItem(HISTORY_KEY);
    }

    const shownHistory = value.trim() ? [] : history.slice(0, 5);
    const shownSuggestions = suggestions.slice(0, 10);

    return (
        <div ref={wrapperRef} className="relative">
            <div className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-[#fff7ed] px-4 py-4">
                <Search size={22} className="shrink-0 text-[#ff4b00]" />

                <input
                    name="q"
                    value={value}
                    onFocus={() => setIsOpen(true)}
                    onChange={(event) => {
                        setValue(event.target.value);
                        setIsOpen(true);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            saveToHistory(value);
                        }
                    }}
                    placeholder="Айфон 15 про, афон, макбук, плойка..."
                    autoComplete="off"
                    className="w-full bg-transparent font-bold outline-none placeholder:text-neutral-400"
                />

                {value && (
                    <button
                        type="button"
                        onClick={() => {
                            setValue("");
                            setIsOpen(true);
                        }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-neutral-500"
                        aria-label="Очистить поиск"
                    >
                        <X size={17} />
                    </button>
                )}
            </div>

            {isOpen && (shownHistory.length > 0 || shownSuggestions.length > 0) && (
                <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-[1.5rem] border border-orange-100 bg-white shadow-2xl">
                    {shownHistory.length > 0 && (
                        <div className="border-b border-orange-100 p-3">
                            <div className="mb-2 flex items-center justify-between gap-3 px-2">
                                <div className="text-xs font-black uppercase tracking-wide text-neutral-400">
                                    Вы недавно искали
                                </div>

                                <button
                                    type="button"
                                    onClick={clearHistory}
                                    className="text-xs font-black text-[#ff4b00]"
                                >
                                    очистить
                                </button>
                            </div>

                            {shownHistory.map((item) => (
                                <SuggestionButton
                                    key={item}
                                    icon={<Clock3 size={18} />}
                                    title={item}
                                    subtitle="История поиска"
                                    onClick={() => goToSearch(item)}
                                />
                            ))}
                        </div>
                    )}

                    {shownSuggestions.length > 0 && (
                        <div className="p-3">
                            <div className="mb-2 px-2 text-xs font-black uppercase tracking-wide text-neutral-400">
                                {value.trim() ? "Подсказки" : "Популярное"}
                            </div>

                            {shownSuggestions.map((suggestion) => (
                                <SuggestionButton
                                    key={`${suggestion.type}-${suggestion.query}`}
                                    icon={
                                        suggestion.type === "popular" ? (
                                            <TrendingUp size={18} />
                                        ) : suggestion.type === "listing" ? (
                                            <Sparkles size={18} />
                                        ) : (
                                            <Search size={18} />
                                        )
                                    }
                                    title={suggestion.query}
                                    subtitle={suggestion.subtitle}
                                    onClick={() => goToSearch(suggestion.query)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function SuggestionButton({
    icon,
    title,
    subtitle,
    onClick,
}: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-orange-50"
        >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#ff4b00]">
                {icon}
            </span>

            <span className="min-w-0 flex-1">
                <span className="block truncate font-black">{title}</span>
                <span className="block truncate text-xs font-bold text-neutral-500">
                    {subtitle}
                </span>
            </span>

            <ArrowUpRight size={17} className="shrink-0 text-neutral-400" />
        </button>
    );
}