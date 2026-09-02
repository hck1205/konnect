import { slugify } from '@/lib/text';

/**
 * 라우트 경로의 단일 출처.
 * 링크/리다이렉트는 문자열 리터럴 대신 이 헬퍼를 사용한다 —
 * 경로가 바뀌어도 이 파일만 고치면 된다.
 */
export const routes = {
  /**
   * 홈. **로케일을 붙여야 한다** — `/` 로 보내면 프록시가 Accept-Language 로
   * 다시 협상해서, `/en` 을 보고 있던 사용자가 브랜드 로고를 눌렀을 때
   * 브라우저 설정에 따라 `/ko` 로 튕긴다. 사용자가 이미 고른 언어를 버리는 셈이다.
   */
  home: (locale: string) => `/${locale}`,
  questions: (locale: string) => `/${locale}/questions`,

  /**
   * 비자 척추. **질문이 0건이어도 성립하는 페이지**라 승격 기준을 적용하지 않는다 —
   * 법령은 우리 사용자와 무관하게 이미 존재한다.
   * → docs/20-product/10-features/12-official-data-pipeline.md
   */
  visa: (locale: string, code: string) => `/${locale}/visa/${code}`,

  /** 주제 허브. 게시판의 1차 축이고 값이 여섯으로 닫혀 있다 */
  topic: (locale: string, topic: string) => `/${locale}/topics/${topic}`,

  /*
   * 작성 화면(`ask`)은 **여기 없다.** 라우트가 아직 없기 때문이다.
   *
   * 한 번 있었고, 없는 `/[locale]/ask` 를 가리켰다 — 척추 48판 대부분의
   * 유일한 출구가 404 로 갔는데 타입체크·린트·빌드·테스트가 전부 통과했다.
   * 헬퍼가 먼저 생기면 화면이 그걸 믿고 링크를 건다. **page 를 먼저 만들고
   * 그 다음에 여기 추가한다** — `routes.contract.test.ts` 가 순서를 강제한다.
   */

  /**
   * 질문 상세의 **정규 URL**.
   *
   * id 는 UUIDv7 이라 사람도 검색엔진도 읽을 수 없다 — 제목 slug 를 붙인다.
   * slug 가 없거나 틀리면 여기로 308 한다(제목이 수정되면 slug 가 바뀐다).
   * → docs/30-architecture/07-routes-and-indexing.md
   */
  question: (locale: string, id: string, title: string) =>
    // questionSlug 가 빈 문자열을 내지 않으므로 분기가 필요 없다.
    // 분기를 남겨 두면 slug 없는 경로가 정규 URL 이 되어 자기 자신으로 308 한다.
    `/${locale}/questions/${id}/${questionSlug(title)}`,
} as const;

/**
 * 제목 → URL slug.
 *
 * 길이를 제한한다 — 제목이 길면 URL 이 잘려 공유될 때 깨지고, 검색 결과에서도
 * 뒤가 생략된다. 자르다가 단어 중간이 되지 않게 마지막 하이픈에서 끊는다.
 */
export const SLUG_MAX_LENGTH = 60;

/**
 * slug 가 비었을 때 대신 쓰는 값.
 *
 * ⚠️ **이게 없으면 그 질문은 어떤 주소로도 열리지 않는다.**
 * `slugify` 는 `\p{L}\p{N}` 이 아닌 것을 전부 버리므로 이모지·문장부호만인 제목은
 * 빈 문자열이 된다. 그러면 `routes.question` 이 slug 없는 경로를 내는데,
 * slug 없는 라우트는 **정규 URL 로 308** 을 보낸다 — 그 정규 URL 이 자기 자신이라
 * 무한 루프가 된다(실측: 같은 주소로 308 이 반복된다).
 *
 * 500 도 404 도 아니라 로그에 안 남는 조용한 종류다.
 * `uniqueSlugs` 가 이미 같은 이유로 `|| fallback` 을 쓴다.
 */
export const SLUG_FALLBACK = 'q';

export function questionSlug(title: string): string {
  const full = slugify(title);
  if (!full) return SLUG_FALLBACK;
  if (full.length <= SLUG_MAX_LENGTH) return full;

  const cut = full.slice(0, SLUG_MAX_LENGTH);
  const lastDash = cut.lastIndexOf('-');
  // 하이픈이 없으면(한 단어가 아주 긴 경우) 그냥 자른다
  return lastDash > 0 ? cut.slice(0, lastDash) : cut;
}

/**
 * URL 파라미터 → slug. 비ASCII slug는 퍼센트 인코딩되어 들어오므로 디코드한다.
 * 잘못된 인코딩(%zz 등)은 원문을 그대로 돌려준다.
 */
export function decodeSlug(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}
