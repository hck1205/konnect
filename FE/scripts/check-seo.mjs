/**
 * 상세 페이지가 **색인 가능한 상태로 서버 렌더되는지** 확인한다.
 *
 * 왜 따로 필요한가: 빌드도 타입체크도 통과하는데 본문이 HTML 에 없을 수 있다.
 * 클라이언트에서 데이터를 받아 오면 첫 HTML 은 로딩 상태이고 **크롤러는 그것만 본다** —
 * 검색이 유일한 유입 채널인 이 서비스에서는 그대로 손실이다.
 * → docs/20-product/20-prd/08-seo-strategy.md
 *
 * 손으로 grep 하다 실제로 속았다: Next 는 `hrefLang`(카멜)로 렌더하는데
 * 소문자 `hreflang` 을 찾아 "없다"고 판단했다. 그래서 검사를 코드로 남긴다.
 *
 *   cd BE && npm run start:dev      # 한 터미널
 *   cd FE && npm run dev            # 다른 터미널
 *   SEO_URL=<주소> SEO_MUST_CONTAIN=<본문 일부> npm run check:seo
 */
import { createReport } from './lib/check-report.mjs';

const report = createReport('SEO');
const url = process.env.SEO_URL;

/**
 * **이 페이지에만 있는 문구**를 반드시 받는다.
 *
 * 처음에는 "보이는 텍스트가 N자 이상"으로만 봤는데, 네비·푸터·안전 고지만으로
 * 이미 그 기준을 넘어서 **본문이 비어도 통과했다**(결함을 주입해 확인했다).
 * 총량은 페이지가 살아 있다는 증거가 못 된다 — 그 페이지의 콘텐츠가 실렸는지를 봐야 한다.
 */
const mustContain = (process.env.SEO_MUST_CONTAIN ?? '')
  .split('|')
  .map((s) => s.trim())
  .filter(Boolean);

if (!url || mustContain.length === 0) {
  report.abort(
    'SEO_URL 과 SEO_MUST_CONTAIN 이 필요하다.\n' +
      "      예: SEO_URL=http://localhost:3000/en/questions/<id>/<slug> \\\n" +
      "          SEO_MUST_CONTAIN='본문 한 구절|답변 한 구절' npm run check:seo\n" +
      '      (여러 구절은 | 로 구분한다)',
  );
}

let html = '';
try {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) report.abort(`${url} → ${res.status}`);
  html = await res.text();
} catch (error) {
  report.abort(`${url} 에 연결할 수 없다: ${error.message}`);
}

/** 스크립트·스타일을 걷어낸 **사람이 읽는 텍스트** — 크롤러가 보는 것에 가깝다 */
const visibleText = html
  .replace(/<(script|style)[\s\S]*?<\/\1>/gi, '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z]+;|&#\d+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const has = (pattern) =>
  pattern instanceof RegExp ? pattern.test(html) : html.includes(pattern);

// HTML 속성은 대소문자를 가리지 않는다 — 정규식에 `i` 를 반드시 붙인다
const checks = [
  ['<title> 이 있다', /<title>[^<]{5,}<\/title>/i],
  ['canonical 이 있다', /<link[^>]+rel="canonical"[^>]+href="[^"]+"/i],
  ['hreflang 이 둘 이상이다', () => (html.match(/rel="alternate"[^>]+hreflang=/gi) ?? []).length >= 2],
  ['description 이 있다', /<meta[^>]+name="description"[^>]+content="[^"]{20,}"/i],
  ['<html lang> 이 있다', /<html[^>]+lang="[a-z]{2}(-[A-Z]{2})?"/i],
];

for (const [label, test] of checks) {
  const ok = typeof test === 'function' ? test() : has(test);
  if (!ok) report.fail(label, '없거나 비어 있다');
}

// 이 페이지의 **콘텐츠**가 실렸는가 — 클라이언트 렌더로 바뀌면 여기서 걸린다
for (const phrase of mustContain) {
  if (!visibleText.includes(phrase)) {
    report.fail(
      `본문에 "${phrase.slice(0, 40)}" 가 있다`,
      '서버 렌더 HTML 에 없다 — 크롤러는 이 내용을 못 본다',
    );
  }
}

report.done(checks.length + mustContain.length, url);
