import { composePlugins, withNx } from '@nx/next';
// Validate schema on build as suggested by https://env.t3.gg/docs/nextjs
import { env } from './src/env.mjs';
// Include PM2 config so that it is copied over to the dist folder when building the app
import './ecosystem.config.js';

console.log('Loaded and validated environment variables');
console.log(Object.keys(env));

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

export default composePlugins(...plugins)(nextConfig);
