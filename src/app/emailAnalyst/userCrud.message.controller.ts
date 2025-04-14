import { Controller, UseGuards } from '@nestjs/common';
import { Crud } from '@dataui/crud';
import { MessageDtoClass } from './dtos/message.dto';
import { UserCrudMessageService } from './userCrud.message.service';
import { COMMON_CRUD_OPTIONS } from 'src/lib/constants';
import { AuthGuard } from '../auth/auth.guard';

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
@UseGuards(AuthGuard)
@Controller('user/messages')
export class MessageUserCrudController {
  constructor(public service: UserCrudMessageService) {}
}
