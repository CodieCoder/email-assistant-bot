import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomLoggerService } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    const now = Date.now();
    this.logger.log({
      message: `Incoming request: ${method} ${url}`,
      context: 'HTTP',
    });

    return next.handle().pipe(
      tap(() =>
        this.logger.log({
          message: `Request completed: ${method} ${url} in ${Date.now() - now}ms`,
          context: 'HTTP',
        }),
      ),
    );
  }
}
