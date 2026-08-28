/**
 * 서버 통신 계층.
 *
 * 도메인별로 세 가지를 나눈다:
 * - `*.api.ts`   HTTP 를 아는 유일한 곳. React 를 모른다(통합 테스트가 직접 부른다)
 * - `*.keys.ts`  캐시 키. 흩뿌리면 오타 하나에 캐시가 안 지워진다
 * - `*.hooks.ts` 화면이 쓰는 것. 얇게 유지한다
 *
 * → FE/ARCHITECTURE.md
 */
export { httpClient, unwrap, orNull } from './client';
export type { ApiEnvelope } from './client';
export * from './auth';
export * from './questions';
export * from './answers';
