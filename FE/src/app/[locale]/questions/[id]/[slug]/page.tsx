import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { QuestionPage } from '@/views/QuestionPage';
import { fetchQuestion } from '@/query/questions';
import { fetchAnswers } from '@/query/answers';
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from '@/lib/i18n';
import { decodeSlug, questionSlug, routes } from '@/lib/routes';
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

/** 없는 질문이면 `null` — 404 와 리다이렉트 분기가 여기서 갈린다 */
async function load(id: string): Promise<Question | null> {
  return fetchQuestion(id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  const locale = toLocale(rawLocale);
  const question = await load(id);
  if (!question) return { title: 'konnect' };

  const canonical = routes.question(locale, question.id, question.title);

  return {
    // 접미사는 layout 의 template(`%s · konnect`)이 붙인다 — 여기서 또 붙이면 두 번 나온다
    title: question.title,
    // 본문 앞부분을 설명으로 쓴다 — 검색 결과에 그대로 노출된다
    description: question.body.slice(0, 160),
    alternates: {
      canonical,
      // hreflang — 없으면 언어별 판이 **중복 콘텐츠로 묶여 한 언어만 남는다**
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, routes.question(l, question.id, question.title)]),
      ),
    },
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
