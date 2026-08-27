/**
 * 스토리 스모크 검사 — `npm run check:stories`
 *
 * 모든 Ladle 스토리를 실제 브라우저에서 열어 **렌더되는지**와 **런타임 에러가 없는지**를 본다.
 *
 * 왜 필요한가: typecheck·lint·`ladle build` 는 전부 통과하는데 브라우저에서 죽는 경우가 있다.
 * 실제로 `next/link` 가 Ladle(Vite)에서 `process is not defined` 로 죽는 것을 이 검사만 잡았다.
 * 빌드된다고 실행되는 것은 아니다.
 *
 * 전제: Ladle 개발 서버가 떠 있어야 한다.
 *   npm run ladle -- --port 61000   (다른 터미널)
 *   LADLE_URL=http://localhost:61000 npm run check:stories
 *
 * 브라우저가 없으면: npx playwright install chromium
 * 이미 설치된 Chromium 을 쓰려면: CHROMIUM_PATH=/path/to/chromium
 */
import { chromium } from 'playwright';
import { createReport } from './lib/check-report.mjs';

const BASE = process.env.LADLE_URL ?? 'http://localhost:61000';
/** 시스템에 이미 있는 Chromium 을 쓰게 해 준다(CI 이미지·컨테이너에서 유용) */
const EXECUTABLE = process.env.CHROMIUM_PATH || undefined;

let meta;
try {
  meta = await (await fetch(`${BASE}/meta.json`)).json();
} catch {
  console.error(
    `Ladle 서버에 연결하지 못했습니다: ${BASE}\n  먼저 \`npm run ladle\` 을 띄우거나 LADLE_URL 을 지정하세요.`,
  );
  process.exit(1);
}

const ids = Object.keys(meta.stories);
if (ids.length === 0) {
  report.abort('스토리를 찾지 못했습니다.');
}

let browser;
try {
  browser = await chromium.launch({ executablePath: EXECUTABLE });
} catch (error) {
  console.error(
    `Chromium 을 실행하지 못했습니다.\n  ${String(error).split('\n')[0]}\n` +
      '  해결: `npx playwright install chromium` 또는 CHROMIUM_PATH 로 기존 바이너리를 지정하세요.',
  );
  process.exit(1);
}
const page = await browser.newPage();
const report = createReport('스토리');

for (const id of ids) {
  const errors = [];
  const onError = (e) => errors.push(String(e));
  const onConsole = (m) => {
    if (m.type() === 'error') errors.push(m.text());
  };
  page.on('pageerror', onError);
  page.on('console', onConsole);

  await page.goto(`${BASE}/?story=${id}&mode=preview`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(150);

  const body = (await page.textContent('body')) ?? '';

  // 텍스트가 아니라 **렌더된 요소 수**로 판정한다 —
  // 아이콘 버튼·스피너·입력처럼 텍스트가 없는 스토리가 정상이다.
  const elementCount = await page.evaluate(() => {
    const root =
      document.querySelector('[data-storyid], #ladle-root, main') ?? document.body;
    return root.querySelectorAll('*').length;
  });

  page.off('pageerror', onError);
  page.off('console', onConsole);

  const real = errors.filter((e) => !/favicon|React DevTools/i.test(e));

  // 가드: Ladle 의 "Story not found" 페이지를 통과로 세지 않는다.
  // (이 가드가 없으면 잘못된 스토리 id 가 전부 통과한다 — 실제로 그렇게 속았다)
  if (body.includes('Story not found')) report.fail(id, 'Story not found');
  else if (elementCount < 2) report.fail(id, `렌더된 요소 없음 (${elementCount})`);
  else if (real.length) report.fail(id, real[0].slice(0, 160));
}

await browser.close();

report.done(ids.length, '런타임 에러 없이 렌더');
