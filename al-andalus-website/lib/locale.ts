import { cookies } from "next/headers";

export type Locale = "en" | "ar";

/**
 * Returns the current locale ("en" or "ar") based on the NEXT_LOCALE cookie.
 * Safe to call in Next.js Server Components.
 */
export async function getLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value;
    return locale === "ar" ? "ar" : "en";
  } catch {
    return "en";
  }
}
