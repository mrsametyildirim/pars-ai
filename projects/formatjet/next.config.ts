import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/bgremoval/:path*",
        destination:
          "https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/:path*",
      },
    ];
  },
};

export default nextConfig;
