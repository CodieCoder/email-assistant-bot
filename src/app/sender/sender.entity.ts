import { Entity, Column, OneToMany } from 'typeorm';
import { MessageEntity } from 'src/app/message';
import { EntityBase } from 'src/lib/entity/entity.base';
import { TAISenderTagObject } from './sender.dto';

@Entity()
export class SenderEntity extends EntityBase {
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
