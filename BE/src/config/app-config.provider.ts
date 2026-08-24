import type { Provider } from '@nestjs/common';
import { loadAppConfig, type AppConfig } from './app.config';

/**
 * 앱 설정 DI 토큰. 주입되는 값은 **config 객체가 아니라 getter**다.
 *
 * 부팅 시 1회 스냅샷으로 굳히지 않는 이유: 테스트가 환경변수만 바꿔 동작을 재현할 수
 * 있어야 한다. getter 를 주입하면 호출부가 `this.getConfig()` 로 매번 새로 읽는다.
 */
export const APP_CONFIG = Symbol('APP_CONFIG');

/** 호출 시점에 환경변수를 다시 읽어 설정을 만드는 함수(= loadAppConfig) */
export type AppConfigGetter = () => AppConfig;

/**
 * useFactory 라 DI 해석 시점(main.ts 의 loadEnv 이후)에 평가된다.
 * 팩토리가 돌려주는 것은 설정 스냅샷이 아니라 loadAppConfig 자체다(호출마다 재평가).
 */
export const appConfigProvider: Provider = {
  provide: APP_CONFIG,
  useFactory: (): AppConfigGetter => loadAppConfig,
};
