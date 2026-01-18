import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
