import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  private readonly logger: Logger = new Logger(AuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('Unauthorized user');
      }
      const tokenData = this.authService.validateToken(token, 'access');
      request.user = tokenData;
      return true;
    } catch (error) {
      this.logger.error(`Error occured on Auth Guard: ${error}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new UnauthorizedException('Unauthorized user');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
