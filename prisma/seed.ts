import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.listing.deleteMany();

  await prisma.listing.createMany({
    data: [
      {
        title: "Велосипед Trek Marlin 7",
        price: 32000,
        location: "Москва, Марьино",
        district: "Марьино",
        category: "Транспорт",
        badge: "Проверен",
        status: "active",
        sellerName: "Алексей",
        image:
          "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1200&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?q=80&w=1200&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1571068316344-75bc76f77890?q=80&w=1200&auto=format&fit=crop",
        ],
        description:
          "Продаю велосипед Trek Marlin 7. Состояние отличное, всё работает, катался аккуратно. Подойдёт для города, парков и лёгкого бездорожья.",
      },
      {
        title: "iPhone 13, 128 ГБ",
        price: 25000,
        location: "Москва, Марьино",
        district: "Марьино",
        category: "Электроника",
        badge: "Проверен",
        status: "active",
        sellerName: "Иван",
        image:
          "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1200&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1200&auto=format&fit=crop",
        ],
        description:
          "iPhone 13 на 128 ГБ. Аккуратное использование, батарея держит хорошо. В комплекте коробка и кабель.",
      },
      {
        title: "Диван угловой",
        price: 18000,
        location: "Москва, Люблино",
        district: "Люблино",
        category: "Дом и ремонт",
        badge: "Можно сегодня",
        status: "active",
        sellerName: "Мария",
        image:
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1200&auto=format&fit=crop",
        ],
        description:
          "Угловой диван в хорошем состоянии. Без пятен и серьёзных повреждений. Самовывоз, можно забрать сегодня.",
      },
      {
        title: "Шуруповёрт Makita",
        price: 7500,
        location: "Москва, Братиславская",
        district: "Братиславская",
        category: "Дом и ремонт",
        badge: "Можно сегодня",
        status: "moderation",
        sellerName: "Алексей",
        image:
          "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1200&auto=format&fit=crop",
        images: [
          "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=1200&auto=format&fit=crop",
        ],
        description:
          "Шуруповёрт Makita, рабочий, аккумулятор держит. Подойдёт для дома и ремонта.",
      },
    ],
  });

  console.log("Seed completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });   