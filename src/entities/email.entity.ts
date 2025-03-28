import { Entity, Column, ManyToOne } from 'typeorm';
import { Sender } from './email-sender.entity';
import { EntityBase } from 'src/lib/entity/entity.base';
import { IAITagReportObject } from 'src/app/llm/llm.dto';

@Entity()
export class MessageEntity extends EntityBase {
  @Column()
  messageId: string;

  @Column()
  senderId: string;

  @Column()
  processed: boolean;

  @Column()
  summary: string;

  @Column()
  description: string;

  @Column()
  tag: string[];

  @Column({ type: 'json' })
  aiReport: IAITagReportObject;

  @ManyToOne(() => Sender, (sender) => sender.messages)
  sender: Sender;
}
