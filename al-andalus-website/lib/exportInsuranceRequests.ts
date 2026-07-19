import type { PayloadHandler, PayloadRequest } from "payload";

type UserWithRole = {
  role?: "admin" | "editor";
};

function requireStaff(req: PayloadRequest) {
  const user = req.user as UserWithRole | null;
  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
}

function escapeCsv(value: string) {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function serviceTitle(service: unknown): string {
  if (typeof service === "object" && service) {
    const record = service as { titleEn?: string; titleAr?: string; title?: string };
    return record.titleEn || record.titleAr || record.title || "";
  }
  return String(service || "");
}

async function fetchRequests(req: PayloadRequest) {
  const { payload } = req;
  const url = new URL(req.url || "", "http://localhost");
  const status = url.searchParams.get("status");

  const where = status ? { status: { equals: status } } : undefined;

  return payload.find({
    collection: "insurance-requests",
    limit: 10000,
    depth: 1,
    sort: "-createdAt",
    where,
  });
}

export const exportInsuranceRequestsCSV: PayloadHandler = async (req) => {
  const unauthorized = requireStaff(req);
  if (unauthorized) return unauthorized;

  const { docs } = await fetchRequests(req);

  const headers = [
    "Reference",
    "Full Name",
    "Email",
    "Phone",
    "Insurance Service",
    "City",
    "Status",
    "Details",
    "Submitted At",
  ];

  const rows = docs.map((doc) => {
    return [
      doc.referenceNumber || "",
      doc.fullName || "",
      doc.email || "",
      doc.phone || "",
      serviceTitle(doc.insuranceService),
      doc.city || "",
      doc.status || "",
      doc.details || "",
      doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
    ].map((cell) => escapeCsv(String(cell)));
  });

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="insurance-requests-${Date.now()}.csv"`,
    },
  });
};

export const exportInsuranceRequestsPDF: PayloadHandler = async (req) => {
  const unauthorized = requireStaff(req);
  if (unauthorized) return unauthorized;

  const { docs } = await fetchRequests(req);

  const rows = docs
    .map((doc) => {
      const cells = [
        doc.referenceNumber || "",
        doc.fullName || "",
        doc.email || "",
        doc.phone || "",
        serviceTitle(doc.insuranceService),
        doc.status || "",
        doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "",
      ];
      return `<tr>${cells.map((cell) => `<td>${escapeHtml(String(cell))}</td>`).join("")}</tr>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Insurance Requests Export</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; color: #0b223d; }
    h1 { font-size: 20px; margin-bottom: 16px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th, td { border: 1px solid #ccd5e0; padding: 8px; text-align: left; }
    th { background: #0b223d; color: white; }
    tr:nth-child(even) { background: #eef1f5; }
  </style>
</head>
<body>
  <h1>Al-Andalus Insurance Requests</h1>
  <p>Exported on ${new Date().toLocaleString()}</p>
  <table>
    <thead>
      <tr>
        <th>Reference</th>
        <th>Name</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Service</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <script>window.onload = () => window.print()</script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="insurance-requests-${Date.now()}.html"`,
    },
  });
};
