import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './modules/health';
import { AuthModule } from './modules/auth';
import { QuestionsModule } from './modules/questions';
import { AnswersModule } from './modules/answers';

@Module({
  imports: [
    // 전역 — APP_CONFIG(설정 getter)를 모든 모듈에 노출한다(PrismaModule 보다 먼저 둔다)
    AppConfigModule,
    PrismaModule,
    // 전역 JWT 가드를 등록한다 — 기본이 "인증 필요", 공개 라우트에 @Public()
    AuthModule,
    HealthModule,
    QuestionsModule,
    AnswersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
