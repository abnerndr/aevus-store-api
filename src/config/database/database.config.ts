import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG } from 'src/shared/constants/env';
import { entities } from '../../shared/entities';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        url: CONFIG.DATABASE_URL,
        entities: entities,
        logging: ['query', 'error'],
        synchronize: CONFIG.NODE_ENV.toLowerCase().includes('development'),
        ssl: CONFIG.NODE_ENV.toLowerCase().includes('production')
          ? { rejectUnauthorized: false }
          : false,
      }),
    }),
    TypeOrmModule.forFeature(entities),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseConfigModule {}
