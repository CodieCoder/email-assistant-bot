import { BaseEntity } from 'src/lib/entity/entity.base';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Entity()
export class TelegramAccountEntity extends BaseEntity {
  @Column({ nullable: false })
  userId: string;

  @OneToOne(() => UserEntity, (user) => user.telegramAccount, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserEntity;

  @Column({ nullable: false })
  telegramChatId: string;

  @Column({ nullable: true })
  telegramUsername?: string;

  @Column({ nullable: false, default: false })
  isLinked: boolean;
}
