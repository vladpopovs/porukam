export const POPULAR_SEARCHES = [
    "айфон 15 про",
    "iphone 15 pro",
    "макбук",
    "плойка 5",
    "ps5",
    "самокат",
    "велосипед",
    "диван",
    "стиральная машина",
    "квартира",
    "монтаж",
    "ремонт техники",
];

const SEARCH_SYNONYMS: Record<string, string[]> = {
    айфон: ["iphone", "айфон", "айпхон", "афон", "ифон", "iphon", "ifon"],
    iphone: ["iphone", "айфон", "айпхон", "афон", "ифон", "iphon", "ifon"],
    айпхон: ["iphone", "айфон", "айпхон", "афон"],
    афон: ["iphone", "айфон", "афон"],

    про: ["pro", "про"],
    pro: ["pro", "про"],
    макс: ["max", "макс"],
    max: ["max", "макс"],

    эпл: ["apple", "эпл", "апл"],
    apple: ["apple", "эпл", "апл"],

    макбук: ["macbook", "макбук", "мак", "mac"],
    macbook: ["macbook", "макбук", "мак", "mac"],
    мак: ["macbook", "макбук", "мак", "mac"],

    айпад: ["ipad", "айпад", "планшет apple"],
    ipad: ["ipad", "айпад"],

    эйрподс: ["airpods", "эйрподс", "аирподс", "наушники apple"],
    airpods: ["airpods", "эйрподс", "аирподс"],

    самсунг: ["samsung", "самсунг", "samsng", "самс"],
    samsung: ["samsung", "самсунг"],

    сяоми: ["xiaomi", "сяоми", "ксиаоми", "redmi", "poco"],
    xiaomi: ["xiaomi", "сяоми", "redmi", "poco"],

    плойка: ["playstation", "ps5", "ps4", "плойка", "пс5", "пс4"],
    playstation: ["playstation", "ps5", "ps4", "плойка", "пс5", "пс4"],
    пс5: ["ps5", "playstation 5", "пс5", "плойка"],
    ps5: ["ps5", "playstation 5", "пс5", "плойка"],
    пс4: ["ps4", "playstation 4", "пс4", "плойка"],
    ps4: ["ps4", "playstation 4", "пс4", "плойка"],

    ноут: ["ноутбук", "ноут", "laptop"],
    ноутбук: ["ноутбук", "ноут", "laptop"],

    велик: ["велосипед", "велик", "bike"],
    велосипед: ["велосипед", "велик", "bike"],

    телек: ["телевизор", "телек", "tv"],
    телевизор: ["телевизор", "телек", "tv"],

    машина: ["автомобиль", "машина", "авто"],
    авто: ["автомобиль", "машина", "авто"],

    квартира: ["квартира", "кв", "апартаменты"],
    кв: ["квартира", "кв", "апартаменты"],

    ремонт: ["ремонт", "мастер", "починка", "сервис"],
    монтаж: ["монтаж", "установка", "мастер", "работы"],
};

const TYPO_FIXES: Record<string, string> = {
    айпхон: "айфон",
    афон: "айфон",
    ифон: "айфон",
    айфонн: "айфон",
    iphon: "iphone",
    iphine: "iphone",
    ifone: "iphone",

    aplle: "apple",
    аппл: "apple",
    апл: "apple",

    самсун: "самсунг",
    самснг: "самсунг",

    макбок: "макбук",
    макбукк: "макбук",

    плаистейшен: "playstation",
    плэйстейшен: "playstation",

    стиралка: "стиральная машина",
    холодильникк: "холодильник",
};

