import type { Metadata } from 'next';
import { QuestionListPage } from '@/views/QuestionListPage';
import { fetchQuestions } from '@/query/questions';
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { en } from '@/lib/i18n/messages';
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

  // 메타데이터는 서버 컴포넌트라 useI18n 을 쓸 수 없다.
  // 기준 사전(en)을 직접 읽는다 — 로케일별 제목은 다음 단계에서 다룬다.
  const title = en['list.title'];
  const description = en['list.description'];

  if (isFiltered(sp)) {
    return {
      title,
      description,
      // 필터 판은 색인하지 않되, 링크는 따라가게 둔다(상세로 가는 크롤 경로다)
      robots: { index: false, follow: true },
      // canonical 은 언제나 필터 없는 정규 URL 을 가리킨다
      alternates: { canonical: routes.questions(locale) },
    };
  }

  return {
    title,
    description,
    alternates: {
      canonical: routes.questions(locale),
      // hreflang — 없으면 언어별 판이 중복 콘텐츠로 묶여 한 언어만 남는다
      languages: Object.fromEntries(LOCALES.map((l) => [l, routes.questions(l)])),
    },
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
