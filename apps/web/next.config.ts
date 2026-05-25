import { loadRootEnv } from '@iva360/shared/env'

loadRootEnv()

import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const cmsInternalUrl = process.env.CMS_INTERNAL_URL ?? 'http://localhost:3333'
const cmsImagePort = new URL(cmsInternalUrl).port || '3333'

const nextConfig: NextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.resolve(dirname, '../..'),
  devIndicators: false,
  reactStrictMode: true,
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: '/admin/:path*',
        destination: `${cmsInternalUrl}/admin/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${cmsInternalUrl}/api/:path*`,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: cmsImagePort,
        pathname: '/api/media/file/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: cmsImagePort,
        pathname: '/api/media/file/**',
      },
    ],
  },
  transpilePackages: ['@iva360/shared'],
  turbopack: {
    root: path.resolve(dirname, '../..'),
  },
}

export default nextConfig
