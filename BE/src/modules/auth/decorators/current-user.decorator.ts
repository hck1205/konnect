import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { RequestUser } from '../types/jwt-payload.type';

/**
 * 인증된 사용자를 핸들러 인자로 받는다.
 *
 * 가드가 `request.user` 에 넣어 둔 값을 꺼낼 뿐이다 — 여기서 토큰을 파싱하지 않는다.
 * 파싱이 두 곳에 있으면 한쪽만 고치는 사고가 난다.
 *
 * `@Public()` 라우트에서는 `undefined` 일 수 있다. 비회원도 읽을 수 있는 목록에서
 * "내가 누른 리액션"을 함께 내려주려면 그 경우를 다뤄야 한다.
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestUser | undefined => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: RequestUser }>();
    return request.user;
  },
);
