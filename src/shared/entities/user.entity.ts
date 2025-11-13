import { createId } from '@paralleldrive/cuid2';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v7 as uuid } from 'uuid';
import { Role } from './role.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryColumn('uuid')
  id = uuid();

  @Column({ unique: true, nullable: false, type: 'varchar', default: () => createId() })
  code: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ name: 'google_id', nullable: true })
  googleId: string;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'verification_token', nullable: true })
  verificationToken: string;

  @Column({ name: 'reset_password_token', nullable: true })
  resetPasswordToken: string;

  @Column({ name: 'reset_password_expires', nullable: true })
  resetPasswordExpires: Date;

  @Column({ name: 'magic_link_token', nullable: true })
  magicLinkToken: string;

  @Column({ name: 'magic_link_expires', nullable: true })
  magicLinkExpires: Date;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles: Role[];

  @CreateDateColumn({ name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
