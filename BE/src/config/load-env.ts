import { config as loadDotenv } from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * 환경변수 파일 로더 (dev/prod 분리의 진입점).
 *
 * 우선순위(먼저 로드한 값이 이긴다 — dotenv override=false):
 *   1) 이미 설정된 process.env (OS/배포 환경변수) — 항상 최우선
 *   2) `.env.${NODE_ENV}` (예: .env.development / .env.production) — 환경별 값
 *   3) `.env` (공통 기본값, 있으면)
 *
 * NODE_ENV 미설정 시 'development'로 간주한다.
 * main.ts의 최상단에서 호출해 DATABASE_URL 등을 주입한다.
 * 여러 번 호출해도 1회만 로드한다(테스트/부트스트랩 중복 호출 안전).
 */
let loaded = false;

export function loadEnv(): void {
  if (loaded) return;
  loaded = true;

  const nodeEnv = process.env.NODE_ENV || 'development';
  const cwd = process.cwd();

  // 앞 항목이 우선 — override:false 이므로 먼저 채워진 값을 뒤 파일이 덮어쓰지 않는다.
  const files = [resolve(cwd, `.env.${nodeEnv}`), resolve(cwd, '.env')];
  for (const path of files) {
    if (existsSync(path)) {
      loadDotenv({ path, override: false, quiet: true });
    }
  }
}
