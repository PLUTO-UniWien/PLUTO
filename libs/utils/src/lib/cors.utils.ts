type CorsData = {
  origin: string;
  methods: string;
  headers: string;
};

export function corsRes(response: Response, corsData: CorsData) {
  const { origin, methods, headers } = corsData;
  response.headers.set('Access-Control-Allow-Origin', origin);
  response.headers.set('Access-Control-Allow-Methods', methods);
  response.headers.set('Access-Control-Allow-Headers', headers);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
}
