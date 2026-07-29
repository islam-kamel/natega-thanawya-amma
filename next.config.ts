import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Include the SQLite database in serverless function bundles
  outputFileTracingIncludes: {
    "/api/**": ["./data/**"],
    "/result/**": ["./data/**"],
    "/": ["./data/**"],
  },

  // Optimize for production
  poweredByHeader: false,

  // Headers for security and caching
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },

  // Handle better-sqlite3 as external package for serverless
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
