import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use Webpack for production builds (Turbopack output breaks on older Safari/iPad)
  bundlePagesRouterDependencies: true,
};

export default nextConfig;
