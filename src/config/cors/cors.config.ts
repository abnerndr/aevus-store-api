import { CONFIG } from 'src/shared/constants/env';

export class CorsConfig {
  public static cors() {
    // Suporta múltiplas origens separadas por vírgula (ex: http://localhost:3000,http://localhost:4000)
    const origins = CONFIG.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
    return {
      origin: origins.length > 0 ? origins : true,
      allowedHeaders: [
        'Access-Control-Allow-Origin',
        'Origin',
        'X-Requested-With',
        'Accept',
        'Content-Type',
        'Authorization',
      ],
      exposedHeaders: 'Authorization',
      credentials: true,
      methods: ['GET', 'PUT', 'OPTIONS', 'POST', 'DELETE'],
    };
  }
}
