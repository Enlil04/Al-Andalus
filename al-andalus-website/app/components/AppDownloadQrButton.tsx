"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

type AppDownloadQrButtonProps = {
  qrDataUrl: string;
  buttonLabel: string;
  modalTitle: string;
  modalHint: string;
  closeLabel: string;
};

export default function AppDownloadQrButton({
  qrDataUrl,
  buttonLabel,
  modalTitle,
  modalHint,
  closeLabel,
}: AppDownloadQrButtonProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const modal =
    open && mounted
      ? createPortal(
          <div
            className="app-qr-modal"
            role="presentation"
            onClick={() => setOpen(false)}
          >
            <div
              className="app-qr-modal__dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                ref={closeRef}
                type="button"
                className="app-qr-modal__close"
                onClick={() => setOpen(false)}
                aria-label={closeLabel}
              >
                ×
              </button>

              <h3 id={titleId} className="app-qr-modal__title">
                {modalTitle}
              </h3>
              <p className="app-qr-modal__hint">{modalHint}</p>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt={modalTitle}
                width={240}
                height={240}
                className="app-qr-modal__image"
              />
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        className="app-qr-trigger"
        onClick={() => setOpen(true)}
      >
        <svg
          className="app-qr-trigger__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <path d="M14 14h3v3h-3zM20 14v3M14 20h3M20 20v.01" />
        </svg>
        <span>{buttonLabel}</span>
      </button>
      {modal}
    </>
  );
}
