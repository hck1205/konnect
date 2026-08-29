'use client';

import { ExternalLink, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { Footer } from '@/components/layout/Footer';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';
import { Button } from '@/components/primitives/Button';
import { Heading } from '@/components/primitives/Heading';
import { Prose } from '@/components/data-display/Prose';
import { Tag } from '@/components/data-display/Tag';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Banner } from '@/components/feedback/Banner';
import type { Answer, Question } from '@/types';
import { FreshnessNotice } from './parts/FreshnessNotice';
import { AnswerCard } from './parts/AnswerCard';
import { AuthorLine } from './parts/AuthorLine';

export interface QuestionViewProps {
  question: Question;
  answers: Answer[];
  pathname: string;
}

/**
 * 질문 상세 — 프레젠테이셔널 레이어.
 *
 * **검색 유입의 착지점**이라 트래픽 대부분이 여기로 온다
 * (docs/20-product/20-prd/08-seo-strategy.md). 그래서:
 *
 * - 본문이 **로그인 없이** 완전히 읽힌다 — 크롤러도 비로그인이다
 * - 신선도·출처·경계 고지가 항상 보인다. 이 셋이 E-E-A-T 신호이자 신뢰의 전부다
 * - 답변이 없어도 화면이 죽지 않는다(빈 상태가 다음 행동을 준다)
 */
export function QuestionView({ question, answers, pathname }: QuestionViewProps) {
  const { t, locale } = useI18n();

  const nav = [
    { href: routes.questions(locale), label: t('nav.questions') },
    { href: `/${locale}/guides`, label: t('nav.guides') },
  ];

  const accepted = answers.find((a) => a.id === question.acceptedAnswerId);
  const rest = answers.filter((a) => a.id !== question.acceptedAnswerId);

  return (
    <AppShell
      width="prose"
      header={
        <PageHeader
          nav={nav}
          currentPath={pathname}
          actions={
            <>
              <LocaleSwitcher pathname={pathname} />
              <Button size="sm">{t('common.signIn')}</Button>
            </>
          }
        />
      }
      footer={<Footer disclaimer={t('message.safety')} />}
    >
      <article className="flex flex-col gap-4">
        {question.status === 'HIDDEN' ? (
          <Banner tone="info">{t('question.hidden')}</Banner>
        ) : null}

        <div className="flex flex-wrap gap-1.5">
          {question.tags.map((tag) => (
            <Tag key={tag} value={tag} />
          ))}
        </div>

        <Heading level={1} size="xl">
          {question.title}
        </Heading>

        <p className="text-sm text-fg-subtle">
          {t('question.askedBy', { name: question.authorNickname })}
        </p>

        <FreshnessNotice updatedAt={question.updatedAt} />

        <Prose>{question.body}</Prose>

        {/* 공식 출처 — 커뮤니티 답변만으로 끝내지 않는다 */}
        <a
          href="https://www.hikorea.go.kr"
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center justify-between gap-2.5 rounded-lg border border-border-interactive px-3.5 py-3 no-underline"
        >
          <span className="flex items-center gap-2.5">
            <ShieldCheck aria-hidden className="size-[18px] text-brand" />
            <span className="text-sm font-medium text-fg">
              {t('question.officialSource')}
            </span>
          </span>
          <ExternalLink aria-hidden className="size-4 text-fg-subtle" />
        </a>

        {/* 정보와 자문의 경계 — UI 에서 명시한다 */}
        <p className="rounded-md bg-surface-sunken px-3 py-2.5 text-xs leading-5 text-fg-subtle">
          {t('question.disclaimer')}
        </p>
      </article>

      <section className="mt-10 flex flex-col gap-4">
        <Heading level={2} size="lg">
          {t('question.answers', { count: question.answerCount })}
        </Heading>

        {answers.length === 0 ? (
          <EmptyState title={t('question.noAnswers')} />
        ) : (
          <div className="flex flex-col gap-4">
            {accepted ? <AnswerCard answer={accepted} accepted /> : null}
            {rest.map((answer) => (
              <AnswerCard key={answer.id} answer={answer} accepted={false} />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}

export { AuthorLine };
