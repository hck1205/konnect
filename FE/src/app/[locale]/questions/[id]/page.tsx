import { notFound, permanentRedirect } from 'next/navigation';
import { fetchQuestion } from '@/query/questions';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n';
import { routes } from '@/lib/routes';

/**
 * slug 없는 주소 → **정규 URL 로 301**.
 *
 * id 는 UUIDv7 이라 사람도 검색엔진도 읽을 수 없다. 공유된 짧은 주소나 옛
 * 링크가 죽지 않게 받아서 넘긴다 — 죽은 링크는 검색 유입에서 그대로 손실이다.
 * → docs/30-architecture/07-routes-and-indexing.md
 */
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  const question = await fetchQuestion(id);
  if (!question) notFound();

  permanentRedirect(routes.question(locale, question.id, question.title));
}
