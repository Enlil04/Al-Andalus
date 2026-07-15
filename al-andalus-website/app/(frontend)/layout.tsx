import type { Metadata } from "next";
import { cairo, poppins } from "@/lib/fonts";
import "./globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Al-Andalus Insurance International | شركة الأندلس للتأمين الدولي",
  description:
    "Al-Andalus International Insurance — licensed general insurer in Iraq since 2015. Motor, health, cargo, engineering, and comprehensive coverage across Baghdad, Basrah, and Erbil.",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  themeColor: "#0B223D",
  openGraph: {
    title: "Al-Andalus International Insurance",
    description:
      "Licensed general insurance in Iraq. Three branches, 21 billion IQD authorized capital.",
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_IQ",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className={`${poppins.variable} ${cairo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
