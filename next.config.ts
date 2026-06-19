import type { NextConfig } from "next";
import path from "path";

const BACKEND_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080").replace(/\/$/, "");

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_ORIGIN}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "videsol.com",
      },
      {
        protocol: "https",
        hostname: "cdn.pilotsolution.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "vehiculos-videsol-imagenes.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
