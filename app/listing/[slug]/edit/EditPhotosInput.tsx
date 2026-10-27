"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Trash2, X } from "lucide-react";

const MAX_PHOTOS = 10;

type NewPreviewPhoto = {
    url: string;
    name: string;
};

export function EditPhotosInput({
    initialImages,
}: {
    initialImages: string[];
}) {
    const [existingImages, setExistingImages] = useState(initialImages);
    const [newPhotos, setNewPhotos] = useState<NewPreviewPhoto[]>([]);

    useEffect(() => {
        return () => {
            newPhotos.forEach((photo) => URL.revokeObjectURL(photo.url));
        };
    }, [newPhotos]);

    const totalCount = existingImages.length + newPhotos.length;

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(event.currentTarget.files || []);

        newPhotos.forEach((photo) => URL.revokeObjectURL(photo.url));

        if (existingImages.length + files.length > MAX_PHOTOS) {
            alert(`Всего можно оставить максимум ${MAX_PHOTOS} фото.`);
            event.currentTarget.value = "";
            setNewPhotos([]);
            return;
        }

        const imageFiles = files.filter((file) => file.type.startsWith("image/"));

        if (imageFiles.length !== files.length) {
            alert("Можно загружать только изображения.");
            event.currentTarget.value = "";
            setNewPhotos([]);
            return;
        }

        setNewPhotos(
            imageFiles.map((file) => ({
                url: URL.createObjectURL(file),
                name: file.name,
            }))
        );
    }

    function removeExistingImage(image: string) {
        setExistingImages((current) => current.filter((item) => item !== image));
    }

    function clearNewPhotos() {
        newPhotos.forEach((photo) => URL.revokeObjectURL(photo.url));
        setNewPhotos([]);

        const input = document.getElementById("photos") as HTMLInputElement | null;
        if (input) {
            input.value = "";
        }
    }

    return (
        <div>
            {existingImages.map((image) => (
                <input key={image} type="hidden" name="existingImages" value={image} />
            ))}

            <label
                htmlFor="photos"
                className="flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-orange-200 bg-[#fff7ed] p-6 text-center transition hover:border-[#ff4b00] hover:bg-orange-50"
            >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#ff4b00] shadow-sm">
                    <ImagePlus size={32} />
                </div>

                <div className="mt-4 text-2xl font-black">Добавить новые фото</div>

                <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-600">
                    Можно оставить старые фото, удалить лишние и добавить новые. Всего
                    максимум 10 фотографий. Первая фотография будет главной.
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
                onChange={handleChange}
                className="hidden"
            />

            <div className="mt-5 rounded-3xl bg-orange-50 p-4 font-black text-[#ff4b00]">
                Сейчас выбрано: {totalCount} / {MAX_PHOTOS}
            </div>

            {existingImages.length > 0 && (
                <div className="mt-5">
                    <div className="mb-3 font-black">Текущие фото</div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {existingImages.map((image, index) => (
                            <div
                                key={image}
                                className="relative overflow-hidden rounded-2xl bg-neutral-100 shadow-sm"
                            >
                                <div className="aspect-square">
                                    <img
                                        src={image}
                                        alt={`Фото ${index + 1}`}
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                {index === 0 && (
                                    <div className="absolute left-2 top-2 rounded-full bg-[#ff4b00] px-3 py-1 text-xs font-black text-white">
                                        Главное
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(image)}
                                    className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 shadow"
                                    aria-label="Удалить фото"
                                >
                                    <Trash2 size={17} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {newPhotos.length > 0 && (
                <div className="mt-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="font-black">Новые фото: {newPhotos.length}</div>

                        <button
                            type="button"
                            onClick={clearNewPhotos}
                            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-black text-[#ff4b00] shadow-sm"
                        >
                            <X size={16} />
                            Очистить новые
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {newPhotos.map((photo, index) => {
                            const isMain = existingImages.length === 0 && index === 0;

                            return (
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

                                    {isMain && (
                                        <div className="absolute left-2 top-2 rounded-full bg-[#ff4b00] px-3 py-1 text-xs font-black text-white">
                                            Главное
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {totalCount === 0 && (
                <div className="mt-5 rounded-3xl border border-red-200 bg-red-50 p-5 font-black text-red-700">
                    Нужно оставить хотя бы одно фото или добавить новое.
                </div>
            )}
        </div>
    );
}