import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { BaseEntity } from 'src/lib/entity/entity.base';

@Entity('user_email_account_configs')
export class EmailAccountEntity extends BaseEntity {
  @Column({ nullable: true })
  authToken: string;

  @Column({ nullable: true })
  apiKey: string;

  @Column({ nullable: true })
  imapHost: string;

  @Column({ nullable: true })
  imapPort: number;

  @Column({ nullable: true })
  imapUsername: string;

  @Column({ nullable: true })
  imapPassword: string;

  @Column({ nullable: true, default: false })
  imapUseSSL: boolean;

  @Column({ nullable: true })
  provider: string; // e.g., Gmail, Outlook, etc.

  @Column({ nullable: true })
  description: string; // Optional description for the account

  @Column({ type: 'uuid' })
  userId: string;
  @ManyToOne(() => UserEntity, (user) => user.emailConfigs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
