import { BaseEntity } from 'src/lib/entity/entity.base';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { MessageEntity } from '../emailAnalyst';
import { UserAccountTypeEnum } from './user.dto';
import { EmailAccountEntity } from '../emailAccount/email-account.entity';

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

  @OneToMany(() => EmailAccountEntity, (emailConfig) => emailConfig.user)
  emailConfigs: EmailAccountEntity[];

  @OneToMany(() => MessageEntity, (message) => message.user, { cascade: true })
  messages: MessageEntity[];
}
