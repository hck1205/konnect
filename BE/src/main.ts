import { loadEnv } from './config/load-env';

// 무엇보다 먼저 — .env.${NODE_ENV} → .env 순으로 환경변수를 주입한다.
// (loadAppConfig / Prisma 연결이 DATABASE_URL 등을 읽기 전에 실행되어야 한다)
loadEnv();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyGlobalHarness } from './app.setup';
import { loadAppConfig } from './config';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = loadAppConfig();

  // 전역 파이프/필터/인터셉터 — e2e와 공유하는 단일 지점(app.setup.ts)
  applyGlobalHarness(app);

  // Prisma 사용 시에만 종료 훅을 걸어 커넥션을 정리한다(인메모리 모드는 무영향)
  if (config.dbDriver === 'prisma') {
    app.get(PrismaService).enableShutdownHooks(app);
  }

  // FE(Next.js) 연동을 위한 CORS
  app.enableCors({ origin: config.corsOrigin, credentials: true });

  await app.listen(config.port);
}
void bootstrap();
