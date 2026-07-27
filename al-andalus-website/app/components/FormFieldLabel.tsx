import type { ReactNode } from "react";

type FormFieldLabelProps = {
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  requiredMark?: string;
};

/** Label with an optional “(required)” / “(مطلوبة)” marker. */
export default function FormFieldLabel({
  htmlFor,
  children,
  required = false,
  requiredMark = "required",
}: FormFieldLabelProps) {
  return (
    <label htmlFor={htmlFor}>
      {children}
      {required ? (
        <span className="request-quote__required"> ({requiredMark})</span>
      ) : null}
    </label>
  );
}
