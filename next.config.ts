import type { NextConfig } from 'next';

// This is a service landing page: it has no server-side data or APIs. Exporting
// every route as static files avoids a serverless function at Netlify, which is
// both faster for callers and removes the source of the production 500.
const nextConfig: NextConfig = {
  output: 'export',
  images: {
    // Netlify serves the responsive source image directly; no Next image API is
    // required for this small, static site.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
