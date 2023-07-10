export default ({ env }) => {
  const devPorts = env('ORIGIN_DEV_PORTS', '1337')
    .split(',')
    .map((port) => parseInt(port, 10));
  const devOrigins: string[] = devPorts.map(
    (port) => `http://localhost:${port}`
  );
  const prodDomains = env('ORIGIN_PROD_DOMAINS', '').split(',');
  const prodOrigins: string[] = prodDomains.flatMap((domain) => [
    `http://${domain}`,
    `https://${domain}`,
  ]);
  const allowedOrigins = [...devOrigins, ...prodOrigins];
  console.log('Accepting CORS from:', allowedOrigins);
  return [
    'strapi::errors',
    'strapi::security',
    {
      name: 'strapi::cors',
      config: {
        headers: '*',
        origin: allowedOrigins,
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
