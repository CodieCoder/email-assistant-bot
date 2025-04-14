import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './entities/message.entity';
import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import {
  CrudRequest,
  GetManyDefaultResponse,
  QueryFilterOption,
} from '@dataui/crud';
import { IJwtUserPayload } from '../user/dtos/user.dto';

@Injectable()
export class UserCrudMessageService extends TypeOrmCrudService<MessageEntity> {
  constructor(
    @InjectRepository(MessageEntity) repo: Repository<MessageEntity>,
  ) {
    super(repo);
  }

  async getMany(
    req: CrudRequest<{ user: IJwtUserPayload }, any>,
  ): Promise<GetManyDefaultResponse<MessageEntity> | MessageEntity[]> {
    const userId = req?.auth?.user?.id;

    if (!userId) {
      throw new UnauthorizedException({ description: 'Invalid user' });
    }

    if (!req.options?.query) {
      return super.getMany(req);
    }

    const userFilter: QueryFilterOption = {
      field: 'userId',
      operator: '$eq' as any,
      value: userId,
    };

    req.options.query.filter = [
      ...(Array.isArray(req.options.query.filter)
        ? req.options.query.filter.filter(
            (filter): filter is any => filter !== undefined,
          )
        : [req.options.query.filter].filter(
            (filter): filter is any => filter !== undefined,
          )),
      userFilter,
    ];
    return super.getMany(req);
  }
}