export function normalizeSearchText(value: string) {
    return value
        .toLowerCase()
        .replace(/ё/g, "е")
        .replace(/([a-zа-я]+)(\d+)/giu, "$1 $2")
        .replace(/(\d+)([a-zа-я]+)/giu, "$1 $2")
        .replace(/[^\p{L}\p{N}\s]+/gu, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function getSearchWords(query: string) {
    return normalizeSearchText(query)
        .split(" ")
        .map((word) => TYPO_FIXES[word] || word)
        .filter(Boolean);
}

export function getSearchVariants(query: string) {
    const normalized = normalizeSearchText(query);

    if (!normalized) {
        return [];
    }

    const words = getSearchWords(query);
    const variants = new Set<string>();

    variants.add(normalized);
    variants.add(words.join(" "));

    for (const word of words) {
        variants.add(word);

        const synonyms = SEARCH_SYNONYMS[word];

        if (synonyms) {
            for (const synonym of synonyms) {
                variants.add(synonym);
            }
        }
    }

    const number = words.find((word) => /^\d{1,2}$/.test(word));

    const hasIphoneLike = words.some((word) =>
        ["айфон", "iphone", "айпхон", "афон", "ифон", "iphon", "ifon"].includes(word)
    );

    const hasProLike = words.some((word) => ["про", "pro"].includes(word));
    const hasMaxLike = words.some((word) => ["макс", "max"].includes(word));

    if (hasIphoneLike && number) {
        variants.add(`iphone ${number}`);
        variants.add(`айфон ${number}`);

        if (hasProLike) {
            variants.add(`iphone ${number} pro`);
            variants.add(`айфон ${number} про`);
        }

        if (hasMaxLike) {
            variants.add(`iphone ${number} pro max`);
            variants.add(`айфон ${number} про макс`);
        }
    }

    const hasPsLike = words.some((word) =>
        ["пс5", "ps5", "плойка", "playstation"].includes(word)
    );

    if (hasPsLike) {
        variants.add("playstation");
        variants.add("playstation 5");
        variants.add("ps5");
        variants.add("плойка");
        variants.add("пс5");
    }

    return Array.from(variants)
        .map(normalizeSearchText)
        .filter((item) => item.length >= 2);
}

export function getSearchScore({
    query,
    title,
    description,
    category,
    location = "",
}: {
    query: string;
    title: string;
    description: string;
    category: string;
    location?: string;
}) {
    const variants = getSearchVariants(query);

    const normalizedQuery = normalizeSearchText(query);
    const normalizedTitle = normalizeSearchText(title);
    const normalizedDescription = normalizeSearchText(description);
    const normalizedCategory = normalizeSearchText(category);
    const normalizedLocation = normalizeSearchText(location);

    let score = 0;

    for (const variant of variants) {
        if (!variant) continue;

        if (normalizedTitle === variant) score += 160;
        if (normalizedTitle.startsWith(variant)) score += 90;
        if (normalizedTitle.includes(variant)) score += 70;

        if (normalizedCategory.includes(variant)) score += 35;
        if (normalizedDescription.includes(variant)) score += 12;
        if (normalizedLocation.includes(variant)) score += 6;

        const words = variant.split(" ");

        for (const word of words) {
            if (word.length < 2) continue;

            if (normalizedTitle.includes(word)) score += 20;
            if (normalizedCategory.includes(word)) score += 10;
            if (normalizedDescription.includes(word)) score += 4;
            if (normalizedLocation.includes(word)) score += 2;
        }
    }

    const titleSimilarity = getStringSimilarity(normalizedQuery, normalizedTitle);

    if (titleSimilarity > 0.55) {
        score += Math.round(titleSimilarity * 60);
    }

    const queryWords = getSearchWords(query);
    const titleWords = normalizedTitle.split(" ");

    for (const queryWord of queryWords) {
        for (const titleWord of titleWords) {
            if (queryWord.length < 3 || titleWord.length < 3) continue;

            const wordSimilarity = getStringSimilarity(queryWord, titleWord);

            if (wordSimilarity > 0.62) {
                score += Math.round(wordSimilarity * 18);
            }
        }
    }

    return score;
}

function getStringSimilarity(a: string, b: string) {
    const first = normalizeSearchText(a);
    const second = normalizeSearchText(b);

    if (!first || !second) return 0;
    if (first === second) return 1;

    const firstBigrams = getBigrams(first);
    const secondBigrams = getBigrams(second);

    if (firstBigrams.length === 0 || secondBigrams.length === 0) {
        return 0;
    }

    const secondCopy = [...secondBigrams];
    let matches = 0;

    for (const bigram of firstBigrams) {
        const index = secondCopy.indexOf(bigram);

        if (index !== -1) {
            matches += 1;
            secondCopy.splice(index, 1);
        }
    }

    return (2 * matches) / (firstBigrams.length + secondBigrams.length);
}

function getBigrams(value: string) {
    const clean = value.replace(/\s+/g, "");

    if (clean.length < 2) {
        return [clean];
    }

    const result: string[] = [];

    for (let index = 0; index < clean.length - 1; index += 1) {
        result.push(clean.slice(index, index + 2));
    }

    return result;
}