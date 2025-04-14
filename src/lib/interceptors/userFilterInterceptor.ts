import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { IJwtUserPayload } from 'src/app/user/dtos/user.dto';

@Injectable()
export class UserFilterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context
      .switchToHttp()
      .getRequest<{ [x: string]: any; user: IJwtUserPayload }>();
    if (req.user && req.query) {
      req.query.filter = `userId||eq||${req.user.id}`;
    }
    return next.handle();
  }
}
