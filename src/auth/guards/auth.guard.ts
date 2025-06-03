import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload, RequestWithUser } from '../types/auth.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authorizationHeader = request.headers.authorization;
    const token = authorizationHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const tokenPayload = await this.jwtService.verifyAsync<JwtPayload>(token);

      request.user = {
        userId: tokenPayload.sub,
        email: tokenPayload.email,
      };
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Token verification failed:', error.message);
      } else {
        console.error('Token verification failed:', String(error));
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
