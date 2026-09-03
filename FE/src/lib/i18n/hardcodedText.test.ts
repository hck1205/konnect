import { readFileSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { reachableFromScreens, walkSource } from '@/lib/dev/reachable';

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
 * **화면에서 도달할 수 없는** 디자인 시스템 컴포넌트.
 *
 * 라벨을 사전에서 받을지 prop 으로 받을지는 **쓰는 화면이 정해질 때** 정한다 —
 * 지금 정하면 근거 없이 정하는 것이다(`AppShell`·`PageHeader` 는 실제 렌더
 * 경로에 있어서 prop 으로 정했다. 서버 컴포넌트라 사전을 물리면 안 됐다).
 *
 * ⚠️ 목록이 조용히 썩지 않게, **여기 적힌 파일이 정말 도달 불가인지 아래에서 확인한다.**
 * 판정은 `views/`·`app/` 에서 import 를 따라가는 **도달 그래프**로 한다 —
 * 직접 grep 은 컴포넌트를 거쳐 렌더되는 것을 못 본다(`SkipLink` 가 그랬다:
 * `views/`·`app/` 에 한 번도 안 나오는데 `AppShell` 을 거쳐 모든 페이지에 있었다).
 *
 * 화면이 이 컴포넌트를 (몇 단계를 거쳐서든) 쓰기 시작하면 그 순간 테스트가 깨지고,
 * 그때 문구를 사전으로 옮긴다. 목록만 두고 확인이 없으면
 * "전부 검사했다" 처럼 보이는데 실제로는 지나친다.
 */
const NOT_ON_SCREEN_YET = [
  'components/community/ReportDialog/ReportDialog.tsx',
  'components/data-display/Checklist/Checklist.tsx',
  'components/data-display/FreshnessIndicator/FreshnessIndicator.tsx',
  'components/data-display/Quote/Quote.tsx',
  'components/feedback/ErrorState/ErrorState.tsx',
  'components/feedback/LoadingState/LoadingState.tsx',
  'components/forms/FileInput/FileDropzone/FileDropzone.tsx',
  'components/forms/FileInput/FileInput.tsx',
  'components/forms/FileInput/FileList/FileList.tsx',
  'components/forms/SearchInput/SearchInput.tsx',
  'components/forms/TagInput/TagInput.tsx',
  'components/navigation/BackLink/BackLink.tsx',
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

/** 주석은 검사 대상이 아니다 — 이 저장소는 주석을 한국어로 길게 쓴다 */
const stripComments = (s: string) =>
  s
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^[ \t]*\/\/.*$/gm, '');

/**
 * 사용자가 읽거나 스크린리더가 읽는 자리의 문자열 리터럴.
 *
 * ⚠️ 예전에는 큰따옴표 속성 넷과 JSX 텍스트만 봤다. 그런데 이 저장소가 문구를
 * 나르는 방식이 그것만이 아니어서 **네 통로가 통째로 사각지대였다**:
 *
 * | 통로 | 실제로 새던 것 |
 * | --- | --- |
 * | 기본 매개변수 값 | `children = 'Skip to content'` — 모든 페이지의 첫 포커스 요소 |
 * | `label` 계열 prop | `label="Open menu"` — 모바일 햄버거 |
 * | const 문자열 맵 | `{ light: 'Theme: light' }` — 테마 버튼 |
 * | 템플릿 리터럴 | aria-label 안에 보간과 영문이 섞인 것 |
 *
 * 그리고 `.tsx` 만 읽었다. 이 저장소의 관례가 **"표시 규칙은 옆 `.utils.ts` 로 뺀다"**
 * 이므로 문구를 한 칸만 옮기면 검사에서 사라졌다 — 태그 네임스페이스 라벨이
 * 정확히 그렇게 네 로케일 모두 영어로 나가고 있었다.
 */

/** 접근 이름을 나르는 속성·prop. 이 저장소는 `label` 로도 나른다 */
const LABEL_ATTR =
  'aria-label|aria-description|aria-placeholder|label|placeholder|alt|title' +
  '|retryLabel|confirmLabel|cancelLabel|emptyLabel|closeLabel|dismissLabel|menuLabel';

const ATTR_QUOTED = new RegExp(`\\b(${LABEL_ATTR})=["']([^"']+)["']`, 'g');
const ATTR_TEMPLATE = new RegExp(`\\b(${LABEL_ATTR})=\\{\`([^\`]+)\`\\}`, 'g');
const DEFAULT_PARAM = new RegExp(
  `\\b(${LABEL_ATTR}|children|text|message|heading)\\s*=\\s*'([A-Z][^']{2,})'`,
  'g',
);
/** JSX 텍스트 노드 — 대문자로 시작하는 라틴 문자열만. 소문자 시작은 코드 조각이 많다 */
const JSX_TEXT = />\s*([A-Z][A-Za-z][^<>{}\n]{2,})\s*</g;
/** `{ light: 'Theme: light' }` 같은 표시 문구 맵. 키·경로·클래스는 이 모양이 아니다 */
const MAP_VALUE = /^\s*[a-zA-Z_$][\w$]*:\s*'([A-Z][A-Za-z][^']{3,})',?\s*$/gm;

