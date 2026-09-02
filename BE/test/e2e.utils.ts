import type { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { loadAppConfig } from '../src/config';
import { QUESTIONS_REPOSITORY } from '../src/modules/questions/repositories/questions.repository';
import { ANSWERS_REPOSITORY } from '../src/modules/answers/repositories/answers.repository';
import { USERS_REPOSITORY } from '../src/modules/users/repositories/users.repository';

/**
 * 테스트 간 저장소 초기화.
 *
 * 인메모리는 앱을 새로 만들 때마다 비지만 **DB 는 남는다**. 그대로 두면
 * "1건이어야 한다" 같은 단언이 앞 테스트의 데이터 때문에 깨지고,
 * 더 나쁘게는 **순서에 따라 통과했다 실패했다** 한다.
 *
 * TRUNCATE ... CASCADE 로 한 번에 비운다 — DELETE 보다 빠르고 FK 순서를 신경 쓸 필요가 없다.
 */
export async function resetDatabase(app: INestApplication): Promise<void> {
  if (loadAppConfig().dbDriver !== 'prisma') return;

  const prisma = app.get(PrismaService);
  await prisma.$executeRawUnsafe(
    'TRUNCATE TABLE question_tags, answers, questions, tags, auth_identities, users RESTART IDENTITY CASCADE',
  );
}

/**
 * **이 실행이 정말 그 드라이버로 돌았는지** 증명한다.
 *
 * 왜 필요한가: CI 가 같은 e2e 를 두 번 돌리는데, 두 번째에 `DB_DRIVER` 를
 * 빠뜨리면 **<prisma 드라이버> 라는 이름의 스텝이 인메모리를 검사하며 초록**이 된다.
 * 계약을 지킨다고 믿는데 실제로는 같은 것을 두 번 돌리는 상태다 —
 * 검사가 없는 것보다 나쁘다(있다고 믿게 만든다).
 *
 * 설정값을 환경변수와 비교하는 것은 동어반복이라 소용없다. **DI 가 실제로 무엇을
 * 묶었는지**(주입된 저장소 인스턴스의 클래스)를 본다.
 *
 * 오타(`Prisma`·`postgres`)는 `loadAppConfig` 가 부팅에서 던져 이미 막는다.
 * 여기가 막는 것은 **아예 안 준 경우**다.
 */
export function assertDriverBound(app: INestApplication): void {
  const expected = loadAppConfig().dbDriver;
  const want = expected === 'prisma' ? 'Prisma' : 'InMemory';

  const bound = [
    ['questions', QUESTIONS_REPOSITORY],
    ['answers', ANSWERS_REPOSITORY],
    ['users', USERS_REPOSITORY],
  ] as const;

  const wrong = bound
    // 심볼 토큰은 `any` 로 나오므로 명시한다 — 그러지 않으면 lint 가 막는다
    .map(
      ([name, token]) =>
        [name, app.get<object>(token).constructor.name] as const,
    )
    .filter(([, cls]) => !cls.startsWith(want));

  if (wrong.length > 0) {
    throw new Error(
      `DB_DRIVER=${expected} 로 돌고 있다는데 실제로 묶인 저장소가 다릅니다: ` +
        wrong.map(([n, c]) => `${n}=${c}`).join(', ') +
        '. 두 드라이버 계약이 검증되지 않은 상태입니다.',
    );
  }
}
