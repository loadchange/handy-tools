import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove custom webpack config that might interfere with Next.js built-in CSS handling
  // The default Next.js webpack config handles fonts and CSS extraction correctly.

  // 优化包导入以减少包大小
  experimental: {
    optimizePackageImports: ['lucide-react', 'crypto-js']
  },
  // Ensure dependent packages are transpiled to avoid compatibility issues
  transpilePackages: ['@radix-ui/react-label', '@radix-ui/react-select'],
};

export default nextConfig;
