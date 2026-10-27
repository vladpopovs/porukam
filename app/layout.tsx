import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: {
    default: "ПоРукам — объявления рядом",
    template: "%s — ПоРукам",
  },
  description:
    "ПоРукам — российский маркетплейс объявлений. Нашёл. Договорился. Забрал.",
  keywords: [
    "ПоРукам",
    "объявления",
    "маркетплейс",
    "продать",
    "купить",
    "сделки рядом",
    "авито альтернатива",
  ],
  openGraph: {
    title: "ПоРукам — объявления рядом",
    description:
      "Честная площадка объявлений: нашёл, договорился, забрал.",
    type: "website",
    locale: "ru_RU",
    siteName: "ПоРукам",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}