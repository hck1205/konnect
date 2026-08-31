import { cache } from 'react';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { QuestionPage } from '@/views/QuestionPage';
import { fetchQuestion } from '@/query/questions';
import { fetchAnswers } from '@/query/answers';
import { DEFAULT_LOCALE, isLocale, type Locale } from '@/lib/i18n';
import { decodeSlug, questionSlug, routes } from '@/lib/routes';
import { localeAlternates } from '@/lib/seo';
import type { Question } from '@/types';

/**
 * 질문 상세 — **검색 유입의 착지점**.
 *
 * 서버 컴포넌트가 데이터를 받아 온다. 클라이언트에서 받아 오면 첫 HTML 이
 * 로딩 상태라 **크롤러가 본문을 못 본다** — 검색이 유일한 유입 채널인
 * 이 서비스에서는 그대로 손실이다.
 * → docs/20-product/20-prd/08-seo-strategy.md
 */

interface RouteParams {
  locale: string;
  id: string;
  slug: string;
}

const toLocale = (raw: string): Locale => (isLocale(raw) ? raw : DEFAULT_LOCALE);

/**
 * 없는 질문이면 `null` — 404 와 리다이렉트 분기가 여기서 갈린다.
 *
 * `cache()` 로 감싸는 이유: `generateMetadata` 와 `Page` 가 **각각** 부르므로
 * 감싸지 않으면 한 번 그리는 데 GET 이 두 번 나간다. axios 를 쓰므로 Next 의
 * fetch 중복 제거를 받지 못한다. 유입이 가장 몰리는 라우트라 그대로 두면 비싸다.
 *
 * 부수 효과가 하나 더 있다 — 렌더 중간에 질문이 수정돼도 메타데이터의 title 과
 * 아래 canonicalSlug 판정이 **같은 title 을 본다.** 감싸지 않으면 서로 다른 판을
 * 보고 정규 URL 판정이 어긋날 수 있다.
 *
 * 요청 스코프 한정이다 — 방문자 간 캐시는 생기지 않는다.
 */
const load = cache(
  async (id: string): Promise<Question | null> => fetchQuestion(id),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  const locale = toLocale(rawLocale);
  const question = await load(id);
  if (!question) return { title: 'konnect' };

  return {
    // 접미사는 layout 의 template(`%s · konnect`)이 붙인다 — 여기서 또 붙이면 두 번 나온다
    title: question.title,
    // 본문 앞부분을 설명으로 쓴다 — 검색 결과에 그대로 노출된다
    description: question.body.slice(0, 160),
    alternates: localeAlternates(locale, (l) =>
      routes.question(l, question.id, question.title),
    ),
  };
}

export default async function Page({ params }: { params: Promise<RouteParams> }) {
  const { locale: rawLocale, id, slug } = await params;
  const locale = toLocale(rawLocale);

  const question = await load(id);
  if (!question) notFound();

  // 제목이 수정되면 slug 가 바뀐다 — 옛 주소로 들어와도 정규 URL 로 보낸다.
  // 301(permanent)인 이유: 검색엔진이 색인을 옮겨야 한다.
  const canonicalSlug = questionSlug(question.title);
  if (decodeSlug(slug) !== canonicalSlug) {
    permanentRedirect(routes.question(locale, question.id, question.title));
  }

  const answers = await fetchAnswers(question.id);

  return (
    <QuestionPage
      question={question}
      answers={answers}
      pathname={routes.question(locale, question.id, question.title)}
    />
  );
}
