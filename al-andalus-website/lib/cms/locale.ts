import { getLocale } from "../locale";

/** Gets the active locale dynamically from request context. */
export async function getCMSLocale(): Promise<"en" | "ar"> {
  return await getLocale();
}
