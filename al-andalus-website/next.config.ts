import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow loading the dev server from other devices on the local network.
  allowedDevOrigins: [
    "192.168.0.244",
    "192.168.254.1",
    "192.168.142.1",
  ],
  images: {
    remotePatterns: [],
  },
};

export default withPayload(nextConfig);
