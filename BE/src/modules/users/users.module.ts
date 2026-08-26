import { Global, Module } from '@nestjs/common';
import { repositoryProvider } from '../../prisma/repository.provider';
import { UsersService } from './users.service';
import {
  USERS_REPOSITORY,
  type UsersRepository,
} from './repositories/users.repository';
import { InMemoryUsersRepository } from './repositories/users.memory.repository';
import { PrismaUsersRepository } from './repositories/users.prisma.repository';

/** `@Global` — 인증과 앞으로의 도메인 모듈 대부분이 작성자 정보를 필요로 한다 */
@Global()
@Module({
  providers: [
    UsersService,
    repositoryProvider<UsersRepository>(
      USERS_REPOSITORY,
      InMemoryUsersRepository,
      PrismaUsersRepository,
    ),
  ],
  exports: [UsersService],
})
export class UsersModule {}
