import { HomePage } from '@/views/HomePage';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n';

// app/ 는 라우팅만 담당한다. 실제 화면은 views/ 의 페이지 컴포넌트가 담당.
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <HomePage pathname={`/${isLocale(locale) ? locale : DEFAULT_LOCALE}`} />;
}
