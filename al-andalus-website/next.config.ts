import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin Turbopack root to this app (avoids picking up a parent package-lock.json).
  turbopack: {
    root: projectRoot,
  },
  // Payload pulls in pino/sharp; keep them external for Node runtime (cPanel/Passenger).
  serverExternalPackages: [
    "pino",
    "pino-pretty",
    "thread-stream",
    "sharp",
    "graphql",
    "drizzle-kit",
    "@libsql/client",
    "libsql",
  ],
  // Dev-only: allow loading from other devices on the local network.
  allowedDevOrigins: [
    "192.168.0.244",
    "192.168.254.1",
    "192.168.142.1",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "alandalus-iq.com" },
      { protocol: "https", hostname: "www.alandalus-iq.com" },
    ],
  },
};

export default withPayload(nextConfig);
