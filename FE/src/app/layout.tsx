import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ThemeScript } from '@/components/theme/ThemeScript';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'konnect',
    template: '%s · konnect',
  },
  description:
    'A community for foreigners living, studying, working, and travelling in Korea.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 서비스 기본 언어는 영어다(다국어 도입 시 이 값이 로케일에 따라 바뀐다).
    //
    // suppressHydrationWarning: ThemeScript 가 하이드레이션 **전에** .dark 를 붙이므로
    // 서버 마크업과 달라진다. <html> 한정으로 경고를 억제한다 — 이 요소의 클래스는
    // 의도적으로 클라이언트에서 결정된다.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* FOUC 방지 — 무엇보다 먼저 실행되어야 한다 */}
        <ThemeScript />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
