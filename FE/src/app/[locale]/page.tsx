import type { Metadata } from 'next';
import { HomePage } from '@/views/HomePage';
import { t, toLocale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { localeAlternates } from '@/lib/seo';

/**
 * 홈의 메타데이터.
 *
 * ⚠️ 이게 **없었다.** 그래서 링크가 가장 많이 모이는 페이지 넷(`/en`·`/ko`·`/zh`·`/vi`)에
 * canonical 도 hreflang 도 나가지 않았고, description 은 레이아웃의 **영어 한 줄**을
 * 네 판이 함께 물려받았다.
 *
 * hreflang 이 없으면 검색엔진이 네 언어판을 **중복 콘텐츠로 묶어 한 언어만 남긴다** —
 * 다국어가 이 제품의 전제인데(ADR-0005) 정작 그 신호를 홈이 안 보내고 있었다.
 *
 * 다른 색인 라우트는 전부 `localeAlternates` 를 쓰는데 홈만 빠져 있었다.
 * 라우트 셸에는 화면이 없어서 눈으로 볼 것이 없고, 하드코딩 검사도 `app/` 을
 * 훑지 않는다 — 검사와 눈 둘 다의 사각지대였다.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = toLocale((await params).locale);
  return {
    // 제목은 제품 이름 그대로 — 템플릿(`%s · konnect`)이 붙지 않게 default 를 쓴다
    description: t(locale, 'home.tagline'),
    alternates: localeAlternates(locale, routes.home),
  };
}

// app/ 는 라우팅만 담당한다. 실제 화면은 views/ 의 페이지 컴포넌트가 담당.
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <HomePage pathname={`/${toLocale(locale)}`} />;
}
