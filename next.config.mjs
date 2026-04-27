import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable in dev mode to avoid sw caching issues
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

export default withPWA(nextConfig);
