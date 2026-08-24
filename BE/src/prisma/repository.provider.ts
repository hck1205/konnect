import type { Provider } from '@nestjs/common';
import { loadAppConfig } from '../config';
import { PrismaService } from './prisma.service';

type MemoryCtor<T> = new () => T;
type PrismaCtor<T> = new (prisma: PrismaService) => T;

/**
 * DB_DRIVER 값에 따라 인메모리/Prisma 저장소를 선택하는 팩토리 provider를 만든다.
 *
 * 도메인 모듈은 이렇게 쓴다:
 *   providers: [repositoryProvider(USERS_REPOSITORY, InMemoryUsersRepository, PrismaUsersRepository)]
 *
 * useFactory이므로 DI 해석 시점(main.ts의 loadEnv 이후)에 평가된다.
 * → import 시점에 loadAppConfig()를 호출하지 않아 환경변수 로드 순서 문제가 없다.
 * DB_DRIVER 미설정(기본 'memory', 테스트 포함)이면 항상 인메모리 구현이 선택된다.
 */
export function repositoryProvider<T>(
  token: symbol,
  MemoryRepo: MemoryCtor<T>,
  PrismaRepo: PrismaCtor<T>,
): Provider {
  return {
    provide: token,
    useFactory: (prisma: PrismaService): T =>
      loadAppConfig().dbDriver === 'prisma'
        ? new PrismaRepo(prisma)
        : new MemoryRepo(),
    inject: [PrismaService],
  };
}
