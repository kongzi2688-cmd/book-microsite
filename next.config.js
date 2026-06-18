/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
  output: 'export',

  basePath: '/book-microsite',
  assetPrefix: '/book-microsite/',

  images: {
    unoptimized: true,
  },

  reactStrictMode: true,

  experimental: {
    turbo: {
      root: path.resolve(__dirname),
    },
  },
};

module.exports = nextConfig;