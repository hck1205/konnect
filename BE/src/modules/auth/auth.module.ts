import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { loadAppConfig } from '../../config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

/**
 * 인증 모듈.
 *
 * `@Global` 인 이유: 모든 도메인 모듈이 `@CurrentUser()` 를 쓰고, 가드가 전역이라
 * JwtService 가 어디서나 필요하다.
 *
 * 가드를 **APP_GUARD 로 전역 등록**한다 — 기본이 "인증 필요"이고 공개 라우트에
 * `@Public()` 을 붙인다. 반대로 하면 새 엔드포인트가 의도치 않게 공개된다.
 */
@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      // useFactory 라 DI 해석 시점(main.ts 의 loadEnv 이후)에 평가된다
      useFactory: () => ({ secret: loadAppConfig().jwtSecret }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
