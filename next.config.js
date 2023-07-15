/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    images: {
        unoptimized: true
    }
  },
  trailingSlash: true,
}

module.exports = nextConfig
