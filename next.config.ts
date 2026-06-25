import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "api.dicebear.com" },
      { hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
