import 'dotenv/config';
import { description, name, version } from 'package.json';

import { AppConfigProps } from 'src/shared/types/env';

const APP_NAME = typeof name === 'string' ? name : 'Nest Fastify Base';
const APP_DESCRIPTION = typeof description === 'string' ? description : 'Nest Fastify Base API';
const VERSION = typeof version === 'string' ? version : '1.0.0';

export const CONFIG: AppConfigProps = {
  APP_NAME,
  APP_DESCRIPTION,
  VERSION,
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  CORS_ORIGIN: process.env.FRONTEND_URL ?? '*',
  DATABASE_URL: process.env.DATABASE_URL || '',
  MAIL: {
    API_KEY: process.env.SENDGRID_API_KEY || '',
    FROM: process.env.SENDGRID_FROM || '',
    NAME: process.env.SENDGRID_FROM_NAME || '',
  },
  JWT: {
    SECRET: process.env.JWT_SECRET || '',
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
    EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN) || 3600,
    REFRESH_EXPIRES_IN: Number(process.env.JWT_REFRESH_EXPIRES_IN) || 86400,
  },
  ADMIN: {
    EMAIL: process.env.ADMIN_EMAIL || '',
    PASSWORD: process.env.ADMIN_PASSWORD || '',
  },
  CLOUDFLARE_R2: {
    ENDPOINT: process.env.CLOUDFLARE_R2_ENDPOINT || '',
    ACCESS_KEY: process.env.CLOUDFLARE_R2_ACCESS_KEY || '',
    SECRET_KEY: process.env.CLOUDFLARE_R2_SECRET_KEY || '',
    BUCKET_NAME: process.env.CLOUDFLARE_R2_BUCKET_NAME || '',
    PUBLIC_URL: process.env.CLOUDFLARE_R2_PUBLIC_URL || '',
  },
  STRIPE: {
    SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
    WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
    API_VERSION: process.env.STRIPE_API_VERSION || '',
  },
};
