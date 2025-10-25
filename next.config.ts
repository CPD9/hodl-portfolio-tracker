import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  eslint: {
      ignoreDuringBuilds: true,
  },
  typescript: {
      ignoreBuildErrors: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'prod.spline.design',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      }
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
