import { EntityBase } from 'src/lib/entity/entity.base';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { MessageEntity } from '../message';

@Entity()
export class UserEntity extends EntityBase {
  @Index()
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  summary: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false, default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  verificationToken: string;

  @OneToMany(() => MessageEntity, (message) => message.user, { cascade: true })
  messages: MessageEntity[];
}
