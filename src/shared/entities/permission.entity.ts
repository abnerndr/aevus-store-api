import { BaseEntity, Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { v7 as uuid } from 'uuid';
import { Role } from './role.entity';

@Entity('permissions')
export class Permission extends BaseEntity {
  @PrimaryColumn('uuid')
  id = uuid();

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  resource: string;

  @Column()
  action: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
