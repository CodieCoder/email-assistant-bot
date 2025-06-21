import { MessageEntity } from 'src/modules/emailAnalyst/entities/message.entity';
import { BaseEntity } from 'src/lib/entity/entity.base';
import { TAISenderTagObject } from 'src/modules/sender/dtos/sender.dto';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class DomainEntity extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column()
  emailDomain: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  summary?: string;

  @Column({ type: 'json', default: {} })
  tags: TAISenderTagObject;

  @OneToMany(() => MessageEntity, (message) => message.domain)
  messages: MessageEntity[];
}
