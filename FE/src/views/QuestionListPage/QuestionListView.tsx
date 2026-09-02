'use client';

import Link from 'next/link';
import { MessageCircleQuestion } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { SiteShell } from '@/components/layout/SiteShell';
import { PageTitle } from '@/components/layout/PageTitle';
import { buttonVariants } from '@/components/primitives/Button/Button.utils';
import { EmptyState } from '@/components/feedback/EmptyState';
import { TOPICS, type Question, type Topic } from '@/types';
import { QuestionRow } from '@/components/community/QuestionRow';

export interface QuestionListViewProps {
  questions: Question[];
  /** 지금 걸린 주제 필터. 없으면 전체다 */
  topic?: Topic;
  /** 다음 페이지 커서. `null` 이면 마지막 */
  nextCursor: string | null;
  pathname: string;
}

/**
 * 질문 목록 — 프레젠테이셔널 레이어.
 *
 * 이 화면이 **상세로 들어가는 유일한 입구**다. 지금까지는 URL 을 직접 열어야 했다.
 *
 * 필터를 링크(`<a>`)로 만든 이유가 둘 있다:
 * 1. 서버에서 렌더된 첫 HTML 만으로 **주제 이동이 동작한다** — JS 없이도 쓸 수 있다
 * 2. 크롤러가 주제별 목록을 따라갈 수 있다. 다만 **필터 URL 자체는 색인하지 않는다**
 *    (조합이 얕은 페이지를 양산한다) → docs/30-architecture/07-routes-and-indexing.md
 *
 * "더 보기"도 링크다. 커서 페이지네이션이라 크롤러가 열거하지 못하므로
 * 크롤 경로는 sitemap 이 만든다 — 여기서는 사람만 쓴다.
 */
export function QuestionListView({
  questions,
  topic,
  nextCursor,
  pathname,
}: QuestionListViewProps) {
  const { t, locale } = useI18n();
  const base = routes.questions(locale);

  // 있는 것만 링크한다 — guides 는 Phase 2 다(HomeView 와 같은 이유)
  const nav = [{ href: base, label: t('nav.questions') }];

  const filters: { key: Topic | 'all'; href: string; label: string }[] = [
    { key: 'all', href: base, label: t('list.allTopics') },
    ...TOPICS.map((value) => ({
      key: value,
      href: `${base}?topic=${value}`,
      label: t(`topic.${value}`),
    })),
  ];

  const active: Topic | 'all' = topic ?? 'all';

  return (
    <SiteShell pathname={pathname} nav={nav}>
      <PageTitle title={t('list.title')} description={t('list.description')} />

      <nav aria-label={t('list.filterTopic')} className="mt-4 flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={f.href}
            aria-current={f.key === active ? 'page' : undefined}
            className={cn(
              'rounded-full border px-3 py-1 text-xs transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-border',
              f.key === active
                ? 'border-accent-border bg-accent text-accent-on'
                : 'border-border text-fg-subtle hover:bg-surface-sunk',
            )}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      {questions.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={<MessageCircleQuestion aria-hidden className="size-6" />}
          title={topic ? t('list.emptyFiltered') : t('list.empty')}
          description={topic ? t('list.emptyFilteredHint') : t('list.emptyHint')}
          action={
            topic ? (
              // Link 안에 Button 을 넣으면 <a> 안에 <button> 이 되어 유효하지 않은
              // HTML 이다. 브라우저가 임의로 고치고 키보드 조작도 어긋난다.
              // 링크로 두고 버튼 모양만 입힌다 — 실제로 하는 일이 이동이다.
              <Link
                href={base}
                className={buttonVariants({ size: 'sm', variant: 'outline' })}
              >
                {t('list.clearFilter')}
              </Link>
            ) : null
          }
        />
      ) : (
        <div className="mt-2">
          {questions.map((question) => (
            <QuestionRow key={question.id} question={question} />
          ))}
        </div>
      )}

      {nextCursor ? (
        <div className="mt-6 flex justify-center">
          <Link
            href={
              topic
                ? `${base}?topic=${topic}&cursor=${nextCursor}`
                : `${base}?cursor=${nextCursor}`
            }
            className={buttonVariants({ size: 'sm', variant: 'outline' })}
          >
            {t('list.loadMore')}
          </Link>
        </div>
      ) : null}
    </SiteShell>
  );
}
