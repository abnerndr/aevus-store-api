import { CONFIG } from 'src/shared/constants/env';

export class CorsConfig {
  public static cors() {
    return {
      origin: [CONFIG.CORS_ORIGIN],
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
