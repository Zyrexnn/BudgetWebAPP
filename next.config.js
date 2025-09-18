/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
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