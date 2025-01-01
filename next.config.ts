import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/login",
        permanent: true,
      },
    ];
  },
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: "https",
  //       hostname: "cdn.jsdelivr.net",
  //       port: "",
  //       pathname: "**",
  //       search: "",
  //     },
  //   ],
  // },
};

export default nextConfig;
