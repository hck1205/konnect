import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  type INestApplication,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { APP_CONFIG, type AppConfigGetter } from '../config';

/**
 * Prisma 커넥션을 감싸는 Nest 서비스.
 *
 * 핵심: DB_DRIVER='prisma'일 때만 실제 커넥션을 맺는다.
 * 인메모리/테스트(DB_DRIVER 미설정)에서는 인스턴스는 생성되지만 $connect() 하지 않아
 * DATABASE_URL 없이도 앱 부팅과 테스트가 깨지지 않는다.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly usePrisma: boolean;

  constructor(@Inject(APP_CONFIG) getConfig: AppConfigGetter) {
    super();
    // 드라이버 선택은 인스턴스 생성 시점 1회 — repositoryProvider(DI 해석 시점)와 같은 순간이다
    this.usePrisma = getConfig().dbDriver === 'prisma';
  }

  async onModuleInit(): Promise<void> {
    if (!this.usePrisma) return; // 인메모리 모드: 연결하지 않는다
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.usePrisma) return;
    await this.$disconnect();
  }

  /**
   * 프로세스 종료 시 Nest 앱을 정상 종료(app.close())해 커넥션을 정리한다.
   * main.ts에서 Prisma 경로일 때만 호출한다.
   */
  enableShutdownHooks(app: INestApplication): void {
    process.once('beforeExit', () => {
      void app.close();
    });
  }
}
