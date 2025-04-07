import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtUserPayload } from '../../app/user/dtos/user.dto';

export const UserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as IJwtUserPayload;
  },
);
