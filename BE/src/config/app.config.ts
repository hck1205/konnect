/**
 * 앱 환경 설정 로더. 환경변수를 타입 안전하게 노출한다.
 * 새 설정이 필요해지면 AppConfig 에 필드를 더하고 loadAppConfig 에 기본값을 둔다
 * (기본값이 있어야 .env 없이도 앱과 테스트가 부팅한다).
 */

/** 저장소 드라이버 — 'memory'(인메모리) | 'prisma'(Postgres) */
export type DbDriver = 'memory' | 'prisma';

export const DB_DRIVERS = ['memory', 'prisma'] as const;

export interface AppConfig {
  port: number;
  corsOrigin: string;
  nodeEnv: 'development' | 'production' | 'test';
  /** JWT 서명 비밀키 — 운영에서는 반드시 환경변수로 주입한다 */
  jwtSecret: string;
  /** 액세스 토큰 만료 (예: '1d', '12h') */
  jwtExpiresIn: string;
  /** Postgres 연결 문자열 — DB_DRIVER='prisma'일 때만 사용 (Prisma가 env로 읽음) */
  databaseUrl: string;
  /**
   * 저장소 구현 선택. 미설정(테스트/로컬 기본)은 'memory'라 DB 없이 동작한다.
   * 'prisma'로 두면 각 모듈이 Prisma 저장소로 바인딩된다.
   */
  dbDriver: DbDriver;
}

/**
 * `DB_DRIVER` 를 **검사해서** 읽는다. 모르는 값이면 던진다.
 *
 * ⚠️ 예전에는 `(process.env.DB_DRIVER as DbDriver) ?? 'memory'` 였다.
 * 캐스트는 검사하지 않고 `??` 는 **nullish 일 때만** 떨어지므로,
 * `Prisma`·`PRISMA`·`postgres`·빈 문자열·앞뒤 공백이 전부 그대로 통과한 뒤
 * `dbDriver === 'prisma'` 비교에서 탈락해 **조용히 인메모리 저장소가 선택됐다.**
 *
 * 운영에서 그 결과는 이렇다: 앱은 정상으로 뜨고, 헬스체크는 통과하고,
 * 목록은 200 에 빈 배열이고, **재시작할 때마다 모든 글이 사라진다.**
 * 에러도 로그도 없어서 데이터가 없어진 뒤에야 알게 된다.
 *
 * 그래서 **조용한 성능 저하가 아니라 시끄러운 실패**를 고른다. 부팅이 멈추면
 * 배포 헬스체크가 잡아 롤백까지 간다 — 잘못된 저장소로 서비스하는 것보다 낫다.
 * 미설정은 여전히 정상이다(기본 `memory`) — 그래야 `.env` 없이 테스트가 돈다.
 */
function readDbDriver(raw: string | undefined): DbDriver {
  if (raw === undefined) return 'memory';
  const value = raw.trim();
  if (value === '') return 'memory';
  if ((DB_DRIVERS as readonly string[]).includes(value))
    return value as DbDriver;
  throw new Error(
    `DB_DRIVER 값이 '${raw}' 입니다. ${DB_DRIVERS.map((d) => `'${d}'`).join(' 또는 ')} 여야 합니다. ` +
      '모르는 값을 인메모리로 떨어뜨리면 운영에서 재시작마다 데이터가 사라집니다.',
  );
}

export const loadAppConfig = (): AppConfig => ({
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  nodeEnv: (process.env.NODE_ENV as AppConfig['nodeEnv']) ?? 'development',
  // 기본값은 **로컬 전용**이다. 운영에서 이 값이 쓰이면 토큰을 누구나 위조할 수 있다.
  jwtSecret: process.env.JWT_SECRET ?? 'konnect-dev-secret-do-not-use-in-prod',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
  databaseUrl: process.env.DATABASE_URL ?? '',
  dbDriver: readDbDriver(process.env.DB_DRIVER),
});
