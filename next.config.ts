import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Allow phone/browser access via local IP during development (fixes CSS not loading)
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.2",
    "192.168.1.2:3000",
    "192.168.1.6",
    "192.168.1.6:3000",
    "10.0.2.2",
    "10.0.2.2:3000",
  ],
  // Ensure static assets work when accessed from phone on LAN
  images: {
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
