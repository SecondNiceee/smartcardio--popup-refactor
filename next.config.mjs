/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: false,
  poweredByHeader: false,
  generateEtags: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
