/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActionsBodySizeLimit: '128mb',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.blob.vercel-storage.com',
      },
    ],
  },
}

export default nextConfig
