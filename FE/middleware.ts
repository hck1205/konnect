import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, negotiateLocale, splitLocalePath } from '@/lib/i18n';

/**
 * 로케일 라우팅.
 *
 * 로케일 세그먼트가 없는 경로로 들어오면 **Accept-Language 를 보고** 그 사용자의
 * 언어로 리다이렉트한다. 처음 방문한 사람이 영어 화면을 만나고 언어를 직접
 * 찾아야 하는 상황을 없앤다.
 *
 * 로케일을 URL 에 두는 이유는 SEO 다 — 언어별 고유 URL 이 있어야 검색엔진이
 * 언어별로 색인한다. 쿠키 기반이면 같은 URL 이 사람마다 다른 언어를 보여줘
 * 색인이 하나로 뭉개진다.
 * → docs/30-architecture/06-i18n-strategy.md
 *
 * 307(임시)을 쓴다 — 협상 결과는 요청마다 달라질 수 있어 영구 리다이렉트가 아니다.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { locale } = splitLocalePath(pathname);

  if (locale) return NextResponse.next();

  const negotiated =
    negotiateLocale(request.headers.get('accept-language')) ?? DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${negotiated}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  // 정적 파일·API·Next 내부 경로는 건드리지 않는다
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
