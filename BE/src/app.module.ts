import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './modules/health';

@Module({
  imports: [
    // 전역 — APP_CONFIG(설정 getter)를 모든 모듈에 노출한다(PrismaModule 보다 먼저 둔다)
    AppConfigModule,
    PrismaModule,
    HealthModule,
    // 도메인 모듈은 여기에 추가한다 — src/modules/<도메인>/index.ts 에서 export
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
