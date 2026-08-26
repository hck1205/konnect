import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from './locales';

/**
 * URL 경로에서 로케일을 떼어낸다.
 *
 * 로케일을 **URL 에 두는 이유**: 검색엔진이 언어별로 색인하려면 각 언어가
 * 고유 URL 을 가져야 한다. 쿠키 기반으로 하면 같은 URL 이 사람마다 다른 언어를
 * 보여줘 색인이 하나로 뭉개진다 — 검색 유입이 주 채널인 이 서비스에서는 손해다.
 * → docs/30-architecture/06-i18n-strategy.md
 */
export function splitLocalePath(pathname: string): {
  locale: Locale | null;
  rest: string;
} {
  const [, maybeLocale = '', ...others] = pathname.split('/');
  if (!isLocale(maybeLocale)) return { locale: null, rest: pathname };
  return { locale: maybeLocale, rest: `/${others.join('/')}` };
}

/** 현재 경로의 로케일만 바꾼 경로 — 언어 전환기가 쓴다 */
export function withLocale(pathname: string, locale: Locale): string {
  const { rest } = splitLocalePath(pathname);
  const suffix = rest === '/' ? '' : rest;
  return `/${locale}${suffix}`;
}

/**
 * `Accept-Language` 헤더 → 지원 로케일.
 *
 * 처음 방문한 사용자를 자기 언어로 보내는 데 쓴다. 품질값(`q=`)을 존중하고,
 * `zh-CN` 처럼 지역이 붙은 태그는 기본 태그(`zh`)로 떨어뜨린다.
 * 일치하는 것이 없으면 기준 로케일이다.
 */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag = '', ...params] = part.trim().split(';');
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith('q='))
        ?.slice(2);
      return { tag: tag.trim().toLowerCase(), q: q === undefined ? 1 : Number(q) };
    })
    .filter((entry) => entry.tag.length > 0 && !Number.isNaN(entry.q))
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    if (isLocale(tag)) return tag;
    const base = tag.split('-')[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

export { LOCALES, DEFAULT_LOCALE };
