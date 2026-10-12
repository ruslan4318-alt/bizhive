/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fxdasckajstwfvtfdmcl.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/internal',
        destination: '/dashboard/projects',
        permanent: false,
      },
      {
        source: '/internal/projects',
        destination: '/dashboard/projects',
        permanent: false,
      },
      {
        source: '/internal/brands',
        destination: '/dashboard/brands',
        permanent: false,
      },
      {
        source: '/internal/settings',
        destination: '/dashboard/settings',
        permanent: false,
      },
      {
        source: '/internal/services/:path*',
        destination: '/dashboard/projects',
        permanent: false,
      },
      {
        source: '/internal/hr/:path*',
        destination: '/dashboard',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
