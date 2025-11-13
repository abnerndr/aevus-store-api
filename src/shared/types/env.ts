export type AppConfigProps = {
  PORT: number;
  VERSION: string;
  APP_NAME: string;
  APP_DESCRIPTION: string;
  NODE_ENV: string;
  CORS_ORIGIN: string;
  DATABASE_URL: string;
  MAIL: MailConfig;
  GOOGLE_OAUTH: GoogleOAuthConfig;
  JWT: JWTConfig;
  ADMIN: AdminConfig;
};

type MailConfig = {
  API_KEY: string;
  FROM: string;
  NAME: string;
};

type GoogleOAuthConfig = {
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  CALLBACK_URL: string;
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
