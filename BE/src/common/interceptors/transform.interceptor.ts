import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { SSE_METADATA } from '@nestjs/common/constants';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  data: T;
  timestamp: string;
}

/**
 * 성공 응답을 { data, timestamp } 형태로 감싸는 전역 인터셉터.
 *
 * 단, @Sse() 라우트는 손대지 않고 그대로 흘려보낸다. SSE 핸들러의 반환값은 "응답 1건"이 아니라
 * 끝나지 않는 MessageEvent 스트림이고, Nest 는 인터셉터를 통과한 **각 이벤트**를 직렬화한다 —
 * 여기서 봉투를 씌우면 MessageEvent 계약이 깨진다.
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T> | T
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T> | T> {
    if (Reflect.getMetadata(SSE_METADATA, context.getHandler()) === true) {
      return next.handle(); // 스트림 원본 유지(봉투 없음)
    }
    return next
      .handle()
      .pipe(map((data) => ({ data, timestamp: new Date().toISOString() })));
  }
}
