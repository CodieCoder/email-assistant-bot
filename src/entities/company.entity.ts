import { BaseEntity } from 'src/lib/entity/entity.base';
import { Column, Entity, OneToMany } from 'typeorm';
import { MessageEntity } from 'src/app/message';
import { TAISenderTagObject } from 'src/app/sender';

@Entity()
export class CompanyEntity extends BaseEntity {
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

  @OneToMany(() => MessageEntity, (message) => message.company)
  messages: MessageEntity[];
}
