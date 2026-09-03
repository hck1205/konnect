import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

/**
 * **화면에서 실제로 도달 가능한 파일**의 집합. 검사 스크립트 전용이다.
 *
 * 앱 코드는 이걸 import 하지 않는다 — `views/`·`app/` 을 시드로 import 를 따라가는
 * 정적 분석이라 런타임에 쓸 것이 없다.
 *
 * ## 왜 필요한가
 *
 * "이 컴포넌트는 아직 화면에서 안 쓴다" 를 **직접 사용(`<Name`)만으로 판정하면 틀린다.**
 * 컴포넌트가 다른 컴포넌트를 거쳐 렌더되면 `views/`·`app/` 어디에도 그 태그가 없다.
 *
 * 실증 사례가 있다: `SkipLink` 는 `views/`·`app/` 에 단 한 번도 안 나오는데
 * `AppShell` 을 거쳐 **모든 페이지에 렌더된다.** 그래서 영어 'Skip to content' 가
 * 네 로케일 전부의 첫 포커스 요소인데 어떤 검사에도 안 걸렸다.
 *
 * 면제 목록은 시간이 지나면 반드시 썩는다. 썩는 것을 막는 유일한 방법은
 * **면제의 근거(아직 안 쓴다)를 사실로 확인하는 것**이고, 그 사실은
 * 도달 가능성이지 문자열 검색이 아니다.
 */

const SOURCE_EXT = new Set(['.ts', '.tsx']);

/** 검사에서 제외할 파일 — 테스트·스토리·타입 선언 */
const isSupportFile = (path: string) =>
  /\.(test|spec|stories)\.[tj]sx?$/.test(path) || path.endsWith('.d.ts');

export function walkSource(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walkSource(full);
    return SOURCE_EXT.has(extname(full)) && !isSupportFile(full) ? [full] : [];
  });
}

/**
 * 한 파일이 import 하는 **저장소 안의** 경로들.
 *
 * `@/` 별칭과 상대 경로만 따라간다 — 패키지는 우리 코드가 아니다.
 * 확장자·`index` 를 붙여 가며 실제 파일을 찾는다(번들러가 하는 해석과 같다).
 */
function importsOf(file: string, srcRoot: string): string[] {
  const text = readFileSync(file, 'utf8');
  const specs = [...text.matchAll(/from\s+['"]([^'"]+)['"]/g)].map((m) => m[1]);

  const resolved: string[] = [];
  for (const spec of specs) {
    let base: string;
    if (spec.startsWith('@/')) base = join(srcRoot, spec.slice(2));
    else if (spec.startsWith('.')) base = join(file, '..', spec);
    else continue;

    for (const candidate of [
      `${base}.tsx`,
      `${base}.ts`,
      join(base, 'index.tsx'),
      join(base, 'index.ts'),
    ]) {
      try {
        if (statSync(candidate).isFile()) {
          resolved.push(candidate);
          break;
        }
      } catch {
        // 없으면 다음 후보 — 패키지이거나 타입 전용 경로다
      }
    }
  }
  return resolved;
}

/**
 * `views/` 와 `app/` 에서 import 를 따라 **도달 가능한 모든 파일**.
 *
 * 배럴(`index.ts`)을 지나가므로 배럴이 재수출하는 형제까지 도달로 잡힌다 —
 * 그게 실제 번들 동작이기도 하다(트리셰이킹 전 기준). 면제 판정에서는
 * 보수적인 쪽이 옳다: **도달할지도 모르는 것을 "안 쓴다" 로 부르지 않는다.**
 */
export function reachableFromScreens(srcRoot: string): Set<string> {
  const seeds = [join(srcRoot, 'views'), join(srcRoot, 'app')].flatMap(walkSource);

  const seen = new Set<string>(seeds);
  const queue = [...seeds];
  while (queue.length > 0) {
    const file = queue.pop()!;
    for (const next of importsOf(file, srcRoot)) {
      if (seen.has(next)) continue;
      seen.add(next);
      queue.push(next);
    }
  }
  return seen;
}
