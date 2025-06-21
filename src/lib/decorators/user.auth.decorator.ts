import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtUserPayload } from '../../modules/user/dtos/user.dto';

interface RequestWithUser {
  user: IJwtUserPayload;
}

export const UserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
