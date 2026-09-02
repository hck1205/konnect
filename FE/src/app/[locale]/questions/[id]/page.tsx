import { notFound, permanentRedirect } from 'next/navigation';
import { fetchQuestion } from '@/query/questions';
import { toLocale } from '@/lib/i18n';
import { routes } from '@/lib/routes';

/**
 * slug 없는 주소 → **정규 URL 로 308**.
 *
 * 308 인 이유: `permanentRedirect` 가 내는 코드이고, 301 과 달리 **메서드를 보존한다**.
 * 301 은 역사적으로 POST 를 GET 으로 바꾸는 구현이 있었다. 색인 이전 효과는 같다.
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
  const locale = toLocale(rawLocale);

  const question = await fetchQuestion(id);
  if (!question) notFound();

  permanentRedirect(routes.question(locale, question.id, question.title));
}
