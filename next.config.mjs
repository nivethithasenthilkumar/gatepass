/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const isVercel = process.env.VERCEL === '1';
    const fallbackUrl = isVercel ? 'https://gatepass-api-mock.vercel.app' : 'http://localhost:8080';
    return [
      {
        source: '/server/:path*',
        destination: `${process.env.BACKEND_URL || fallbackUrl}/:path*`,
      },
    ]
  },
}

export default nextConfig
