"use client";

import React from "react";

export function InsuranceRequestsExport() {
  const basePath = "/api/insurance-requests";

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        marginBottom: "16px",
        flexWrap: "wrap",
      }}
    >
      <a
        href={`${basePath}/export/csv`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "8px 14px",
          borderRadius: "4px",
          background: "#0b223d",
          color: "#fff",
          fontSize: "13px",
          fontWeight: 500,
          textDecoration: "none",
        }}
      >
        Export Excel (CSV)
      </a>
      <a
        href={`${basePath}/export/pdf`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "8px 14px",
          borderRadius: "4px",
          border: "1px solid #0b223d",
          color: "#0b223d",
          fontSize: "13px",
          fontWeight: 500,
          textDecoration: "none",
        }}
      >
        Export PDF
      </a>
    </div>
  );
}
