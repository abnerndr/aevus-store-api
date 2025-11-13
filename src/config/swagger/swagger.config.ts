import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, type OpenAPIObject } from '@nestjs/swagger';
import { CONFIG } from 'src/shared/constants/env';

export class SwaggerConfig {
  public initialize(app: INestApplication, path: string): void {
    const document = this.createDocument(app);
    SwaggerModule.setup(path, app, document);
  }

  private createConfig(): Omit<OpenAPIObject, 'paths'> {
    return new DocumentBuilder()
      .setTitle(`${CONFIG.APP_NAME} API`)
      .setDescription(CONFIG.APP_DESCRIPTION)
      .setVersion(CONFIG.VERSION)
      .addBearerAuth()
      .build();
  }

  private createDocument(app: INestApplication): OpenAPIObject {
    const config = this.createConfig();
    return SwaggerModule.createDocument(app, config);
  }
}
