import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CloudflareModule } from './externals/cloudflare/cloudflare.module';
import { MailModule } from './externals/mail/mail.module';
import { AuthModule } from './modules/auth/auth.module';
import { BrandsModule } from './modules/brands/brands.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { FeaturesModule } from './modules/features/features.module';
import { SpecificationsModule } from './modules/specifications/specifications.module';
import { FactoriesModule } from './modules/factories/factories.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { ProductsModule } from './modules/products/products.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { UploadsModule } from './modules/uploads/uploads.module';

@Module({
  imports: [
    PrismaModule,
    CloudflareModule,
    AuthModule,
    MailModule,
    UsersModule,
    RolesModule,
    BrandsModule,
    CategoriesModule,
    FeaturesModule,
    SpecificationsModule,
    FactoriesModule,
    SuppliersModule,
    ProductsModule,
    UploadsModule,
  ],
})
export class AppModule {}
