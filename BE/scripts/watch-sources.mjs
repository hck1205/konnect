/**
 * 공식 출처 감시 — 하루 1회.
 *
 * **글을 생성하지 않는다.** 공식 문서가 바뀌었는지만 보고, 바뀌면 기록한다.
 * 해석은 사람(또는 커뮤니티)의 몫이다 — 비자 전문가가 없는 상태에서
 * 자동 요약은 [R1 영역](docs/10-domain/10-visa-immigration/03-content-and-risk-policy.md)의
 * 틀린 안내를 대량 생산한다.
 *
 *   node scripts/watch-sources.mjs           # 감시 (상태 파일 갱신)
 *   node scripts/watch-sources.mjs --dry     # 네트워크만, 저장 안 함
 *
 * 환경변수
 *   KONNECT_LAW_API_KEY  법제처 OPEN API 키(OC 값). 없으면 statute 를 건너뛴다.
 *                        → https://open.law.go.kr 에서 무료 발급
 *   LAW_API_KEY          prefix 없는 이름도 받는다(로컬 편의).
 *   KONNECT_SOURCE_STATE 상태 파일 경로. 기본은 BE/data/source-state.json 이고,
 *                        컨테이너에서는 볼륨(/app/var)으로 뺀다.
 *
 *   ⚠️ 운영 서버의 .env 는 **앱별 prefix** 를 쓴다(한 박스에 여러 앱이 있다).
 *      그래서 prefix 붙은 이름을 **먼저** 본다.
 *
 * → docs/20-product/10-features/11-official-sources.md
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
/**
 * 감시 대상 목록 — **사람이 관리하는 입력**이다.
 *
 * 예전엔 `contracts/` 에 있었다. 그 폴더는 "FE 와 BE 가 같아야 하는 규칙"의 자리인데
 * (→ contracts/README.md) 이 파일은 FE 가 읽지 않고 대조하는 테스트도 없다 —
 * 계약이 아니라 BE 의 입력이었다.
 *
 * 옮긴 결정적인 이유는 따로 있다. BE 이미지의 **빌드 컨텍스트가 `BE/`** 라
 * (.github/workflows/deploy.yml) 저장소 루트의 파일은 이미지에 담을 수가 없다.
 * 서버에서 돌리려면 이 파일이 `BE/` 안에 있어야 한다.
 */
const REGISTRY = resolve(here, '../data/official-sources.json');

/**
 * 상태 파일 — **파생 데이터다.** 해시는 원문에서 언제든 다시 만들 수 있다.
 * 그래서 git 에 두지 않는다(예전엔 커밋했고, 그 탓에 감시가 저장소 쓰기 권한을 요구했다).
 *
 * 경로를 열어 두는 이유: 컨테이너에서는 레지스트리가 `/app/data` 에 있어
 * **그 위에 볼륨을 덮으면 레지스트리가 가려진다.** 쓰기 경로만 밖으로 뺀다(`/app/var`).
 */
const STATE = process.env.KONNECT_SOURCE_STATE
  ? resolve(process.env.KONNECT_SOURCE_STATE)
  : resolve(here, '../data/source-state.json');

const DRY = process.argv.includes('--dry');
/**
 * 운영 서버의 `.env` 는 앱별 prefix 를 쓴다(`KONNECT_...`) — 한 박스에 여러 앱이 있어서다.
 * prefix 붙은 이름을 먼저 보고, 없으면 짧은 이름으로 떨어진다(로컬 편의).
 *
 * 이름이 어긋나면 **조용히 건너뛴다** — 실패가 아니라 "키 없음"으로 보이므로
 * 눈치채기 어렵다. 그래서 어느 이름으로 찾았는지 로그에 남긴다.
 */
const LAW_KEY_VAR = process.env.KONNECT_LAW_API_KEY
  ? 'KONNECT_LAW_API_KEY'
  : process.env.LAW_API_KEY
    ? 'LAW_API_KEY'
    : null;
