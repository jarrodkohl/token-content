/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{
      hostname:'s.gravatar.com',
      hostname: '*.googleusercontent.com'
    }],

    }

  }

module.exports = nextConfig
