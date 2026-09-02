import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SpinePage } from '@/views/SpinePage';
import { fetchSpineQuestions } from '@/query/questions';
import { LOCALES, t, toLocale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { localeAlternates } from '@/lib/seo';
import { sourcesForTopic } from '@/data/visa-spine';
import { TOPICS, isTopic } from '@/types';

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

/** 비자 척추와 같은 이유로 ISR 이다 — 질문이 빌드 시점에 얼어붙지 않게 한다 */
export const revalidate = 300;

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
  const { locale: rawLocale, topic } = await params;
  const locale = toLocale(rawLocale);
  // isTopic 은 타입 가드라 이 아래에서 topic 은 Topic 이다 — 별칭이 필요 없다
  if (!isTopic(topic)) return { title: 'konnect' };

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
  const { locale: rawLocale, topic } = await params;
  const locale = toLocale(rawLocale);

  // notFound() 는 never 를 반환하므로 이 아래에서 topic 은 Topic 으로 좁혀진다
  if (!isTopic(topic)) notFound();

  // 비자와 엮이지 않는 주제(교류·어학)는 출처가 0건이다. 그때 화면은 출처 절
  // 자체를 그리지 않는다 — 빈 목록 위에 "링크하고 인용합니다" 고지만 남으면
  // 무엇에 대한 고지인지 알 수 없다.
  const sources = sourcesForTopic(topic);
  const questions = await fetchSpineQuestions(`topic:${topic}`, { topic });

  return (
    <SpinePage
      title={t(locale, `topic.${topic}`)}
      description={t(locale, 'spine.topicIntro')}
      sources={sources}
      questions={questions}
      // 주제 허브에서 쓰는 글은 태그가 아니라 topic 으로 분류된다.
      // 작성 화면이 topic 을 쿼리로 받게 되면 여기도 바뀐다.
      pathname={routes.topic(locale, topic)}
    />
  );
}
