/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Tambahkan bagian ini untuk mengabaikan pemeriksaan ESLint saat build Vercel
  eslint: {
    ignoreDuringBuilds: true,
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