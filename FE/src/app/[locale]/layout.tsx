import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import { Providers } from '../providers';
import { ThemeScript } from '@/components/theme/ThemeScript';
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_HTML_LANG,
  isLocale,
  isRtl,
  t,
  type Locale,
} from '@/lib/i18n';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

/** 모든 로케일을 빌드 시점에 정적 생성한다 — 검색엔진이 언어별로 색인한다 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * 위 목록에 없는 세그먼트는 **404 다**.
 *
 * 이게 없으면 `/[locale]` 이 아무 세그먼트나 받아 홈을 200 으로 그린다. 프록시가
 * 점 있는 경로(`.*\..*`)를 건드리지 않으므로, 브라우저·크롤러가 반드시 찔러 보는
 * `/favicon.ico` `/robots.txt` `/sitemap.xml` 이 전부 홈 HTML 을 200 으로 받는다.
 * 파비콘이 HTML 로 오면 브라우저는 그걸 버리고 **이전에 이 오리진에 캐시해 둔 아이콘**을
 * 계속 쓴다 — 없는 파비콘이 사라지지 않는 이유가 이거다.
 * soft-404 는 색인에도 나쁘다(쓰레기 URL 마다 홈이 하나씩 색인된다).
 */
export const dynamicParams = false;

/**
 * 레이아웃 메타데이터 — **로케일별**이다.
 *
 * 예전에는 정적 `metadata` 객체라 영어 한 줄을 네 판이 함께 물려받았다.
 * `description` 을 스스로 정하지 않는 페이지(홈이 그랬다)는 이걸 그대로 쓰므로,
 * 한국어 화면의 검색 결과 설명이 영어로 나갔다.
 *
 * `metadataBase` 는 **일부러 비워 둔다.** 도메인이 아직 없어서(self-signed IP)
 * 여기에 절대 URL 을 박으면 그것이 canonical 로 구워져, 도메인이 생기는 날
 * 옛 주소를 가리키는 정규 URL 이 색인에 남는다. 비워 두면 Next 가 상대 경로를
 * 내보내고 크롤러가 **실제로 받은 호스트 기준으로** 해석한다 — 지금 상태에서는
 * 그쪽이 옳다. `NEXT_PUBLIC_SITE_URL` 이 생기면 그때 한 줄로 켠다.
 * → docs/40-operations/03-deployment.md (도메인이 인증서·HSTS·호스트명의 공통 병목)
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;

  const site = process.env.NEXT_PUBLIC_SITE_URL;

  return {
    title: { default: 'konnect', template: '%s · konnect' },
    description: t(locale, 'home.tagline'),
    ...(site ? { metadataBase: new URL(site) } : {}),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;

  return (
    // lang 은 실제 콘텐츠 언어와 맞아야 한다 — 스크린리더의 발음이 여기서 갈린다.
    // dir 은 지금 모두 ltr 이지만, 컴포넌트가 논리 속성을 쓰므로 로케일만 추가하면 된다.
    <html
      lang={LOCALE_HTML_LANG[locale]}
      dir={isRtl(locale) ? 'rtl' : 'ltr'}
      // ThemeScript 가 하이드레이션 전에 .dark 를 붙인다
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeScript />
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
