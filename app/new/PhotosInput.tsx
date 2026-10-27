"use client";

import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";

const MAX_PHOTOS = 10;

type PreviewPhoto = {
    url: string;
    name: string;
};

export function PhotosInput() {
    const [photos, setPhotos] = useState<PreviewPhoto[]>([]);

    useEffect(() => {
        return () => {
            photos.forEach((photo) => URL.revokeObjectURL(photo.url));
        };
    }, [photos]);

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(event.currentTarget.files || []);

        photos.forEach((photo) => URL.revokeObjectURL(photo.url));

        if (files.length > MAX_PHOTOS) {
            alert(`Можно добавить максимум ${MAX_PHOTOS} фото.`);
            event.currentTarget.value = "";
            setPhotos([]);
            return;
        }

        const imageFiles = files.filter((file) => file.type.startsWith("image/"));

        if (imageFiles.length !== files.length) {
            alert("Можно загружать только изображения.");
            event.currentTarget.value = "";
            setPhotos([]);
            return;
        }

        setPhotos(
            imageFiles.map((file) => ({
                url: URL.createObjectURL(file),
                name: file.name,
            }))
        );
    }

    function clearPhotos() {
        photos.forEach((photo) => URL.revokeObjectURL(photo.url));
        setPhotos([]);

        const input = document.getElementById("photos") as HTMLInputElement | null;
        if (input) {
            input.value = "";
        }
    }

    return (
        <div>
            <label
                htmlFor="photos"
                className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-orange-200 bg-[#fff7ed] p-6 text-center transition hover:border-[#ff4b00] hover:bg-orange-50"
            >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#ff4b00] shadow-sm">
                    <ImagePlus size={32} />
                </div>

                <div className="mt-4 text-2xl font-black">
                    Добавьте фото объявления
                </div>

                <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600">
                    Можно загрузить до 10 фотографий. Первая фотография будет главной в
                    каталоге. Лучше использовать реальные фото товара, а не логотипы и
                    скриншоты.
                </p>

                <div className="mt-4 rounded-2xl bg-[#ff4b00] px-5 py-3 text-sm font-black text-white">
                    Выбрать фото
                </div>
            </label>

            <input
                id="photos"
                name="photos"
                type="file"
                accept="image/*"
                multiple
                required
                onChange={handleChange}
                className="hidden"
            />

            {photos.length > 0 && (
                <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="font-black">
                            Выбрано фото: {photos.length} / {MAX_PHOTOS}
                        </div>

                        <button
                            type="button"
                            onClick={clearPhotos}
                            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-black text-[#ff4b00] shadow-sm"
                        >
                            <X size={16} />
                            Очистить
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {photos.map((photo, index) => (
                            <div
                                key={photo.url}
                                className="relative overflow-hidden rounded-2xl bg-neutral-100 shadow-sm"
                            >
                                <div className="aspect-square">
                                    <img
                                        src={photo.url}
                                        alt={photo.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {index === 0 && (
                                    <div className="absolute left-2 top-2 rounded-full bg-[#ff4b00] px-3 py-1 text-xs font-black text-white">
                                        Главное
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}