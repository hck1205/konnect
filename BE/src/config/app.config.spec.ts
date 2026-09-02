import { DB_DRIVERS, loadAppConfig } from './app.config';

/**
 * 설정 로더 — 특히 `DB_DRIVER` 의 **검증**을 지킨다.
 *
 * 이 파일이 없던 동안 `DB_DRIVER` 는 검사 없는 캐스트였고,
 * `Prisma`·`postgres`·빈 문자열이 전부 조용히 인메모리로 떨어졌다.
 * 운영에서 그 뜻은 <재시작마다 모든 글이 사라진다> 인데
 * 앱은 정상으로 뜨고 헬스체크도 통과한다.
 *
 * 타입 시스템을 우회했으면(캐스트) 그 자리에 런타임 검사를 놓는다 —
 * 이 저장소가 `topic` enum 매퍼에서 이미 쓰는 원칙이다.
 */
describe('loadAppConfig — DB_DRIVER', () => {
  const original = process.env.DB_DRIVER;

  const withDriver = <T>(value: string | undefined, fn: () => T): T => {
    if (value === undefined) delete process.env.DB_DRIVER;
    else process.env.DB_DRIVER = value;
    return fn();
  };

  afterEach(() => {
    if (original === undefined) delete process.env.DB_DRIVER;
    else process.env.DB_DRIVER = original;
  });

  it.each([...DB_DRIVERS])('%s 는 그대로 통과한다', (driver) => {
    expect(withDriver(driver, () => loadAppConfig().dbDriver)).toBe(driver);
  });

  it('미설정이면 memory — .env 없이 테스트가 돌아야 한다', () => {
    expect(withDriver(undefined, () => loadAppConfig().dbDriver)).toBe(
      'memory',
    );
  });

  it('빈 문자열도 memory — 값을 지운 것은 미설정과 같은 뜻이다', () => {
    expect(withDriver('', () => loadAppConfig().dbDriver)).toBe('memory');
    expect(withDriver('   ', () => loadAppConfig().dbDriver)).toBe('memory');
  });

  it('앞뒤 공백은 다듬는다 — .env 편집에서 흔하다', () => {
    expect(withDriver(' prisma ', () => loadAppConfig().dbDriver)).toBe(
      'prisma',
    );
  });

  /**
   * 여기가 핵심이다. 아래 값들은 전에 **전부 인메모리로 조용히 떨어졌다.**
   * 이제는 부팅이 멈춘다 — 배포 헬스체크가 잡아 롤백까지 간다.
   */
  it.each([
    'Prisma',
    'PRISMA',
    'postgres',
    'postgresql',
    'pg',
    'true',
    'memoryy',
  ])("'%s' 는 던진다 — 조용히 인메모리로 떨어지지 않는다", (bad) => {
    expect(() => withDriver(bad, loadAppConfig)).toThrow(/DB_DRIVER/);
  });

  it('오류 메시지가 무엇을 써야 하는지 알려준다', () => {
    expect(() => withDriver('Prisma', loadAppConfig)).toThrow(
      /'memory'|'prisma'/,
    );
  });
});
