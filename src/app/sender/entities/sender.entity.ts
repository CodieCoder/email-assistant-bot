import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/lib/entity/entity.base';
import { TAISenderTagObject } from '../dtos/sender.dto';
import { MessageEntity } from '../../emailAnalyst/entities/message.entity';

@Entity()
export class SenderEntity extends BaseEntity {
  @Column()
  email: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  summary: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'json', default: {} })
  tags?: TAISenderTagObject;

  @OneToMany(() => MessageEntity, (email) => email.sender)
  messages: MessageEntity[];
}
