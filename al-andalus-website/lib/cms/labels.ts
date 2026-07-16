import type { LabelFunction } from "payload";

/**
 * Field/collection labels as functions resolve to plain strings.
 * Object labels ({ en, ar }) render correctly in FieldLabel via getTranslation,
 * but list sort aria-labels interpolate the raw object → "Sort by [object Object]".
 */
export function bilingualLabel(en: string, ar: string): LabelFunction {
  return ({ i18n }) => {
    const lang = i18n?.language ?? "en";
    return lang.startsWith("ar") ? ar : en;
  };
}

export const bilingualFieldHint = {
  en: "Use the language switcher (English / العربية) at the top to enter both English and Arabic.",
  ar: "استخدم مبدّل اللغة (English / العربية) أعلى الصفحة لإدخال المحتوى بالإنجليزية والعربية.",
} as const;
