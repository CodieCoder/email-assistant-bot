import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtUserPayload } from '../user';

export const GetUserFromRequest = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as IJwtUserPayload;
  },
);
