import { Controller, UseGuards, UseInterceptors } from '@nestjs/common';
import { Crud } from '@dataui/crud';
import { MessageDtoClass } from './dtos/message.dto';
import { UserCrudMessageService } from './userCrud.message.service';
import { COMMON_CRUD_OPTIONS } from 'src/lib/constants';
import { AuthGuard } from '../auth/auth.guard';
import { UserFilterInterceptor } from 'src/lib/interceptors/userFilterInterceptor';

@UseGuards(AuthGuard)
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
      company: { eager: true },
    },
  },
})
@Controller('user/messages')
export class MessageUserCrudController {
  constructor(public service: UserCrudMessageService) {}
}
