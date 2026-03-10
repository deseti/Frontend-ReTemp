import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@privy-io/react-auth', '@privy-io/wagmi'],
  experimental: {
    // ensures 'use client' boundaries are respected
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
};

export default nextConfig;
