import { Inject, Injectable } from '@nestjs/common';
import { newId } from '../../common';
import type { UserRecord } from './entities/user.entity';
import {
  USERS_REPOSITORY,
  type UsersRepository,
} from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY) private readonly repository: UsersRepository,
  ) {}

  findById(id: string): Promise<UserRecord | null> {
    return this.repository.findById(id);
  }

  /**
   * 새 사용자를 만든다.
   *
   * OAuth 가 들어오면 여기는 `findOrCreateByProfile(provider, providerId, …)` 로
   * 바뀐다 — 제공자 id 로 동일인을 찾아야 재로그인 시 같은 계정이 된다.
   * 지금은 그 식별 경로가 없어 **로그인할 때마다 새 사람**이다.
   */
  create(nickname: string): Promise<UserRecord> {
    return this.repository.create({
      id: newId(),
      nickname: nickname.trim(),
      avatarUrl: null,
      role: 'USER',
      createdAt: new Date().toISOString(),
    });
  }
}
