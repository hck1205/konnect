import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SpinePage } from '@/views/SpinePage';
import { fetchQuestions } from '@/query/questions';
import { DEFAULT_LOCALE, LOCALES, isLocale, t, type Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { localeAlternates } from '@/lib/seo';
import { OFFICIAL_SOURCES, VISA_SPINES, findSource } from '@/data/visa-spine';
import { TOPICS, type Topic } from '@/types';

/**
 * 주제 허브 — `/[locale]/topics/[topic]`.
 *
 * 게시판의 1차 축이다. 값이 여섯으로 닫혀 있어(ADR-0012) 얕은 페이지가 폭발하지 않는다.
 *
 * 비자 척추와 **같은 뼈대**를 쓴다 — 공식 출처 + 관련 질문. 다른 점은 출처를 고르는
 * 방식뿐이다: 비자 척추는 자격 하나가 참조하는 출처를, 주제 허브는 그 주제에 속한
 * 자격들의 출처를 합집합으로 모은다.
 *
 * → docs/30-architecture/07-routes-and-indexing.md
 */

interface RouteParams {
  locale: string;
  topic: string;
}

const toLocale = (raw: string): Locale => (isLocale(raw) ? raw : DEFAULT_LOCALE);

const toTopic = (raw: string): Topic | undefined =>
  (TOPICS as readonly string[]).includes(raw) ? (raw as Topic) : undefined;

/**
 * 그 주제에 속한 비자 척추들의 출처를 합친다.
 *
 * 순서는 `OFFICIAL_SOURCES` 의 선언 순서를 따른다 — 자격마다 다른 순서로 나오면
 * 같은 문서가 페이지마다 다른 자리에 있어 읽는 사람이 헷갈린다.
 */
const sourcesForTopic = (topic: Topic) => {
  const ids = new Set(
    VISA_SPINES.filter((s) => s.topic === topic).flatMap((s) => s.sourceIds),
  );
  return OFFICIAL_SOURCES.filter((s) => ids.has(s.id));
};

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    TOPICS.map((topic) => ({ locale, topic })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { locale: rawLocale, topic: rawTopic } = await params;
  const locale = toLocale(rawLocale);
  const topic = toTopic(rawTopic);
  if (!topic) return { title: 'konnect' };

  return {
    title: t(locale, `topic.${topic}`),
    description: t(locale, 'spine.topicIntro'),
    alternates: localeAlternates(locale, (l) => routes.topic(l, topic)),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { locale: rawLocale, topic: rawTopic } = await params;
  const locale = toLocale(rawLocale);

  const topic = toTopic(rawTopic);
  if (!topic) notFound();

  const spineSources = sourcesForTopic(topic);
  // 비자와 엮이지 않는 주제(교류·어학)는 아직 출처가 없다. 그때는 빈 배열이고
  // 화면이 출처 절을 그대로 비운다 — 없는 것을 있는 척하지 않는다.
  const sources = spineSources.length
    ? spineSources
    : ([] as ReturnType<typeof findSource>[]).filter((s) => s !== undefined);

  const page = await fetchQuestions({ topic }, { limit: 10 });

  return (
    <SpinePage
      title={t(locale, `topic.${topic}`)}
      description={t(locale, 'spine.topicIntro')}
      sources={sources}
      questions={page.items}
      // 주제 허브에서 쓰는 글은 태그가 아니라 topic 으로 분류된다.
      // 작성 화면이 topic 을 쿼리로 받게 되면 여기도 바뀐다.
      askTags={[]}
      pathname={routes.topic(locale, topic)}
    />
  );
}
