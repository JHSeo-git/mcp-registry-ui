import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },

  rewrites: async () => {
    return [
      {
        source: "/v0/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://localhost:8080/v0/:path*"
            : "/v0/:path*",
      },
    ];
  },
};

export default nextConfig;
