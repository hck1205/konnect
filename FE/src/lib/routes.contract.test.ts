import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { routes } from './routes';

/**
 * `routes.*` 가 내는 경로가 `src/app` 아래에 **실제로 존재하는지** 대조한다.
 *
 * 왜 필요한가: 선언과 실물 사이에 아무 결합이 없다. `routes.ts` 는 `src/app` 을
 * 참조하지 않으므로, 없는 라우트를 가리키는 헬퍼를 만들어도
 * **타입체크·린트·빌드·단위 테스트가 전부 통과한다.**
 *
 * 실제로 그렇게 됐다 — `routes.ask` 가 없는 `/[locale]/ask` 를 가리켰고,
 * 척추 페이지의 유일한 행동 유도가 거기로 갔다. 질문이 아직 세 건뿐이라
 * **48판 중 대부분이 그 분기를 그리는데도** 아무것도 잡지 못했다.
 * 같은 저장소가 홈 네비에서 이미 한 번(guides·meetups) 걷어낸 실수다.
 *
 * `routes.test.ts` 와 나누는 이유는 `slug.contract.test.ts` 와 같다 —
 * 저쪽은 헬퍼의 **동작**을, 여기는 사본과 원본의 **일치**를 본다.
 */

const APP = resolve(import.meta.dirname, '..', 'app');

/** `src/app` 을 훑어 page 를 가진 세그먼트 경로를 모은다 */
function collectRoutes(dir: string, prefix = ''): string[] {
  const found: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    // 라우트 그룹 `(group)` 과 병렬 라우트 `@slot` 은 URL 에 나타나지 않는다
    const hidden = name.startsWith('(') || name.startsWith('@');
    const path = hidden ? prefix : `${prefix}/${name}`;
    const entries = readdirSync(full);
    if (entries.some((f) => /^page\.(tsx|ts|jsx|js)$/.test(f))) found.push(path || '/');
    found.push(...collectRoutes(full, path));
  }
  return found;
}

/**
 * 동적 세그먼트를 정규식으로 바꾼다.
 * `[x]` 는 한 조각, `[...x]` 는 한 조각 이상, `[[...x]]` 는 없어도 된다.
 */
function toMatcher(route: string): RegExp {
  const body = route
    .split('/')
    .filter(Boolean)
    .map((seg) => {
      if (/^\[\[\.\.\..+\]\]$/.test(seg)) return '(?:/[^/]+)*';
      if (/^\[\.\.\..+\]$/.test(seg)) return '(?:/[^/]+)+';
      if (/^\[.+\]$/.test(seg)) return '/[^/]+';
      return `/${seg}`;
    })
    .join('');
  return new RegExp(`^${body || '/'}$`);
}

const existing = collectRoutes(APP);
const matchers = existing.map(toMatcher);
const exists = (path: string) => matchers.some((m) => m.test(path));

/**
 * 각 헬퍼를 **실제로 호출해** 경로를 얻는다.
 *
 * 소스를 정규식으로 읽지 않는 이유: 헬퍼가 조건 분기를 갖는 순간 틀린다.
 * `routes.question` 은 실제로 분기를 가졌었고, `routes.ask` 는 지금도 갖는다.
 */
const SAMPLES: Record<keyof typeof routes, string[]> = {
  home: [routes.home('en')],
  questions: [routes.questions('en')],
  // 분기가 있으면 **분기마다** 넣는다 — 한쪽만 죽을 수 있다.
  // 이모지 제목은 slug 가 비어 `SLUG_FALLBACK` 으로 가는 경로다.
  question: [routes.question('en', 'ID', 'A Title'), routes.question('en', 'ID', '🎉')],
  visa: [routes.visa('en', 'f-2')],
  topic: [routes.topic('en', 'work')],
};

describe('routes ↔ src/app', () => {
  it('src/app 에서 라우트를 찾아낸다 — 못 찾으면 아래 검사가 전부 무의미하다', () => {
    expect(existing.length).toBeGreaterThan(0);
    expect(existing).toContain('/[locale]');
  });

  it.each(Object.entries(SAMPLES))('routes.%s 가 실재하는 page 를 가리킨다', (_name, paths) => {
    for (const withQuery of paths) {
      const path = withQuery.split('?')[0];
      expect(exists(path), `${path} 에 해당하는 page 가 src/app 에 없다`).toBe(true);
    }
  });

  it('새 헬퍼가 늘면 여기도 늘어야 한다 — 빠뜨리면 검사가 조용히 좁아진다', () => {
    expect(Object.keys(SAMPLES).sort()).toEqual(Object.keys(routes).sort());
  });
});
