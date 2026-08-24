import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters';
import { TransformInterceptor } from './common/interceptors';

/**
 * 전역 하네스(검증 파이프·예외 필터·응답 인터셉터) 적용.
 * main.ts(부트스트랩)와 e2e 테스트가 공유해 운영/테스트 동작을 일치시킨다.
 */
export function applyGlobalHarness<T extends INestApplication>(app: T): T {
  // 전역 유효성 검증 — DTO에 없는 필드 제거(whitelist) + 타입 변환(transform)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // 전역 예외 필터 / 응답 정규화({ data, timestamp }) 인터셉터
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  return app;
}
