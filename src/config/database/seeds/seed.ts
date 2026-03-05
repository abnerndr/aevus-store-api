import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { seedRolesAndPermissions } from './role.seed';

async function runSeeds() {
  const prisma = new PrismaClient({
    log: ['query', 'error'],
  });

  try {
    await prisma.$connect();
    console.log('📦 Database connected successfully');

    await seedRolesAndPermissions(prisma);

    await prisma.$disconnect();
    console.log('✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

runSeeds();
