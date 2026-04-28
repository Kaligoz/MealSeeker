import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.spoonacular.com"], 
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', 
    },
  },
};

export default nextConfig;
