import type { Metadata, Viewport } from "next";
import { cairo, poppins } from "@/lib/fonts";
import { getLocale } from "@/lib/locale";
import { LocaleProvider } from "@/app/components/LocaleProvider";
import "./globals.css";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#0B223D",
};

export const metadata: Metadata = {
  title: "Al-Andalus Insurance International | شركة الأندلس للتأمين الدولي",
  description:
    "Al-Andalus International Insurance — licensed general insurer in Iraq since 2015. Motor, health, cargo, engineering, and comprehensive coverage across Baghdad, Basrah, and Erbil.",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Al-Andalus International Insurance",
    description:
      "Licensed general insurance in Iraq. Three branches, 21 billion IQD authorized capital.",
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_IQ",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className={`${poppins.variable} ${cairo.variable}`}>
      <body>
        <LocaleProvider locale={locale}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}

