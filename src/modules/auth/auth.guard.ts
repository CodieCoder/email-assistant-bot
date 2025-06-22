import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { getEnvVar } from 'src/config/global';
import { IS_PUBLIC_KEY } from './public';
import { IJwtPayload, IJwtUserPayload } from '../user/dtos/user.dto';
import { GLOBAL_ERRORS } from 'src/lib/constants/errors';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is public
    const isPublic: boolean = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(GLOBAL_ERRORS.AUTH_ERRORS.UNAUTHORIZED);
    }

    try {
      // Verify the token
      const payload: IJwtPayload = await this.jwtService.verifyAsync(token, {
        secret: getEnvVar('JWT_SECRET'),
      });

      // Attach the user to the request object
      const user: IJwtUserPayload = { id: payload.sub, email: payload.email };

      request['user'] = user;
    } catch {
      const message = 'Invalid or expired token';

      this.logger.log({
        message,
        context: this.canActivate.name,
      });
      throw new UnauthorizedException(GLOBAL_ERRORS.AUTH_ERRORS.UNAUTHORIZED);
    }

    return true;
  }

  /**
   * Extracts the Bearer token from the Authorization header.
   * @param request - The incoming HTTP request.
   * @returns The token string or undefined if not present.
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers.authorization;
    if (!authorization) {
      return undefined;
    }

    const [type, token] = authorization.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
