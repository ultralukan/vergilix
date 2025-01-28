import type { NextConfig } from "next";

import createNextIntlPlugin from 'next-intl/plugin';
 

const withNextIntl = createNextIntlPlugin(
  './src/intl-request.ts'
);

const nextConfig: NextConfig = {
  sassOptions: {
    prependData: `@import "src/app/mixins.scss"; @import "src/app/variables.scss";`,
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/,
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, 
        use: ['@svgr/webpack'],
      },
    )
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ['mui-tel-input']
};

export default withNextIntl(nextConfig);
