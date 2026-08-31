import { LOCALES, type Locale } from '@/lib/i18n';

/**
 * 색인 표면의 메타데이터를 만드는 단일 출처.
 *
 * 지금까지 각 페이지의 `generateMetadata` 가 `canonical` 과 `languages` 를 손으로
 * 조립했다. 라우트가 3종일 때는 되지만 10종이 되면 손복사가 10벌이 되고,
 * **한 곳만 빠져도 그 언어판이 중복 콘텐츠로 묶여 한 언어만 남는다.**
 * 그리고 그 누락은 타입체크도 빌드도 잡지 못한다.
 *
 * → docs/30-architecture/07-routes-and-indexing.md
 */

/**
 * 색인하는 페이지용 — canonical + 모든 로케일의 hreflang.
 *
 * `path` 는 로케일을 받아 그 언어판의 경로를 돌려주는 함수다.
 * `routes.questions` 처럼 그대로 넘기거나, 인자가 더 필요하면 감싸서 넘긴다.
 */
export function localeAlternates(locale: Locale, path: (l: Locale) => string) {
  return {
    canonical: path(locale),
    // hreflang — 없으면 언어별 판이 **중복 콘텐츠로 묶여 한 언어만 남는다**
    languages: Object.fromEntries(LOCALES.map((l) => [l, path(l)])),
  };
}

/**
 * 필터·개인화 판용 — 색인하지 않되 링크는 따라가게 둔다.
 *
 * `follow` 를 남기는 이유: 필터 목록이 **상세로 가는 크롤 경로**다.
 * `canonical` 은 언제나 필터 없는 정규 URL 을 가리킨다 — 조합이 무한한 URL 을
 * 각각 색인시키면 얕은 페이지가 쌓여 사이트 전체 품질 평가가 깎인다.
 *
 * `languages` 를 주지 않는 것도 의도다. 색인하지 않는 판에 hreflang 을 달면
 * 검색엔진에게 "이 판들도 언어별 대안" 이라고 말하는 셈이 된다.
 */
export function noindexAlternates(canonical: string) {
  return {
    robots: { index: false, follow: true },
    alternates: { canonical },
  };
}
