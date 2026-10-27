"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";

type ListingGalleryProps = {
    images: string[];
    title: string;
};

export function ListingGallery({ images, title }: ListingGalleryProps) {
    const safeImages = useMemo(() => {
        return images.filter(Boolean);
    }, [images]);

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (activeIndex > safeImages.length - 1) {
            setActiveIndex(0);
        }
    }, [activeIndex, safeImages.length]);

    if (safeImages.length === 0) {
        return (
            <div className="rounded-[2rem] bg-white p-4 shadow-sm">
                <div className="flex aspect-[4/3] items-center justify-center rounded-[1.5rem] bg-neutral-100 text-neutral-400">
                    <div className="text-center">
                        <Camera size={42} className="mx-auto" />
                        <div className="mt-3 font-black">Нет фото</div>
                    </div>
                </div>
            </div>
        );
    }

    const activeImage = safeImages[activeIndex];

    function goPrev() {
        setActiveIndex((current) =>
            current === 0 ? safeImages.length - 1 : current - 1
        );
    }

    function goNext() {
        setActiveIndex((current) =>
            current === safeImages.length - 1 ? 0 : current + 1
        );
    }

    return (
        <div className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-sm">
            <div className="relative overflow-hidden rounded-[1.5rem] bg-neutral-100">
                <div className="flex aspect-[4/3] items-center justify-center">
                    <img
                        src={activeImage}
                        alt={title}
                        className="h-full w-full object-contain"
                    />
                </div>

                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-2 text-xs font-black text-white">
                    <Camera size={15} />
                    {activeIndex + 1} / {safeImages.length}
                </div>

                {safeImages.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={goPrev}
                            aria-label="Предыдущее фото"
                            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#111111] shadow-lg transition hover:bg-white"
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <button
                            type="button"
                            onClick={goNext}
                            aria-label="Следующее фото"
                            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#111111] shadow-lg transition hover:bg-white"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>

            {safeImages.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {safeImages.map((image, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <button
                                key={`${image}-${index}`}
                                type="button"
                                onClick={() => setActiveIndex(index)}
                                className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 bg-neutral-100 transition ${isActive ? "border-[#ff4b00]" : "border-transparent"
                                    }`}
                            >
                                <img
                                    src={image}
                                    alt={`${title}, фото ${index + 1}`}
                                    className="h-full w-full object-cover"
                                />

                                {isActive && (
                                    <span className="absolute inset-0 rounded-2xl ring-2 ring-inset ring-[#ff4b00]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}