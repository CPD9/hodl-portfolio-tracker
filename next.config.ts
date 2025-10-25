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
  // Prevent Vercel/Next build failures due to optional peer deps from web3 SDKs
  // e.g. '@react-native-async-storage/async-storage' (MetaMask SDK)
  // and 'pino-pretty' (walletconnect logger). We alias them to false so webpack
  // doesn't try to bundle them in the browser build.
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'pino-pretty': false,
      '@react-native-async-storage/async-storage': false,
    } as any;

    if (!isServer) {
      // Avoid bundling Node built-ins in client
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },
};

export default nextConfig;
