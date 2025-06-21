import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/lib/entity/entity.base';
import { cryptoTransformer } from 'src/lib/transformers/cryptoTransformer';
import {
  EmailAccountConfigType,
  EmailAccountProvider,
} from '../dtos/email-account.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Entity('user_email_account_configs')
export class EmailAccountEntity extends BaseEntity {
  @Column({ nullable: true })
  apiKey: string;

  @Column({ nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true, type: 'timestamptz' })
  tokenExpiresAt: Date;

  @Column({ nullable: true })
  imapHost: string;

  @Column({ nullable: true })
  imapPort: number;

  @Column({ nullable: true })
  imapUsername: string;

  @Column({ nullable: true, transformer: cryptoTransformer })
  imapPassword: string;

  @Column({ type: 'boolean', default: false })
  imapSecure: boolean;

  @Column({
    type: 'enum',
    enum: EmailAccountProvider,
    default: EmailAccountProvider.OTHER,
  })
  provider: EmailAccountProvider;

  @Column({ nullable: true })
  otherProvider?: string;

  @Column({
    type: 'enum',
    enum: EmailAccountConfigType,
    default: EmailAccountConfigType.IMAP, // Default config type to IMAP
  })
  configType: EmailAccountConfigType; // The new field for config type

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'disconnected' })
  connectionStatus: 'connected' | 'disconnected' | 'error';

  @Column({ nullable: true })
  lastSyncAt: Date;

  @Column({ nullable: true })
  lastError: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.emailConfigs, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;
}
