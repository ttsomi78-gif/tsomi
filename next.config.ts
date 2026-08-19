import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the production Docker image.
  output: "standalone",
  // Product photos are served from this origin (/uploads/*, backed by a Docker
  // volume), so `next/image` needs no remotePatterns.
  experimental: {
    serverActions: {
      // Default is 1MB — too small for product photo uploads.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
