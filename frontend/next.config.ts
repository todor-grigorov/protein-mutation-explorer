import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Required for Molstar — `canvas` is a Node.js package and should stay external on the server
  serverExternalPackages: ['canvas'],
}

export default nextConfig
