import * as cors from '@fastify/cors';
import * as multipart from '@fastify/multipart';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { CorsConfig } from './config/cors/cors.config';
import { FilesConfig } from './config/files/files.config';
import { SwaggerConfig } from './config/swagger/swagger.config';
import { CONFIG } from './shared/constants/env';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const fastifyInstance = app.getHttpAdapter().getInstance();
  await fastifyInstance.register(multipart, FilesConfig.multipart());
  await fastifyInstance.register(cors, CorsConfig.cors());
  const swaggerConfig = new SwaggerConfig();
  swaggerConfig.initialize(app, '/docs');
  await app.listen(CONFIG.PORT, '0.0.0.0');
}
void bootstrap();
