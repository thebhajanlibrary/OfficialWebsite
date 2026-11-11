import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.70"],
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    localPatterns: [
      {
        pathname: "/images/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // YouTube embeds need a Referer (Error 153 if stripped)
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          { key: "Content-Disposition", value: "inline" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Cache-Control",
            value: "private, no-store",
          },
        ],
      },
      {
        // Chromecast / AirPlay fetch artwork and audio from a different origin
        source: "/images/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Cache-Control",
            value:
              process.env.NODE_ENV === "development"
                ? "no-cache, must-revalidate"
                : "public, max-age=3600, must-revalidate",
          },
        ],
      },
      {
        source: "/audio/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Accept-Ranges", value: "bytes" },
        ],
      },
    ];
  },
};

export default nextConfig;
