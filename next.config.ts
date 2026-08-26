import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the production Docker image.
  output: "standalone",
  // Product photos are served from this origin (/uploads/*, backed by a Docker
  // volume), so `next/image` needs no remotePatterns.
  experimental: {
    serverActions: {
      // Default is 1MB. The create screen submits every color's photos in one
      // request (up to 8 per color), so give it real headroom; each individual
      // file is still capped at 10MB by src/lib/storage.ts.
      bodySizeLimit: "48mb",
    },
  },
};

export default nextConfig;
