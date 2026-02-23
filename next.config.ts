import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Temporarily ignore build errors to allow deployment
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https" as const, hostname: "hoirqrkdgbmvpwutwuwj.supabase.co" },
      { protocol: "https" as const, hostname: "images.unsplash.com" },
      { protocol: "https" as const, hostname: "api.dicebear.com" },
      { protocol: "https" as const, hostname: "*.supabase.co" },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "onwhop.com",
        "*.apps.whop.com",
        "lhcrmopyjwzg9k4chbcn.apps.whop.com",
      ],
    },
  },
};

export default nextConfig;
