import { DataSource } from 'typeorm';
import { seedRolesAndPermissions } from './role.seed';

export async function runSeeds(dataSource: DataSource) {
  await seedRolesAndPermissions(dataSource);
}
