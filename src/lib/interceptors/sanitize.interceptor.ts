import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PROTECTED_PROPERTIES } from '../constants';

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  //Array of keys we don't want to expose in the response ALWAYS!!!!
  private readonly blacklist = PROTECTED_PROPERTIES;
  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map((data) => this.sanitize(data)));
  }

  private sanitize(data: unknown): unknown {
    if (Array.isArray(data)) {
      return data.map((item) => this.stripFields(item));
    } else {
      return this.stripFields(data);
    }
  }

  private stripFields(obj: unknown): unknown {
    if (!obj || typeof obj !== 'object') return obj;
    const cleanObj = { ...obj };
    for (const key of this.blacklist) {
      delete cleanObj[key];
    }
    return cleanObj;
  }
}
