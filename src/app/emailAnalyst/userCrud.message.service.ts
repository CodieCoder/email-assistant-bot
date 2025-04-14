import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './entities/message.entity';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';

@Injectable()
export class UserCrudMessageService extends TypeOrmCrudService<MessageEntity> {
  constructor(
    @InjectRepository(MessageEntity) repo: Repository<MessageEntity>,
  ) {
    super(repo);
  }

  async getMany(
    req: any,
    relations: string[] = [],
    query: any = {},
  ): Promise<MessageEntity[]> {
    const userId = req?.user?.id;
    if (!userId) {
      throw new UnauthorizedException({ description: 'Invalid user' });
    }

    query.where = { ...(query.where || {}), userId };
    return super.getMany(req, relations, query);
  }
}
