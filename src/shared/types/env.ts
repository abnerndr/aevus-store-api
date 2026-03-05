export type AppConfigProps = {
  PORT: number;
  VERSION: string;
  APP_NAME: string;
  APP_DESCRIPTION: string;
  NODE_ENV: string;
  CORS_ORIGIN: string;
  DATABASE_URL: string;
  MAIL: MailConfig;
  JWT: JWTConfig;
  ADMIN: AdminConfig;
  CLOUDFLARE_R2: CloudflareR2Config;
  STRIPE: StripeConfig;
};

type MailConfig = {
  API_KEY: string;
  FROM: string;
  NAME: string;
};

type JWTConfig = {
  SECRET: string;
  REFRESH_SECRET: string;
  EXPIRES_IN: number;
  REFRESH_EXPIRES_IN: number;
};

type AdminConfig = {
  EMAIL: string;
  PASSWORD: string;
};

type CloudflareR2Config = {
  ENDPOINT: string;
  ACCESS_KEY: string;
  SECRET_KEY: string;
  BUCKET_NAME: string;
  PUBLIC_URL: string;
};

type StripeConfig = {
  SECRET_KEY: string;
  WEBHOOK_SECRET: string;
  API_VERSION: string;
};
