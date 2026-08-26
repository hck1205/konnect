import type { Provider } from '@nestjs/common';
import { APP_CONFIG, type AppConfigGetter } from '../config';
import { PrismaService } from './prisma.service';

type MemoryCtor<T> = new () => T;
type PrismaCtor<T> = new (prisma: PrismaService) => T;

/**
 * DB_DRIVER 값에 따라 인메모리/Prisma 저장소를 선택하는 팩토리 provider를 만든다.
 *
 * 도메인 모듈은 이렇게 쓴다 — **제네릭에 인터페이스를 명시한다**:
 *   repositoryProvider<UsersRepository>(USERS_REPOSITORY, InMemoryUsersRepository, PrismaUsersRepository)
 *
 * 생략하면 T 가 인메모리 **구현 클래스**에서 추론되어, Prisma 구현이 그 클래스의
 * private 필드까지 가져야 한다는 잘못된 제약이 걸린다.
 *
 * 설정은 **APP_CONFIG 토큰으로 주입받는다**(loadAppConfig 를 직접 부르지 않는다).
 * PrismaService 는 이미 그렇게 하고 있었는데 여기만 직접 호출하고 있었다 —
 * 그러면 테스트가 `overrideProvider(APP_CONFIG)` 로 드라이버를 갈아끼울 수 없고,
 * "설정을 어디서 읽는가"가 두 가지가 된다.
 *
 * useFactory 이므로 DI 해석 시점(main.ts 의 loadEnv 이후)에 평가된다.
 * DB_DRIVER 미설정(기본 'memory', 테스트 포함)이면 항상 인메모리 구현이 선택된다.
 */
export function repositoryProvider<T>(
  token: symbol,
  MemoryRepo: MemoryCtor<T>,
  PrismaRepo: PrismaCtor<T>,
): Provider {
  return {
    provide: token,
    useFactory: (prisma: PrismaService, getConfig: AppConfigGetter): T =>
      getConfig().dbDriver === 'prisma'
        ? new PrismaRepo(prisma)
        : new MemoryRepo(),
    inject: [PrismaService, APP_CONFIG],
  };
}
