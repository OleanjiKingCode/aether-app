import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // Enable external image sources for wallet logos
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Webpack configuration for wallet compatibility
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Exclude unnecessary modules for better mobile performance
    config.externals.push("pino-pretty", "lokijs", "encoding");

    return config;
  },
};

export default nextConfig;
