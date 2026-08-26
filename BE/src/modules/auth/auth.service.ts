import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { newId } from '../../common';
import { APP_CONFIG, type AppConfigGetter } from '../../config';
import type { JwtPayload, RequestUser } from './types/jwt-payload.type';

export interface AuthResult {
  token: string;
  user: RequestUser;
}

/**
 * 인증 서비스.
 *
 * 지금은 **테스트 로그인만** 있다 — 닉네임을 주면 새 사용자 id 를 만들어 토큰을 준다.
 * 사용자 저장소가 없으므로 같은 닉네임으로 다시 로그인해도 **다른 사람**이 된다.
 * 이 성질은 OAuth 도입 시 사라진다(제공자 id 로 동일인을 식별한다).
 *
 * 저장소가 생기면 이 서비스의 인터페이스는 유지하고 내부만 바뀐다 —
 * 컨트롤러와 가드는 영향을 받지 않는다.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    @Inject(APP_CONFIG) private readonly getConfig: AppConfigGetter,
  ) {}

  testLogin(nickname: string): AuthResult {
    const user: RequestUser = { id: newId(), nickname: nickname.trim() };
    return { token: this.sign(user), user };
  }

  private sign(user: RequestUser): string {
    const payload: JwtPayload = { sub: user.id, nickname: user.nickname };
    return this.jwt.sign(payload, {
      // jsonwebtoken 은 expiresIn 을 `ms` 라이브러리의 템플릿 리터럴 타입으로 좁혀 둔다.
      // 우리 설정은 환경변수에서 오는 자유 문자열이라 그 타입을 만족시킬 수 없다 —
      // 여기서 경계를 넘긴다. 값이 잘못되면 jsonwebtoken 이 부팅 직후 던지므로
      // 조용히 틀린 만료 시간이 적용되는 일은 없다.
      expiresIn: this.getConfig().jwtExpiresIn as `${number}d`,
    });
  }
}
