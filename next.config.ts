import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.xesports.pro',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'xesports-assets.s3.me-central-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
