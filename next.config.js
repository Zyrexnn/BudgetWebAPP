/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    // Enable if you want to use the app directory
    appDir: true,
  },
  // Remove the custom server configuration for now
  async rewrites() {
    return [
      {
        source: '/api/socketio/:path*',
        destination: '/api/socketio/:path*',
      },
    ]
  },
}

module.exports = nextConfig