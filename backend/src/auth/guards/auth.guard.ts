import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { getAuth } from '../auth.config';
import { AuthenticatedRequest } from '../../common/types/request.type';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<AuthenticatedRequest>();
    const response = ctx.getResponse<Response>();

    const auth = getAuth();
    const session = await auth.api.getSession({
      headers: this.buildHeaders(request),
    });

    if (!session?.user) {
      throw new UnauthorizedException('Not authenticated');
    }

    request.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };

    return true;
  }

  private buildHeaders(request: Request): Headers {
    const headers = new Headers();
    const cookieHeader = request.headers['cookie'];
    if (cookieHeader) {
      headers.set('cookie', cookieHeader);
    }
    const authHeader = request.headers['authorization'];
    if (authHeader) {
      headers.set('authorization', authHeader);
    }
    return headers;
  }
}
