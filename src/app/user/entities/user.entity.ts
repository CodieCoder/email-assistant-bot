import { BaseEntity } from 'src/lib/entity/entity.base';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { UserAccountTypeEnum } from '../dtos/user.dto';
import { MessageEntity } from '../../emailAnalyst/entities/message.entity';
import { EmailAccountEntity } from '../../emailAccount/entities/email-account.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @Index()
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ type: 'enum', enum: UserAccountTypeEnum, nullable: false })
  accountType: UserAccountTypeEnum;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: true })
  summary: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false, default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ type: 'uuid', nullable: true })
  activeConfigId: string;

  @OneToMany(() => EmailAccountEntity, (emailConfig) => emailConfig.user)
  emailConfigs: EmailAccountEntity[];

  @OneToMany(() => MessageEntity, (message) => message.user, { cascade: true })
  messages: MessageEntity[];
}
