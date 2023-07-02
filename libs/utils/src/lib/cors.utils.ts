type CorsData = {
  origin: string;
  methods: string;
  headers: string;
};

export function corsRes(response: Response, corsData: CorsData) {
  const { origin, methods, headers } = corsData;
  response.headers.append('Access-Control-Allow-Origin', origin);
  response.headers.append('Access-Control-Allow-Methods', methods);
  response.headers.append('Access-Control-Allow-Headers', headers);
  response.headers.append('Access-Control-Allow-Credentials', 'true');
  return response;
}
