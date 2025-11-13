import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { v7 as uuid } from 'uuid';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @PrimaryColumn('uuid')
  id = uuid();

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  permissions: Permission[];
}
