/** Shared client/server form field checks for public website forms. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

/** Digits only, after stripping formatting. Iraqi mobiles are typically 10+ digits. */
const MIN_PHONE_DIGITS = 8;
const MAX_PHONE_DIGITS = 15;

export function isValidEmail(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const email = value.trim();
  if (!email || email.length > 200) return false;
  return EMAIL_RE.test(email);
}

export function phoneDigits(value: unknown): string {
  if (value == null) return "";
  return String(value).replace(/\D/g, "");
}

export function isValidPhone(value: unknown, options?: { required?: boolean }): boolean {
  const required = options?.required ?? true;
  const digits = phoneDigits(value);
  if (!digits) return !required;
  return digits.length >= MIN_PHONE_DIGITS && digits.length <= MAX_PHONE_DIGITS;
}

/** YYYY-MM-DD for `<input type="date">` bounds. */
export function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function todayDateInputValue(): string {
  return toDateInputValue(new Date());
}

export function yearsAgoDateInputValue(years: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  return toDateInputValue(d);
}

export function currentVehicleYearMax(): number {
  return new Date().getFullYear() + 1;
}

/** Empty required controls inside a form (inputs, selects, textareas, files). */
export function getEmptyRequiredFields(
  form: HTMLFormElement,
): Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  const controls = form.querySelectorAll<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >("input[required], select[required], textarea[required]");

  return Array.from(controls).filter((el) => {
    if (el.disabled) return false;
    if (el instanceof HTMLInputElement && el.type === "file") {
      return !el.files?.length;
    }
    return !String(el.value ?? "").trim();
  });
}

export function markInvalidFields(
  fields: Array<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  invalid: boolean,
) {
  for (const field of fields) {
    field.classList.toggle("is-invalid", invalid);
    field
      .closest(".request-quote__field")
      ?.classList.toggle("is-invalid", invalid);
  }
}

export function clearInvalidMarks(form: HTMLFormElement) {
  form
    .querySelectorAll(".is-invalid")
    .forEach((el) => el.classList.remove("is-invalid"));
}