function findLiterals(source: string): { where: string; value: string }[] {
  const src = stripComments(source);
  const found: { where: string; value: string }[] = [];

  for (const m of src.matchAll(ATTR_QUOTED)) found.push({ where: m[1], value: m[2] });

  // 보간을 빼고 남는 영문이 있으면 그것이 하드코딩이다
  for (const m of src.matchAll(ATTR_TEMPLATE)) {
    const literal = m[2].replace(/\$\{[^}]*\}/g, ' ').trim();
    if (/[A-Za-z]{3}/.test(literal)) found.push({ where: `${m[1]}(template)`, value: literal });
  }

  for (const m of src.matchAll(DEFAULT_PARAM)) {
    found.push({ where: `기본값 ${m[1]}`, value: m[2] });
  }
  for (const m of src.matchAll(JSX_TEXT)) found.push({ where: 'text', value: m[1].trim() });
  for (const m of src.matchAll(MAP_VALUE)) found.push({ where: '맵 값', value: m[1] });

  return found.filter((f) => !NOT_TRANSLATABLE.test(f.value.trim()));
}


const rel = (f: string) => f.slice(SRC.length + 1).split(sep).join('/');

/** `.tsx` 만이 아니라 `.ts` 도 본다 — 문구가 옆 `.utils.ts` 로 새던 통로다 */
const files = [
  ...walkSource(join(SRC, 'views')),
  ...walkSource(join(SRC, 'components')),
].map(rel);

/** 화면에서 import 를 따라 도달 가능한 파일 — 면제의 근거를 사실로 확인한다 */
const reachable = new Set([...reachableFromScreens(SRC)].map(rel));

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
   * 면제 목록이 썩지 않게 한다.
   *
   * ⚠️ 예전에는 `views/`·`app/` 원문에 `<Name` 이 있는지 **grep** 했다.
   * 그러면 컴포넌트를 거쳐 렌더되는 것을 못 본다 — `SkipLink` 가 실증이다:
   * `views/`·`app/` 에 단 한 번도 안 나오는데 `AppShell` 을 거쳐
   * **모든 페이지의 첫 포커스 요소로 렌더된다.**
   *
   * 이제 import 그래프의 도달 가능성으로 판정한다. 화면이 그 컴포넌트를
   * (몇 단계를 거쳐서든) 쓰기 시작하면 그 순간 깨진다.
   */
  it.each(NOT_ON_SCREEN_YET)('%s 는 화면에서 도달할 수 없다', (file) => {
    expect(
      reachable.has(file),
      `${file} 이 화면에서 도달 가능해졌다 — 면제를 지우고 문구를 사전으로 옮긴다`,
    ).toBe(false);
  });

  it('면제 목록의 파일이 실제로 존재한다 — 옮기거나 지우면 목록이 거짓말이 된다', () => {
    for (const file of NOT_ON_SCREEN_YET) {
      expect(files, `${file} 가 없다`).toContain(file);
    }
  });
});
