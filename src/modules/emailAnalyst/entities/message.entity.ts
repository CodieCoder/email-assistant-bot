import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/lib/entity/entity.base';
import { IAITagReportObject } from 'src/modules/llm/dtos/llm.dto';
import { SenderEntity } from 'src/modules/sender/entities/sender.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { DomainEntity } from 'src/modules/domain/domain.entity';

@Entity()
export class MessageEntity extends BaseEntity {
  @Column({ nullable: false })
  emailId: string;

  @Column({ nullable: true })
  subject: string;

  @Column({ default: false })
  isProcessed: boolean;

  @Column({ nullable: true })
  summary: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  tags: IAITagReportObject;

  @ManyToOne(() => DomainEntity, (domain) => domain.messages, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'domainId' })
  domain: DomainEntity;

  @Column({ type: 'uuid', nullable: true })
  domainId: string;

  @ManyToOne(() => SenderEntity, (sender) => sender.messages, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'senderId' })
  sender: SenderEntity;

  @Column({ type: 'uuid', nullable: true })
  senderId: string;

  @ManyToOne(() => UserEntity, (user) => user.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column({ type: 'uuid', nullable: false })
  userId: string;
}
