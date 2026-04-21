import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "crafatar.com",
        pathname: "/renders/body/**",
      },
    ],
  },
};

export default nextConfig;
