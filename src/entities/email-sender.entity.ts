import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MessageEntity } from './email.entity';
import { EntityBase } from 'src/lib/entity/entity.base';

@Entity()
export class Sender extends EntityBase {
  @Column()
  email: string;

  @Column()
  business: string;

  @Column()
  summary: string;

  @Column()
  description: string;

  @Column()
  tag: string;

  @OneToMany(() => MessageEntity, (email) => email.sender)
  messages: MessageEntity[];
}
