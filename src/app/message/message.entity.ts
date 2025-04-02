import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { SenderEntity } from 'src/app/sender';
import { BaseEntity } from 'src/lib/entity/entity.base';
import { IAITagReportObject } from 'src/app/llm/llm.dto';
import { UserEntity } from '../user';
import { CompanyEntity } from 'src/entities';

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

  @ManyToOne(() => CompanyEntity, (company) => company.messages, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'companyId' })
  company: CompanyEntity;

  @Column({ type: 'uuid', nullable: true })
  companyId: string;

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
