import createBundleAnalyzer from "@next/bundle-analyzer";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "typescript",
    "@takumi-rs/image-response",
    "shiki",
    "twoslash",
    "vscode-oniguruma",
  ],
  experimental: {
    optimizePackageImports: [
      "@icons-pack/react-simple-icons",
      "@paper-design/shaders-react",
    ],
  },
  images: {
    qualities: [20, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/u/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/avatars/**",
      },
      // Dub images excluded - use regular <img> tags for Dub URLs to avoid optimization
    ],
    minimumCacheTTL: 60 * 60 * 24 * 28, // 28 days
  },
  async rewrites() {
    return [
      {
        source: "/api/p/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/api/p/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
  allowedDevOrigins: ["192.168.1.*"],
  reactCompiler: true,
  reactStrictMode: true,
};

const withMDX = createMDX();
const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withAnalyzer(withMDX(nextConfig));
