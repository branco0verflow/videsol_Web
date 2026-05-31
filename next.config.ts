import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
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
        hostname: "vehiculos-okm-imagenes-192292427991-us-east-1-an.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
