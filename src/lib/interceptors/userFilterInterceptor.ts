import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { IJwtUserPayload } from 'src/app/user/dtos/user.dto';

@Injectable()
export class UserFilterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context
      .switchToHttp()
      .getRequest<{ [x: string]: any; user: IJwtUserPayload }>();

    //Todo some one or twos here
    return next.handle();
  }
}
