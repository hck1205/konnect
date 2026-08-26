import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { APP_CONFIG, type AppConfigGetter } from '../../config';
import { UsersService } from '../users';
import type { JwtPayload, RequestUser } from './types/jwt-payload.type';

export interface AuthResult {
  token: string;
  user: RequestUser;
}

/**
 * 인증 서비스.
 *
 * 지금은 **테스트 로그인만** 있다 — 닉네임을 주면 사용자를 만들고 토큰을 준다.
 * 제공자 id 로 동일인을 식별할 경로가 없어 같은 닉네임으로 다시 로그인해도
 * **다른 사람**이 된다. 이 성질은 OAuth 도입 시 사라진다.
 *
 * 저장소가 생기면 이 서비스의 인터페이스는 유지하고 내부만 바뀐다 —
 * 컨트롤러와 가드는 영향을 받지 않는다.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly jwt: JwtService,
    private readonly users: UsersService,
    @Inject(APP_CONFIG) private readonly getConfig: AppConfigGetter,
  ) {}

  /**
   * 사용자를 **저장하고** 토큰을 준다.
   *
   * 저장이 필요한 이유: 질문·답변의 `authorId` 가 사용자를 참조한다.
   * 저장하지 않으면 Prisma 모드에서 질문 생성이 외래키 위반으로 실패한다 —
   * 인메모리에서는 통과하고 DB 에서만 깨지는, 가장 늦게 발견되는 종류의 버그다.
   */
  async testLogin(nickname: string): Promise<AuthResult> {
    const created = await this.users.create(nickname);
    const user: RequestUser = { id: created.id, nickname: created.nickname };
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
