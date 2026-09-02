import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * 화면 문자열이 **사전을 우회하지 않는지** 본다.
 *
 * 왜 `messages.test.ts` 로는 안 되나: 그건 사전끼리만 비교한다. 컴포넌트 안에
 * 영어를 박아 두면 **어느 사전에도 나타나지 않으므로 원리적으로 보이지 않는다.**
 * 그렇게 실제로 새어 나갔다 — 홈의 tagline·intro, 척추 부제, `aria-label="visa"`,
 * `aria-label="Main"`, `aria-label="Page sidebar"`.
 *
 * 이 종류가 특히 나쁜 이유: **번역자에게 보이지 않는다.** 사전 누락은 번역자가
 * 채우면 사라지지만, 하드코딩은 사전을 아무리 완성해도 남는다. 문서가 출시 차단
 * 조건으로 정한 zh·vi 원어민 검수를 끝내도 그대로 있다.
 * → docs/30-architecture/06-i18n-strategy.md
 *
 * 검사 대상은 **사용자가 읽거나 스크린리더가 읽는 자리**다:
 * JSX 텍스트 노드와 `aria-label`·`placeholder`·`alt`·`title` 속성.
 */

const SRC = resolve(import.meta.dirname, '..', '..');

/**
 * 아직 어느 화면에서도 쓰지 않는 디자인 시스템 컴포넌트.
 *
 * 라벨을 사전에서 받을지 prop 으로 받을지는 **쓰는 화면이 정해질 때** 정한다 —
 * 지금 정하면 근거 없이 정하는 것이다(`AppShell`·`PageHeader` 는 실제 렌더
 * 경로에 있어서 prop 으로 정했다. 서버 컴포넌트라 사전을 물리면 안 됐다).
 *
 * ⚠️ 목록이 조용히 썩지 않게, **여기 적힌 파일이 정말 안 쓰이는지 아래에서 확인한다.**
 * 화면이 이 컴포넌트를 쓰기 시작하면 그 순간 테스트가 깨지고, 그때 라벨을 정한다.
 * 목록만 두고 확인이 없으면 "전부 검사했다" 처럼 보이는데 실제로는 지나친다.
 */
const NOT_ON_SCREEN_YET = [
  'components/data-display/Checklist/Checklist.tsx',
  'components/data-display/FreshnessIndicator/FreshnessIndicator.tsx',
  'components/data-display/Quote/Quote.tsx',
  'components/forms/FileInput/FileDropzone/FileDropzone.tsx',
  'components/forms/SearchInput/SearchInput.tsx',
  'components/navigation/Breadcrumb/Breadcrumb.tsx',
  'components/navigation/Pagination/Pagination.tsx',
  'components/navigation/TableOfContents/TableOfContents.tsx',
];

/**
 * 번역 대상이 아닌 문자열.
 *
 * 고유명사(제품 이름)와 **한국어 원문 인용**이다. 후자는 번역하면 안 된다 —
 * 사용자가 실제 서류나 law.go.kr 에서 그 글자를 눈으로 찾는다.
 */
const NOT_TRANSLATABLE = /^(konnect|[^\p{Script=Latin}]*)$/u;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return extname(full) === '.tsx' && !full.includes('.stories.') ? [full] : [];
  });
}

/** 주석은 검사 대상이 아니다 — 이 저장소는 주석을 한국어로 길게 쓴다 */
const stripComments = (s: string) =>
  s
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^[ \t]*\/\/.*$/gm, '');

/** 사용자가 읽거나 스크린리더가 읽는 자리의 문자열 리터럴 */
function findLiterals(source: string): { where: string; value: string }[] {
  const src = stripComments(source);
  const found: { where: string; value: string }[] = [];

  for (const m of src.matchAll(/\b(aria-label|placeholder|alt|title)="([^"]+)"/g)) {
    found.push({ where: m[1], value: m[2] });
  }
  // JSX 텍스트 노드 — 대문자로 시작하는 라틴 문자열만 본다.
  // 소문자 시작은 대개 코드 조각이라 오탐이 많다.
  for (const m of src.matchAll(/>\s*([A-Z][A-Za-z][^<>{}\n]{2,})\s*</g)) {
    found.push({ where: 'text', value: m[1].trim() });
  }
  return found.filter((f) => !NOT_TRANSLATABLE.test(f.value.trim()));
}

const files = [...walk(join(SRC, 'views')), ...walk(join(SRC, 'components'))].map((f) =>
  f.slice(SRC.length + 1).replace(/\\/g, '/'),
);

describe('화면 문자열이 사전을 우회하지 않는다', () => {
  it('검사할 파일을 실제로 찾았다 — 0건이면 아래가 전부 무의미하다', () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it.each(files.filter((f) => !NOT_ON_SCREEN_YET.includes(f)))('%s', (file) => {
    const literals = findLiterals(readFileSync(join(SRC, file), 'utf8'));
    expect(
      literals.map((l) => `${l.where}="${l.value}"`),
      '사전에 넣고 t() 로 읽거나, 서버 컴포넌트라면 번역된 문구를 prop 으로 받는다',
    ).toEqual([]);
  });

  /**
   * 면제 목록이 썩지 않게 한다. 여기 적힌 컴포넌트를 화면이 쓰기 시작하면
   * 하드코딩된 라벨이 사용자에게 나가기 시작하는 것이므로 그때 깨져야 한다.
   */
  it.each(NOT_ON_SCREEN_YET)('%s 는 아직 어느 화면에서도 쓰지 않는다', (file) => {
    const name = file.split('/').pop()!.replace('.tsx', '');
    const users = [...walk(join(SRC, 'views')), ...walk(join(SRC, 'app'))].filter((f) =>
      new RegExp(`<${name}[\\s/>]`).test(readFileSync(f, 'utf8')),
    );
    expect(users, `${name} 을 쓰기 시작했다 — 면제를 지우고 라벨을 사전으로 옮긴다`).toEqual(
      [],
    );
  });

  it('면제 목록의 파일이 실제로 존재한다 — 옮기거나 지우면 목록이 거짓말이 된다', () => {
    for (const file of NOT_ON_SCREEN_YET) {
      expect(files, `${file} 가 없다`).toContain(file);
    }
  });
});
