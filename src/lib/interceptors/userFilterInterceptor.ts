import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserFilterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // const req = context.switchToHttp().getRequest<{
    //   [x: string]: unknown;
    //   user: IJwtUserPayload;
    // }>();

    //Todo some one or twos here
    return next.handle();
  }
}
