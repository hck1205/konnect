import type { Metadata } from 'next';
import { QuestionListPage } from '@/views/QuestionListPage';
import { fetchQuestions } from '@/query/questions';
import { DEFAULT_LOCALE, isLocale, t, type Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { localeAlternates, noindexAlternates } from '@/lib/seo';
import { TOPICS, type Topic } from '@/types';

/**
 * 질문 목록 — **상세로 들어가는 입구**.
 *
 * 서버에서 받아 온다. 클라이언트에서 받으면 첫 HTML 이 로딩 상태라
 * 크롤러가 목록을 못 본다 — 검색이 유일한 유입 채널인 이 서비스에서는 손실이다.
 *
 * ⚠️ **색인은 필터 없는 기본 상태만.** `?topic=`·`?cursor=` 가 붙으면 `noindex` 다.
 * 필터 조합은 무한하고 각각이 얕아서, 색인시키면 사이트 전체 품질 평가가 깎인다.
 * 그 역할은 허브 페이지(`/visa/[code]`·`/topics/[topic]`)가 대신한다.
 * → docs/30-architecture/07-routes-and-indexing.md
 */

interface RouteParams {
  locale: string;
}

interface SearchParams {
  topic?: string;
  cursor?: string;
}

const toLocale = (raw: string): Locale => (isLocale(raw) ? raw : DEFAULT_LOCALE);

/** 모르는 값이 오면 필터 없음으로 수렴한다 — 400 을 낼 이유가 없다 */
const toTopic = (raw?: string): Topic | undefined =>
  raw && (TOPICS as readonly string[]).includes(raw) ? (raw as Topic) : undefined;

/** 필터가 하나라도 걸리면 그 URL 은 사용자 도구이지 유입 표면이 아니다 */
const isFiltered = (sp: SearchParams) => Boolean(sp.topic ?? sp.cursor);

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<RouteParams>;
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  const sp = await searchParams;

  // 서버라 useI18n 을 쓸 수 없다. 배럴이 내주는 순수 함수를 쓴다.
  //
  // ⚠️ 지금은 의도적으로 **기준 로케일(en)** 로 고정한다. 로케일별 문구로 바꾸는 것은
  // check:seo 의 설명 길이 규칙과 zh·vi 원어민 미검수 문제를 함께 정해야 한다 —
  // 검수 안 된 판이 색인되는 것이 R1 영역에서 실제 피해다.
  const title = t(DEFAULT_LOCALE, 'list.title');
  const description = t(DEFAULT_LOCALE, 'list.description');

  if (isFiltered(sp)) {
    return { title, description, ...noindexAlternates(routes.questions(locale)) };
  }

  return {
    title,
    description,
    alternates: localeAlternates(locale, routes.questions),
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<RouteParams>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale: rawLocale } = await params;
  const locale = toLocale(rawLocale);
  const sp = await searchParams;
  const topic = toTopic(sp.topic);

  // 목록이 비어도 화면은 뜬다 — BE 가 죽었을 때 500 을 내는 대신 빈 상태를 보여준다.
  // 유입의 입구라 여기서 죽으면 상세로 가는 길까지 함께 막힌다.
  const page = await fetchQuestions({ topic }, { cursor: sp.cursor, limit: 20 });

  return (
    <QuestionListPage
      questions={page.items}
      topic={topic}
      nextCursor={page.nextCursor}
      pathname={routes.questions(locale)}
    />
  );
}
