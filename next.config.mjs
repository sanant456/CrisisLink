import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Required for Cloud Run Docker deployment
  turbopack: {},        // Silence Turbopack/webpack conflict from next-pwa
};

export default withPWA(nextConfig);

