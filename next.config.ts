import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Enable compression
  compress: true,
  // Generate ETags for caching
  generateEtags: true,
  // Optimize production builds
  poweredByHeader: false,
  // Enable React strict mode for better development
  reactStrictMode: true,
  // The tools page was replaced by the certificates page, keep old links working
  async redirects() {
    return [
      {
        source: "/tools",
        destination: "/certificates",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