const LAW_KEY = LAW_KEY_VAR ? process.env[LAW_KEY_VAR] : '';

/** 남의 서버다 — 연락처를 남기고, 하루 1회면 충분하다 */
const UA = 'konnect-source-watcher/1.0 (+https://github.com/hck1205/konnect)';
const TIMEOUT_MS = 20_000;

const sha = (s) => createHash('sha256').update(s).digest('hex').slice(0, 16);
const readJson = (p, fallback) =>
  existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : fallback;

/**
 * 조건부 요청 — 서버가 304 를 주면 본문을 받지 않는다.
 * 매일 같은 문서를 통째로 받아 오는 것은 예의가 아니고 느리다.
 */
async function fetchConditional(url, prev = {}) {
  const headers = { 'user-agent': UA };
  if (prev.etag) headers['if-none-match'] = prev.etag;
  if (prev.lastModified) headers['if-modified-since'] = prev.lastModified;

  const res = await fetch(url, {
    headers,
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (res.status === 304) return { unchanged: true, status: 304 };
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  return {
    status: res.status,
    body: await res.text(),
    etag: res.headers.get('etag') ?? null,
    lastModified: res.headers.get('last-modified') ?? null,
  };
}

/**
 * 페이지에서 **의미 있는 텍스트만** 추린 해시.
 *
 * 원문 그대로 해시하면 세션 id·타임스탬프·광고 배너 때문에 **매일 바뀐다** —
 * 그러면 변경 감지가 전부 거짓 양성이 되어 아무도 안 본다.
 */
/**
 * 에러 페이지를 정상으로 세지 않는다.
 *
 * 하이코리아는 없는 주소에 **200 으로 에러 페이지**를 돌려준다. 그대로 해시하면
 * "에러 페이지를 안정적으로 감시하는" 상태가 되고, 매일 "변동 없음"이 찍혀
 * 아무도 눈치채지 못한다 — 실제로 그렇게 만들었다가 텍스트 길이(147자)를
 * 보고 알았다.
 *
 * 그래서 둘을 본다: **너무 짧은 본문**과 **에러 문구**.
 */
const ERROR_MARKERS = [
  '페이지를 찾을 수 없',
  '페이지를 찾을 수가 없',
  '요청하신 페이지',
  'not found',
  '잘못된 접근',
  '서비스 점검',
];
const MIN_TEXT_LENGTH = 400;

function assertRealPage(text, source) {
  if (text.length < MIN_TEXT_LENGTH) {
    throw new Error(`본문이 ${text.length}자뿐이다 — 에러/리다이렉트 페이지로 보인다`);
  }
  const head = text.slice(0, 600).toLowerCase();
  const hit = ERROR_MARKERS.find((m) => head.includes(m.toLowerCase()));
  if (hit) throw new Error(`에러 페이지로 보인다 ("${hit}")`);
}

function contentHash(html) {
  const text = html
    .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    // 날짜·시각·숫자 토큰은 제거한다. 조회수·현재시각이 해시를 흔든다.
    .replace(/\d{4}[-.\/]\d{1,2}[-.\/]\d{1,2}/g, ' ')
    .replace(/\d{1,2}:\d{2}(:\d{2})?/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return { hash: sha(text), length: text.length, text };
}

/** 법제처 OPEN API — 법령 본문과 **시행일**을 가져온다 */
async function fetchStatute(source) {
  if (!LAW_KEY) return { skipped: 'KONNECT_LAW_API_KEY 없음' };

  const url =
    `https://www.law.go.kr/DRF/lawService.do?OC=${encodeURIComponent(LAW_KEY)}` +
    `&target=law&type=JSON&LM=${encodeURIComponent(source.law_name)}`;

  const res = await fetch(url, {
    headers: { 'user-agent': UA },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const raw = await res.text();
  // 키가 잘못되면 빈 응답이나 HTML 이 온다 — JSON 파싱 실패로 드러난다
  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error(`법제처 응답이 JSON 이 아니다(키 확인 필요, ${raw.length}자)`);
  }

  const basic = json?.법령?.기본정보 ?? {};
  return {
    revisedAt: basic.시행일자 ?? basic.공포일자 ?? null,
    ...contentHash(raw),
  };
}

async function check(source, prev) {
  if (source.kind === 'statute') {
    const r = await fetchStatute(source);
    if (r.skipped) return { ...prev, skipped: r.skipped };
    const changed = prev.hash !== undefined && prev.hash !== r.hash;
    return { hash: r.hash, revisedAt: r.revisedAt, length: r.length, changed };
  }

  const r = await fetchConditional(source.url, prev);
  if (r.unchanged) return { ...prev, changed: false, via: '304' };

  const { hash, length, text } = contentHash(r.body);
  assertRealPage(text, source);
  return {
    hash,
    length,
    etag: r.etag,
    lastModified: r.lastModified,
    changed: prev.hash !== undefined && prev.hash !== hash,
  };
}

// ── 실행 ──────────────────────────────────────────────────────────
console.log(
  LAW_KEY_VAR
    ? `법령 API 키: ${LAW_KEY_VAR} 사용`
    : '법령 API 키 없음 — statute 는 건너뛴다 (페이지 감시는 계속 돈다)',
);

const registry = readJson(REGISTRY, null);
if (!registry) {
  console.error(`✖ 레지스트리를 못 읽었다: ${REGISTRY}`);
  process.exit(1);
}

const state = readJson(STATE, { checkedAt: null, sources: {} });
const now = new Date().toISOString();
const changes = [];
const failures = [];

for (const source of registry.sources) {
  const prev = state.sources[source.id] ?? {};
  process.stdout.write(`  ${source.id} … `);
  try {
    const next = await check(source, prev);

    if (next.skipped) {
      console.log(`건너뜀 (${next.skipped})`);
      state.sources[source.id] = { ...prev, skipped: next.skipped };
      continue;
    }

    const history = prev.history ?? [];
    if (next.changed) {
      history.unshift({ at: now, hash: next.hash, revisedAt: next.revisedAt ?? null });
      changes.push({ source, revisedAt: next.revisedAt ?? null });
      console.log(`⚠ 변경됨${next.revisedAt ? ` (시행일 ${next.revisedAt})` : ''}`);
    } else {
      console.log(prev.hash === undefined ? '최초 기록' : `변동 없음${next.via ? ` (${next.via})` : ''}`);
    }

    state.sources[source.id] = {
      hash: next.hash,
      length: next.length,
      revisedAt: next.revisedAt ?? prev.revisedAt ?? null,
      etag: next.etag ?? prev.etag ?? null,
      lastModified: next.lastModified ?? prev.lastModified ?? null,
      checkedAt: now,
      // 변경 이력은 30건까지만 — 무한히 자라면 파일이 감당 안 된다
      history: history.slice(0, 30),
    };
  } catch (error) {
    console.log(`✖ ${error.message}`);
    failures.push([source.id, error.message]);
    state.sources[source.id] = { ...prev, lastError: error.message, checkedAt: now };
  }
}

state.checkedAt = now;

if (!DRY) {
  mkdirSync(dirname(STATE), { recursive: true });
  writeFileSync(STATE, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

console.log();
console.log(`확인 ${registry.sources.length}건 · 변경 ${changes.length}건 · 실패 ${failures.length}건`);

for (const { source, revisedAt } of changes) {
  console.log(`  ⚠ ${source.title}${revisedAt ? ` — 시행일 ${revisedAt}` : ''}`);
  console.log(`     영향: ${source.applies_to.join(', ')}`);
}

// 변경은 정상이다(실패가 아니다). 실패만 종료코드로 알린다 —
// 그래야 스케줄러가 "바뀜"과 "못 가져옴"을 구분한다.
process.exit(failures.length > 0 ? 1 : 0);
