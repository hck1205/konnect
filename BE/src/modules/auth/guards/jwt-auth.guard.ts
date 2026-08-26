import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../../common';
import type { JwtPayload, RequestUser } from '../types/jwt-payload.type';

/**
 * 전역 JWT 가드.
 *
 * 정책: **Read 만 비회원 공개**다. 그래서 기본이 "인증 필요"이고,
 * 공개 라우트에 `@Public()` 을 붙인다 — 반대로 하면 새 엔드포인트를 만들 때마다
 * 가드를 붙이는 걸 잊어 **의도치 않게 공개**된다.
 * → docs/30-architecture/03-api-conventions.md
 *
 * `@Public()` 라우트에서도 토큰이 있으면 **해석은 한다.** 비회원도 볼 수 있는
 * 목록에서 로그인 사용자에게는 "내가 누른 리액션"을 함께 내려주기 위해서다.
 * 토큰이 깨졌으면 공개 라우트에서는 조용히 무시한다(읽기를 막을 이유가 없다).
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: RequestUser }>();

    const token = extractBearer(request.headers.authorization);

    if (token) {
      try {
        const payload = this.jwt.verify<JwtPayload>(token);
        request.user = { id: payload.sub, nickname: payload.nickname };
      } catch {
        // 공개 라우트면 무시하고 비회원으로 진행한다
        if (!isPublic)
          throw new UnauthorizedException('Invalid or expired token');
      }
    }

    if (isPublic) return true;
    if (!request.user)
      throw new UnauthorizedException('Authentication required');
    return true;
  }
}

/** `Authorization: Bearer <token>` 에서 토큰만 꺼낸다 */
export function extractBearer(header: string | undefined): string | null {
  if (!header) return null;
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token.trim() || null;
}
