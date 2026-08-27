/**
 * 로케일 라우팅이 **실제로 동작하는지** 확인한다.
 *
 * 왜 따로 필요한가: `negotiateLocale` 단위 테스트는 순수 함수라 항상 통과하고,
 * 타입체크·린트·빌드도 전부 통과한다. 그런데 `proxy.ts` 가 `src/` 밖에 있으면
 * Next 가 **조용히 무시**해서 로케일 없는 경로가 전부 404 가 된다.
 * 실제로 그렇게 죽어 있었고, 이 검사만 그걸 잡는다.
 *
 *   npm run dev                      # 한 터미널
 *   npm run check:routing            # 다른 터미널
 *
 * BASE_URL 로 대상 주소를 바꿀 수 있다.
 */
const BASE = process.env.BASE_URL ?? 'http://localhost:3000';

/** [설명, Accept-Language, 기대 경로] */
const CASES = [
  ['지원 언어 — 한국어', 'ko-KR,ko;q=0.9', '/ko/questions/1'],
  ['지원 언어 — 베트남어', 'vi-VN,vi;q=0.9,en;q=0.8', '/vi/questions/1'],
  ['지역 태그 강등 zh-CN → zh', 'zh-CN,zh;q=0.9', '/zh/questions/1'],
  ['미지원 언어는 기준 언어로 — 일본어', 'ja-JP,ja;q=0.9,en;q=0.8', '/en/questions/1'],
  ['미지원 언어는 기준 언어로 — 태국어', 'th-TH,th;q=0.9', '/en/questions/1'],
  ['q 값을 존중한다 (ja 0.3 < vi 0.9)', 'ja;q=0.3,vi;q=0.9', '/vi/questions/1'],
  ['헤더가 없으면 기준 언어', null, '/en/questions/1'],
];

const failures = [];

async function expectRedirect(label, acceptLanguage, expected) {
  const res = await fetch(`${BASE}/questions/1`, {
    redirect: 'manual',
    headers: acceptLanguage ? { 'accept-language': acceptLanguage } : {},
  });
  if (res.status !== 307) {
    failures.push([label, `307 이 아니라 ${res.status} — proxy 가 안 돌고 있다`]);
    return;
  }
  const location = res.headers.get('location') ?? '';
  const path = new URL(location, BASE).pathname;
  if (path !== expected) failures.push([label, `${expected} 를 기대했는데 ${path}`]);
}

/**
 * 로케일을 **붙이면 안 되는** 경로.
 *
 * OAuth 콜백은 제공자에 등록한 redirect URI 와 정확히 같아야 한다 —
 * `/en/auth/callback/google` 로 리다이렉트되면 로그인이 통째로 깨진다.
 * 이미 로케일이 붙은 경로도 다시 리다이렉트되면 무한 루프가 된다.
 */
async function expectNoRedirect(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual' });
  if (res.status >= 300 && res.status < 400) {
    failures.push([`${path} 는 그대로 서빙돼야 한다`, `${res.status} 리다이렉트가 났다`]);
  }
}

try {
  await fetch(BASE, { redirect: 'manual' });
} catch {
  console.error(`✖ ${BASE} 에 연결할 수 없다. 먼저 \`npm run dev\` 를 띄운다.`);
  process.exit(1);
}

for (const [label, header, expected] of CASES) {
  await expectRedirect(label, header, expected);
}
const NO_REDIRECT = [
  '/en',
  '/ko/questions/1',
  '/vi',
  '/auth/callback/google', // OAuth 콜백 — 로케일이 붙으면 제공자가 거부한다
];
for (const path of NO_REDIRECT) {
  await expectNoRedirect(path);
}

if (failures.length > 0) {
  console.error(`✖ 라우팅 검사 실패 ${failures.length}건\n`);
  for (const [label, reason] of failures) console.error(`  · ${label}\n      ${reason}`);
  process.exit(1);
}
console.log(`✓ 라우팅 ${CASES.length + NO_REDIRECT.length}건 통과 (${BASE})`);
