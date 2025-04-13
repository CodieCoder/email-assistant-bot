import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Index()
  @CreateDateColumn()
  createdAt?: Date;

  @Index()
  @UpdateDateColumn()
  updatedAt?: Date;

  @Index()
  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ type: 'boolean', default: true })
  isEnabled?: boolean;
}
