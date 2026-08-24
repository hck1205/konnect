/**
 * 앱 환경 설정 로더. 환경변수를 타입 안전하게 노출한다.
 * 새 설정이 필요해지면 AppConfig 에 필드를 더하고 loadAppConfig 에 기본값을 둔다
 * (기본값이 있어야 .env 없이도 앱과 테스트가 부팅한다).
 */

/** 저장소 드라이버 — 'memory'(인메모리) | 'prisma'(Postgres) */
export type DbDriver = 'memory' | 'prisma';

export interface AppConfig {
  port: number;
  corsOrigin: string;
  nodeEnv: 'development' | 'production' | 'test';
  /** Postgres 연결 문자열 — DB_DRIVER='prisma'일 때만 사용 (Prisma가 env로 읽음) */
  databaseUrl: string;
  /**
   * 저장소 구현 선택. 미설정(테스트/로컬 기본)은 'memory'라 DB 없이 동작한다.
   * 'prisma'로 두면 각 모듈이 Prisma 저장소로 바인딩된다.
   */
  dbDriver: DbDriver;
}

export const loadAppConfig = (): AppConfig => ({
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  nodeEnv: (process.env.NODE_ENV as AppConfig['nodeEnv']) ?? 'development',
  databaseUrl: process.env.DATABASE_URL ?? '',
  dbDriver: (process.env.DB_DRIVER as DbDriver) ?? 'memory',
});
