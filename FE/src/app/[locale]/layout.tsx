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
  type Locale,
} from '@/lib/i18n';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

/** 모든 로케일을 빌드 시점에 정적 생성한다 — 검색엔진이 언어별로 색인한다 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: { default: 'konnect', template: '%s · konnect' },
  description:
    'A community for foreigners living, studying, working, and travelling in Korea.',
};

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
