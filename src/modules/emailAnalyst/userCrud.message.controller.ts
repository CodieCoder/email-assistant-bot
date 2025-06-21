import { Controller, UseInterceptors } from '@nestjs/common';
import { Crud, CrudAuth } from '@dataui/crud';
import { MessageDtoClass } from './dtos/message.dto';
import { UserCrudMessageService } from './userCrud.message.service';
import { COMMON_CRUD_OPTIONS } from 'src/lib/constants';
import { UserFilterInterceptor } from 'src/lib/interceptors/userFilterInterceptor';
import { IJwtUserPayload } from '../user/dtos/user.dto';

@UseInterceptors(UserFilterInterceptor)
@Crud({
  ...COMMON_CRUD_OPTIONS,
  model: {
    type: MessageDtoClass,
  },
  routes: {
    only: ['getOneBase', 'getManyBase'],
  },
  query: {
    ...COMMON_CRUD_OPTIONS.query,
    join: {
      sender: { eager: true, select: true },
      domain: { eager: true },
    },
  },
})
@CrudAuth({
  property: 'user',
  filter: (user: IJwtUserPayload) => {
    return {
      userId: user.id,
      isEnabled: true,
    };
  },
})
@Controller('user/messages')
export class MessageUserCrudController {
  constructor(public service: UserCrudMessageService) {}
}
