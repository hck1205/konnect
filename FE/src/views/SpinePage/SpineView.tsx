'use client';

import { ExternalLink, FileText, MessageCircleQuestion } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { SiteShell } from '@/components/layout/SiteShell';
import { PageTitle } from '@/components/layout/PageTitle';
import { Banner } from '@/components/feedback/Banner';
import type { OfficialSourceRef } from '@/data/visa-spine';
import type { Question } from '@/types';
import { QuestionRow } from '@/components/community/QuestionRow';

export interface SpineViewProps {
  title: string;
  /** 부제 — 비자 척추는 공식 명칭, 주제 허브는 한 줄 설명 */
  description: string;
  sources: readonly OfficialSourceRef[];
  questions: Question[];
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
  pathname,
}: SpineViewProps) {
  const { t, locale } = useI18n();

  return (
    <SiteShell pathname={pathname} nav={[{ href: routes.questions(locale), label: t('nav.questions') }]}>
      <PageTitle title={title} description={description} />

      {/*
        출처가 0건이면 절을 통째로 그리지 않는다. 빈 목록 위에 "링크하고 인용합니다"
        고지만 남으면 **무엇에 대한 고지인지 알 수 없다** — 비자와 엮이지 않는
        주제(교류·어학)가 그렇다.
      */}
      {sources.length > 0 ? (
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
              {/*
                법령명은 **사용자가 law.go.kr 에서 그대로 검색해야 하는 문자열**이다.
                lang 이 없으면 스크린리더가 베트남어 음성으로 한글을 읽고,
                translate 가 없으면 브라우저 자동번역이 검색어를 바꿔 놓는다.
                → docs/25-design/10-foundations/08-native-platform.md
              */}
              <span lang="ko" translate="no" className="text-sm font-medium">
                {s.title}
              </span>
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
      ) : null}

      {/* ── 관련 질문 ───────────────────────────────────────────── */}
      <section aria-labelledby="questions" className="mt-10">
        <h2 id="questions" className="text-sm font-semibold">
          {t('spine.relatedQuestions')}
        </h2>

        {questions.length === 0 ? (
          // 빈 목록을 보이지 않는다. 0건일 때 이 자리가 **작성 유도**가 된다 —
          // 태그를 미리 채워 보내므로 사용자가 분류를 고르지 않아도 된다.
          // 작성 화면(/[locale]/ask)이 생기면 이 자리가 태그를 미리 채운 작성 유도가
          // 된다. **라우트가 없는 동안은 걸지 않는다** — 48판 전부의 유일한 출구가
          // 404 로 가고 있었다. 같은 저장소가 홈 네비에서 이미 한 번 걷어낸 실수다.
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-border px-4 py-6 text-sm text-fg-subtle">
            <MessageCircleQuestion aria-hidden className="size-4" />
            {t('spine.noQuestions')}
          </div>
        ) : (
          <div className="mt-1">
            {questions.map((q) => (
              // `<h2>이것에 대한 질문</h2>` 안이라 h3 이다 — 기본값 h2 로 두면
              // 자기를 담은 절 제목과 형제가 되어 개요가 평평해진다
              <QuestionRow key={q.id} question={q} level={3} />
            ))}
          </div>
        )}
      </section>
    </SiteShell>
  );
}
