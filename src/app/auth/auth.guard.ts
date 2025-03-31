import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { getEnvVar } from 'src/config/global';
import { IS_PUBLIC_KEY } from './public';
import { IJwtPayload, IJwtUserPayload } from '../user';
import { CustomLoggerService } from 'src/lib/logger';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly logger: CustomLoggerService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if the route is public
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authorization token is missing');
    }

    try {
      // Verify the token
      const payload: IJwtPayload = await this.jwtService.verifyAsync(token, {
        secret: getEnvVar('JWT_SECRET'),
      });

      // Attach the user to the request object
      const user: IJwtUserPayload = { id: payload.sub, email: payload.email };

      request['user'] = user;
    } catch (error) {
      const message = 'Invalid or expired token';
      this.logger.log({
        message,
        context: this.canActivate.name,
        trace: error,
      });
      throw new UnauthorizedException({ message });
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
