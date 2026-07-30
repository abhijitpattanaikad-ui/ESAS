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
  async headers() {
    const contentSecurityPolicy = [
      "default-src 'self'",
      "base-uri 'self'",
      "connect-src 'self' https://apis.xesports.pro",
      "font-src 'self' data:",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "frame-src https://www.googletagmanager.com",
      "img-src 'self' data: blob: https://cdn.xesports.pro https://xesports-assets.s3.me-central-1.amazonaws.com",
      "object-src 'none'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
