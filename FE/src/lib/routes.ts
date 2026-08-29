import { slugify } from '@/lib/text';

/**
 * 라우트 경로의 단일 출처.
 * 링크/리다이렉트는 문자열 리터럴 대신 이 헬퍼를 사용한다 —
 * 경로가 바뀌어도 이 파일만 고치면 된다.
 */
export const routes = {
  home: (locale: string) => `/${locale}`,
  questions: (locale: string) => `/${locale}/questions`,

  /**
   * 질문 상세의 **정규 URL**.
   *
   * id 는 UUIDv7 이라 사람도 검색엔진도 읽을 수 없다 — 제목 slug 를 붙인다.
   * slug 가 없거나 틀리면 여기로 301 한다(제목이 수정되면 slug 가 바뀐다).
   * → docs/30-architecture/07-routes-and-indexing.md
   */
  question: (locale: string, id: string, title: string) => {
    const slug = questionSlug(title);
    return slug
      ? `/${locale}/questions/${id}/${slug}`
      : `/${locale}/questions/${id}`;
  },
} as const;

/**
 * 제목 → URL slug.
 *
 * 길이를 제한한다 — 제목이 길면 URL 이 잘려 공유될 때 깨지고, 검색 결과에서도
 * 뒤가 생략된다. 자르다가 단어 중간이 되지 않게 마지막 하이픈에서 끊는다.
 */
export const SLUG_MAX_LENGTH = 60;

export function questionSlug(title: string): string {
  const full = slugify(title);
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
