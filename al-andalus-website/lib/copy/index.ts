import { siteCopy as en } from "./en";
import { siteCopy as ar } from "./ar";

export function getSiteCopy(locale: string) {
  return locale === "ar" ? ar : en;
}
