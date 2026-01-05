import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  // Explicitly disable Turbopack to use Webpack
  turbopack: {},

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
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Exclude unnecessary modules for better mobile performance
    config.externals.push("pino-pretty", "lokijs", "encoding");

    // Optimize webpack for better build stability
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
      };
    }

    return config;
  },
};

export default nextConfig;
