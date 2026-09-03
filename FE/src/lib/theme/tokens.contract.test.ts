import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * 화면이 쓰는 색 클래스가 `globals.css` 에 **정의돼 있는지** 대조한다.
 *
 * ## 왜 이게 없으면 조용히 깨지나
 *
 * Tailwind v4 는 CSS-first 라 토큰이 `@theme inline` 안의 `--color-*` 로만 존재한다.
 * 없는 토큰을 쓰면 **에러가 아니라 그 클래스의 CSS 가 아예 생성되지 않는다.**
 * 타입체크도 린트도 빌드도 전부 통과하고, 화면은 그 스타일만 빠진 채 그려진다.
 *
 * 실제로 그렇게 나가고 있었다 — 살아 있는 화면 네 곳이 `accent-*`(존재한 적 없음)와
 * `surface-sunk`(진짜 이름은 `surface-sunken`)를 13곳에서 썼다. 결과:
 *
 * - `/questions` 의 **선택된 주제 칩이 비선택 칩과 시각적으로 구별되지 않았다**
 * - 척추 페이지의 인용 등급 배지가 배경 없이 렌더돼, 코드 주석이 스스로
 *   *"인용 등급이 다르다"* 고 적어 둔 법령 ↔ 공지 구분이 사라졌다
 *
 * ## 왜 `check:contrast` 로는 못 잡나
 *
 * 그 검사는 `globals.css` 만 읽어 **정의된 토큰끼리** 대비비를 잰다.
 * 화면이 어떤 이름을 부르는지는 그 파일에 없다 — 원리적으로 볼 수 없는 자리다.
 * `messages.test.ts` 가 사전끼리만 비교해 하드코딩을 못 보는 것과 같은 모양이다.
 */

const FE = resolve(import.meta.dirname, '..', '..', '..');
const SRC = join(FE, 'src');

/** Tailwind 색 유틸리티의 접두사 — 색 토큰을 참조하는 것만 */
// `shadow`·`divide` 는 색이 아닌 값도 받으므로(`shadow-e1`, `divide-y`) 뺀다.
// 좁게 두는 편이 낫다 — 넓히면 오탐이 늘어 진짜 오타가 그 사이에 숨는다.
const COLOR_PREFIX =
  '(?:bg|text|border|outline|ring|fill|stroke|decoration|from|via|to|caret)';

/**
 * 토큰이 아닌 값들. Tailwind 내장이거나 색이 아니다.
 * 좁게 유지한다 — 넓히면 진짜 오타가 여기로 숨는다.
 */
const NOT_A_TOKEN = new Set([
  'transparent', 'current', 'inherit', 'white', 'black', 'auto', 'none',
  // 색이 아닌 같은 접두사 유틸리티
  'center', 'left', 'right', 'justify', 'start', 'end', 'balance', 'pretty', 'nowrap', 'wrap',
  'collapse', 'separate', 'clip', 'ellipsis', 'sm', 'md', 'lg', 'xl', 'xs', 'base', 'solid', 'dashed', 'dotted',
  'offset', 'hidden', 'visible', 'top', 'bottom', 'inset', 'x', 'y', 'b', 't', 'l', 'r',
]);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return ['.tsx', '.ts'].includes(extname(full)) ? [full] : [];
  });
}

/** `globals.css` 의 `--color-*` 선언 → 쓸 수 있는 토큰 이름 */
function definedTokens(): Set<string> {
  const css = readFileSync(join(SRC, 'app', 'globals.css'), 'utf8');
    // ⚠️ `^` 로 줄머리에 묶지 않는다 — globals.css 는 한 줄에 세 선언을 함께 적는
  // 곳이 있어서(`--color-success: …; --color-success-subtle: …;`) 앵커를 걸면
  // **첫 개만 정의된 것으로 읽혀 나머지가 거짓 미정의가 된다.**
  return new Set([...css.matchAll(/--color-([a-z0-9-]+)\s*:/g)].map((m) => m[1]));
}

/**
 * 주석을 걷는다. 이 저장소는 주석에 클래스 이름을 자주 인용하므로
 * (이 파일도 그렇다) 걷지 않으면 산문이 오탐이 된다.
 */
const stripComments = (src: string) =>
  src
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^[ 	]*\/\/.*$/gm, '');

/** 소스에서 색 유틸리티가 부르는 토큰 이름 */
function referencedTokens(): Map<string, string[]> {
  // 변형(hover:·focus-visible:·dark: …)은 접두사가 앞에 붙을 뿐이라 그대로 잡힌다.
  // 임의값(`bg-[#fff]`)은 `[` 로 시작해 이 패턴에 안 맞는다.
  const re = new RegExp(
    `(?<![a-z0-9-])${COLOR_PREFIX}-([a-z][a-z0-9]*(?:-[a-z0-9]+)*)(?![a-z0-9-])`,
    'g',
  );
  const found = new Map<string, string[]>();
  for (const file of walk(SRC)) {
    if (file.endsWith('tokens.contract.test.ts')) continue;
    const text = stripComments(readFileSync(file, 'utf8'));
    for (const m of text.matchAll(re)) {
      const token = m[1];
      if (NOT_A_TOKEN.has(token)) continue;
      // `border-b-0`·`border-r-transparent`·`outline-offset-2` 처럼 방향/수치가
      // 끼는 유틸리티는 색 토큰이 아니다. 첫 조각이 한 글자면 방향이고,
      // 숫자로 시작하면 수치다.
      const head = token.split('-')[0];
      if (head.length < 2 || /^\d/.test(head) || head === 'offset') continue;
      const where = file.slice(FE.length + 1).split('\\').join('/');
      found.set(token, [...(found.get(token) ?? []), where]);
    }
  }
  return found;
}

const defined = definedTokens();
const referenced = referencedTokens();

describe('색 토큰 ↔ globals.css', () => {
  it('globals.css 에서 토큰을 실제로 읽었다 — 0개면 아래가 전부 무의미하다', () => {
    expect(defined.size).toBeGreaterThan(30);
    expect(defined.has('surface-sunken')).toBe(true);
    expect(defined.has('brand-solid')).toBe(true);
  });

  it('소스에서 색 클래스를 실제로 찾았다', () => {
    expect(referenced.size).toBeGreaterThan(10);
  });

  /**
   * 여기가 본체다. 없는 토큰을 쓰면 **CSS 가 생성되지 않고 에러도 안 난다.**
   */
  it('화면이 부르는 색 토큰이 전부 정의돼 있다', () => {
    const missing = [...referenced.entries()]
      .filter(([token]) => !defined.has(token))
      .map(([token, files]) => `${token} ← ${[...new Set(files)].join(', ')}`)
      .sort();

    expect(
      missing,
      'globals.css 의 @theme inline 에 --color-<이름> 을 더하거나, 이미 있는 이름으로 고친다',
    ).toEqual([]);
  });
});
