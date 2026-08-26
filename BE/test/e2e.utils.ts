import type { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import { loadAppConfig } from '../src/config';

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
