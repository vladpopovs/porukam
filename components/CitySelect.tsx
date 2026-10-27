"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, MapPin, Search } from "lucide-react";
import { cities } from "@/data/cities";

type CitySelectProps = {
    name?: string;
    defaultValue?: string;
    includeAllRussia?: boolean;
};

export function CitySelect({
    name = "city",
    defaultValue = "Москва",
    includeAllRussia = true,
}: CitySelectProps) {
    const cityList = includeAllRussia
        ? cities
        : cities.filter((city) => city !== "Вся Россия");

    const [open, setOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState(defaultValue);
    const [query, setQuery] = useState("");

    const filteredCities = useMemo(() => {
        const value = query.trim().toLowerCase();

        if (!value) {
            return cityList;
        }

        return cityList.filter((city) => city.toLowerCase().includes(value));
    }, [query, cityList]);

    return (
        <div className="relative">
            <input type="hidden" name={name} value={selectedCity} />

            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="flex min-h-[58px] w-full items-center justify-between gap-3 rounded-2xl border border-orange-100 bg-[#fff7ed] px-4 py-4 text-left font-black outline-none transition hover:border-orange-200"
            >
                <span className="flex min-w-0 items-center gap-2">
                    <MapPin size={20} className="shrink-0 text-[#ff4b00]" />
                    <span className="truncate">{selectedCity}</span>
                </span>

                <ChevronDown
                    size={18}
                    className={`shrink-0 transition ${open ? "rotate-180" : ""}`}
                />
            </button>

            {open && (
                <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-full overflow-hidden rounded-[1.5rem] border border-orange-100 bg-white shadow-2xl shadow-orange-100">
                    <div className="border-b border-orange-100 p-3">
                        <div className="flex items-center gap-2 rounded-2xl bg-orange-50 px-3 py-3">
                            <Search size={18} className="text-[#ff4b00]" />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Введите город"
                                className="w-full bg-transparent text-sm font-bold outline-none placeholder:text-neutral-400"
                            />
                        </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto p-2">
                        {filteredCities.map((city) => {
                            const isActive = city === selectedCity;

                            return (
                                <button
                                    key={city}
                                    type="button"
                                    onClick={() => {
                                        setSelectedCity(city);
                                        setOpen(false);
                                        setQuery("");
                                    }}
                                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-black transition ${isActive
                                            ? "bg-[#ff4b00] text-white"
                                            : "text-neutral-800 hover:bg-orange-50 hover:text-[#ff4b00]"
                                        }`}
                                >
                                    <span>{city}</span>

                                    {isActive && <Check size={18} strokeWidth={4} />}
                                </button>
                            );
                        })}

                        {filteredCities.length === 0 && (
                            <div className="px-4 py-6 text-center text-sm font-bold text-neutral-500">
                                Город не найден
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}