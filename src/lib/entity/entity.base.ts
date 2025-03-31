import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class EntityBase {
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
}
