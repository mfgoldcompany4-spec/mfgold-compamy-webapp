import type { NextConfig } from "next";

/** Hostname for next/image — derived from R2_ENDPOINT (no separate env). */
function r2HostFromEndpoint(): string | undefined {
  const raw = process.env.R2_ENDPOINT?.trim();
  if (!raw) return undefined;
  try {
    return new URL(raw).hostname;
  } catch {
    return undefined;
  }
}

const r2Host = r2HostFromEndpoint();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      ...(r2Host
        ? [{ protocol: "https" as const, hostname: r2Host, pathname: "/**" as const }]
        : []),
    ],
  },
};

export default nextConfig;
