'use client';

import Link from 'next/link';
import { ExternalLink, FileText, MessageCircleQuestion } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageTitle } from '@/components/layout/PageTitle';
import { Footer } from '@/components/layout/Footer';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';
import { Button } from '@/components/primitives/Button';
import { buttonVariants } from '@/components/primitives/Button/Button.utils';
import { Banner } from '@/components/feedback/Banner';
import type { OfficialSourceRef } from '@/data/visa-spine';
import type { Question } from '@/types';
import { QuestionRow } from '@/views/QuestionListPage/parts/QuestionRow';

export interface SpineViewProps {
  title: string;
  /** 부제 — 비자 척추는 공식 명칭, 주제 허브는 한 줄 설명 */
  description: string;
  sources: readonly OfficialSourceRef[];
  questions: Question[];
  /** 이 척추에서 새 글을 쓸 때 미리 채울 태그 */
  askTags: readonly string[];
  pathname: string;
}

const KIND_KEY = {
  statute: 'spine.statute',
  notice: 'spine.notice',
  guide: 'spine.guide',
} as const;

/**
 * 척추 페이지 — 프레젠테이셔널 레이어.
 *
 * **질문이 0건이어도 이 페이지는 성립한다.** 그것이 척추의 존재 이유다 —
 * 다른 모든 페이지 종류는 사람이 먼저 있어야 하는데, 법령은 우리 사용자와
 * 무관하게 이미 존재한다.
 *
 * 해석하지 않는다. 링크와 인용과 날짜만 싣는다 — 전문가가 없는 상태에서
 * 요건을 우리가 쓰면 틀린 안내가 '가이드'라는 이름을 달고 쌓인다(R1).
 * → docs/10-domain/10-visa-immigration/03-content-and-risk-policy.md
 */
export function SpineView({
  title,
  description,
  sources,
  questions,
  askTags,
  pathname,
}: SpineViewProps) {
  const { t, locale } = useI18n();
  const askHref = routes.ask(locale, askTags);

  return (
    <AppShell
      width="prose"
      header={
        <PageHeader
          nav={[{ href: routes.questions(locale), label: t('nav.questions') }]}
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
      <PageTitle title={title} description={description} />

      {/* ── 공식 출처 ───────────────────────────────────────────── */}
      <section aria-labelledby="sources" className="mt-8 flex flex-col gap-3">
        <h2 id="sources" className="text-sm font-semibold">
          {t('spine.officialSources')}
        </h2>

        {/*
          경계 고지를 출처 **바로 위**에 둔다. 아래로 밀면 링크를 먼저 누르고
          고지를 안 본다 — R1 영역에서 그 순서가 실제로 중요하다.
        */}
        <Banner tone="info">{t('spine.sourcesNote')}</Banner>

        <ul className="flex flex-col gap-2">
          {sources.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-border px-3.5 py-2.5"
            >
              <FileText aria-hidden className="size-4 text-fg-subtle" />
              <span className="text-sm font-medium">{s.title}</span>
              <span
                className={cn(
                  'rounded-sm px-1.5 py-0.5 text-xs',
                  // 인용 등급이 다르다 — 법령은 전문 인용 가능, 공지·안내는 링크 + 최소 인용만
                  s.kind === 'statute'
                    ? 'bg-accent-subtle text-accent-on-subtle'
                    : 'bg-surface-sunk text-fg-subtle',
                )}
              >
                {t(KIND_KEY[s.kind])}
              </span>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex items-center gap-1 text-xs text-accent-fg hover:underline"
              >
                {t('spine.viewOriginal')}
                <ExternalLink aria-hidden className="size-3.5" />
              </a>
            </li>
          ))}
        </ul>

        {/*
          없는 것을 감추지 않는다. 감시는 서버에서 매일 도는데 그 결과가
          named volume 에만 있어 앱이 읽지 못한다 — 빈 칸을 드러내는 것이
          "최신 정보"처럼 보이게 두는 것보다 정직하다.
          → docs/20-product/10-features/12-official-data-pipeline.md
        */}
        <p className="text-xs text-fg-muted">
          <span className="font-medium">{t('spine.missing')}</span> —{' '}
          {t('spine.missingNote')}
        </p>
      </section>

      {/* ── 관련 질문 ───────────────────────────────────────────── */}
      <section aria-labelledby="questions" className="mt-10">
        <h2 id="questions" className="text-sm font-semibold">
          {t('spine.relatedQuestions')}
        </h2>

        {questions.length === 0 ? (
          // 빈 목록을 보이지 않는다. 0건일 때 이 자리가 **작성 유도**가 된다 —
          // 태그를 미리 채워 보내므로 사용자가 분류를 고르지 않아도 된다.
          <div className="mt-3 flex flex-col items-start gap-3 rounded-xl border border-dashed border-border px-4 py-6">
            <div className="flex items-center gap-2 text-sm text-fg-subtle">
              <MessageCircleQuestion aria-hidden className="size-4" />
              {t('spine.noQuestions')}
            </div>
            <Link
              href={askHref}
              className={buttonVariants({ size: 'sm', variant: 'outline' })}
            >
              {t('spine.askFirst')}
            </Link>
          </div>
        ) : (
          <div className="mt-1">
            {questions.map((q) => (
              <QuestionRow key={q.id} question={q} />
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
