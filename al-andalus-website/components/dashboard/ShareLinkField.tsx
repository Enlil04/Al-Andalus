"use client";

import React, { useState, useEffect } from "react";
import { useField } from "@payloadcms/ui";

interface ShareLinkFieldProps {
  path?: string;
  label?: string | Record<string, string>;
}

export default function ShareLinkField({ path, label }: ShareLinkFieldProps) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  const { value } = useField<string>({ path: path || "token" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const displayLabel = typeof label === "string" 
    ? label 
    : (label && typeof label === "object" ? (label.en || Object.values(label)[0]) : "Share Link");

  if (!value) {
    return (
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", color: "#8c8c8c" }}>
          {displayLabel}
        </label>
        <div style={{ color: "#666", fontSize: "0.85rem", padding: "12px", background: "#f5f5f5", borderRadius: "4px", border: "1px dashed #ccc" }}>
          Link will be generated after saving the proposal.
        </div>
      </div>
    );
  }

  const shareUrl = `${origin}/proposals/${value}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", marginBottom: "8px", fontSize: "11px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", color: "#8c8c8c" }}>
        {displayLabel}
      </label>
      <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
        <input
          type="text"
          readOnly
          value={shareUrl}
          onClick={(e) => (e.target as HTMLInputElement).select()}
          style={{
            width: "100%",
            padding: "8px 12px",
            fontSize: "0.85rem",
            background: "#f9f9f9",
            border: "1px solid #ccc",
            borderRadius: "4px",
            color: "#333",
            cursor: "text",
            fontFamily: "monospace",
          }}
        />
        <button
          type="button"
          onClick={handleCopy}
          style={{
            padding: "10px 16px",
            fontSize: "0.85rem",
            background: copied ? "#28a745" : "#0f172a",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "background 0.2s ease",
            textAlign: "center",
            width: "100%",
          }}
        >
          {copied ? "Copied!" : "Copy Share Link"}
        </button>
      </div>
    </div>
  );
}
