import { Global, Module } from '@nestjs/common';
import { APP_CONFIG, appConfigProvider } from './app-config.provider';

/**
 * 전역 설정 모듈. AppModule 에 한 번만 import 하면 APP_CONFIG(설정 getter)를
 * 어디서나 주입할 수 있다(PrismaModule 과 같은 @Global 관례).
 *
 * 서비스가 loadAppConfig 를 직접 import 하지 않게 하는 것이 목적이다 —
 * 테스트에서 설정 출처를 갈아끼울 수 있고, "언제 읽히는가"가 토큰 하나로 문서화된다.
 */
@Global()
@Module({
  providers: [appConfigProvider],
  exports: [APP_CONFIG],
})
export class AppConfigModule {}
