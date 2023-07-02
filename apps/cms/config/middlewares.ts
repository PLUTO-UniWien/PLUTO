export default ({ env }) => {
  const devPorts = env('ORIGIN_DEV_PORTS', '1337')
    .split(',')
    .map((port) => parseInt(port, 10));
  const devOrigins = devPorts.map((port) => `http://localhost:${port}`);
  const prodDomains = env('ORIGIN_PROD_DOMAINS', '').split(',');
  const prodOrigins = prodDomains.flatMap((domain) => [
    `http://${domain}`,
    `https://${domain}`,
  ]);
  return [
    'strapi::errors',
    'strapi::security',
    {
      name: 'strapi::cors',
      config: {
        headers: '*',
        origin: [...devOrigins, ...prodOrigins],
      },
    },
    'strapi::poweredBy',
    'strapi::logger',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ];
};
