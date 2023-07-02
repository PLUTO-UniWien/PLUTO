//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

// Validate schema on build as suggested by https://env.t3.gg/docs/nextjs
import('./src/env.mjs')
  .then(({ env }) => {
    console.log('Loaded and validated environment variables');
    console.log(Object.keys(env));
  })
  .catch((err) => {
    console.error('Failed to load environment variables', err);
    process.exit(1);
  });

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

module.exports = composePlugins(...plugins)(nextConfig);
