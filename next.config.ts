import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["img.spoonacular.com"], // allow Spoonacular images
  },
};

export default nextConfig;
