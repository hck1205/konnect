/**
 * 디자인 토큰 대비 검증 — `npm run check:contrast`
 *
 * globals.css 의 팔레트를 파싱해, 실제로 쓰이는 전경/배경 조합의 WCAG 대비를 계산한다.
 * 색 토큰을 바꾸면 이걸 돌린다. 눈으로 판단하지 않는다.
 *   문서: docs/25-design/10-foundations/01-color.md
 *
 * 종료 코드: 통과 0 / 실패 1 (CI 에 그대로 붙일 수 있다)
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, '../src/app/globals.css'), 'utf8');

/** `--color-brand-700: #0f766e;` 형태의 primitive 만 수집한다 */
function parsePalette(source) {
  const palette = {};
  for (const [, name, hex] of source.matchAll(
    /--color-([a-z]+-\d+):\s*(#[0-9a-fA-F]{6})\s*;/g,
  )) {
    palette[name] = hex.toLowerCase();
  }
  return palette;
}

const P = parsePalette(css);

/** WCAG 2.x 상대휘도 */
function luminance(hex) {
  const channel = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** 토큰 이름 → hex. 팔레트에 없으면 즉시 실패시킨다(오타를 통과시키지 않는다) */
function color(name) {
  if (name.startsWith('#')) return name;
  const hex = P[name];
  if (!hex) throw new Error(`팔레트에 없는 토큰: --color-${name}`);
  return hex;
}

/* ── 검사 대상 ──────────────────────────────────────────────────────
   globals.css 의 semantic 매핑과 같아야 한다. 한쪽만 바꾸면 여기서 잡힌다. */
const TEXT = 4.5; // WCAG AA 본문
const UI = 3.0; // WCAG 1.4.11 비텍스트

const LIGHT_SURFACES = [
  ['surface', 'neutral-0'],
  ['raised', 'neutral-50'],
  ['sunken', 'neutral-100'],
];
const DARK_SURFACES = [
  ['surface', 'neutral-950'],
  ['raised', 'neutral-900'],
];

const cases = [];
const add = (label, fg, bg, need) => cases.push({ label, fg, bg, need });

for (const [bn, bg] of LIGHT_SURFACES) {
  add(`L fg          on ${bn}`, 'neutral-900', bg, TEXT);
  add(`L fg-muted    on ${bn}`, 'neutral-600', bg, TEXT);
  add(`L fg-subtle   on ${bn}`, 'neutral-550', bg, TEXT);
  add(`L brand link  on ${bn}`, 'brand-700', bg, TEXT);
  add(`L success     on ${bn}`, 'success-700', bg, TEXT);
  add(`L warning     on ${bn}`, 'warning-700', bg, TEXT);
  add(`L danger      on ${bn}`, 'danger-700', bg, TEXT);
  add(`L info        on ${bn}`, 'info-700', bg, TEXT);
}
for (const [bn, bg] of DARK_SURFACES) {
  add(`D fg          on ${bn}`, 'neutral-100', bg, TEXT);
  add(`D fg-muted    on ${bn}`, 'neutral-400', bg, TEXT);
  add(`D fg-subtle   on ${bn}`, 'neutral-750', bg, TEXT);
  add(`D brand link  on ${bn}`, 'brand-300', bg, TEXT);
  add(`D success     on ${bn}`, 'success-400', bg, TEXT);
  add(`D warning     on ${bn}`, 'warning-400', bg, TEXT);
  add(`D danger      on ${bn}`, 'danger-400', bg, TEXT);
  add(`D info        on ${bn}`, 'info-400', bg, TEXT);
}

// solid 채움 위 글자
add('L on brand-solid', 'neutral-0', 'brand-700', TEXT);
add('L on brand-solid-hover', 'neutral-0', 'brand-800', TEXT);
add('D on brand-solid', 'neutral-950', 'brand-400', TEXT);
add('D on brand-solid-hover', 'neutral-950', 'brand-300', TEXT);

// subtle 배너 (R1 고지 등)
for (const s of ['brand', 'success', 'warning', 'danger', 'info']) {
  add(`L ${s} subtle 배너`, `${s}-800`, `${s}-50`, TEXT);
  add(`D ${s} subtle 배너`, `${s}-300`, `${s}-950`, TEXT);
}

// 비텍스트 — 입력 테두리 / 포커스링
for (const [bn, bg] of LIGHT_SURFACES) {
  add(`L border-interactive on ${bn}`, 'neutral-450', bg, UI);
  add(`L focus-ring         on ${bn}`, 'brand-700', bg, UI);
}
for (const [bn, bg] of DARK_SURFACES) {
  add(`D border-interactive on ${bn}`, 'neutral-500', bg, UI);
  add(`D focus-ring         on ${bn}`, 'brand-400', bg, UI);
}

/* ── 실행 ─────────────────────────────────────────────────────────── */
let failed = 0;
for (const { label, fg, bg, need } of cases) {
  const ratio = contrast(color(fg), color(bg));
  const pass = ratio >= need;
  if (!pass) failed += 1;
  if (!pass || process.env.VERBOSE) {
    console.log(
      `${pass ? 'ok  ' : 'FAIL'}  ${ratio.toFixed(2).padStart(5)} / ${need}  ${label}  (${fg} on ${bg})`,
    );
  }
}

console.log(
  failed === 0
    ? `\n✅ 대비 검증 통과 — ${cases.length}개 조합 (VERBOSE=1 로 전체 출력)`
    : `\n❌ ${failed}/${cases.length}개 조합 실패`,
);
process.exit(failed === 0 ? 0 : 1);
