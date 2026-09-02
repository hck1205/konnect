'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { Heading, type HeadingLevel } from '@/components/primitives/Heading';
import { Tag } from '@/components/data-display/Tag';
import { RelativeTime } from '@/components/data-display/RelativeTime';
import type { Question } from '@/types';

export interface QuestionRowProps {
  question: Question;
  /**
   * 이 줄이 문서에서 갖는 **제목 레벨**.
   *
   * 화면마다 다르다 — 목록 화면에서는 질문이 최상위 절이라 `h2` 지만,
   * 척추 페이지에서는 `<h2>이것에 대한 질문</h2>` **안에** 들어가므로 `h3` 이다.
   * `h2` 로 박아 두면 자기를 담은 절 제목과 형제가 되어 문서 개요가 평평해지고,
   * 스크린리더로 제목을 훑는 사용자에게 목록의 경계가 사라진다.
   *
   * 크기는 레벨과 함께 바뀌지 않는다 — `Heading` 이 둘을 분리하는 이유다.
   */
  level?: HeadingLevel;
}

/**
 * 목록의 한 줄.
 *
 * **제목 전체가 링크다.** 목록에서 사용자가 하는 일은 하나뿐(들어가기)이라
 * 클릭 대상을 좁힐 이유가 없다. 터치 화면에서 특히 중요하다.
 *
 * 답변 수와 채택 여부를 함께 보여주는 이유: 목록에서 고르는 기준이
 * "답이 있나"이기 때문이다. 답변자 입장에서는 **답 없는 질문**이 자기 자리다.
 *
 * `views/QuestionListPage/parts/` 에 있었는데 척추 페이지도 쓰게 됐다.
 * 다른 화면의 `parts/`(그 화면의 비공개 영역)를 배럴을 지나쳐 직접 import 하면
 * 그 화면을 정리할 때 상관없는 페이지가 깨진다. 둘 이상이 쓰면 공용이다.
 */
export function QuestionRow({ question, level = 2 }: QuestionRowProps) {
  const { t, locale } = useI18n();
  const href = routes.question(locale, question.id, question.title);
  const answered = question.answerCount > 0;

  return (
    <article className="flex flex-col gap-2 border-b border-border py-4 last:border-b-0">
      <Heading level={level} size="sm" className="leading-snug">
        {/* 링크 안에 제목만 둔다 — 메타 정보까지 감싸면 스크린리더가 링크 이름을 길게 읽는다 */}
        <Link
          href={href}
          className="text-fg hover:text-accent-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-border"
        >
          {question.title}
        </Link>
      </Heading>

      {question.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {question.tags.map((tag) => (
            <Tag key={tag} value={tag} />
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-subtle">
        {/*
          채택 표시는 색이 아니라 **아이콘과 글자**로 한다.
          색만으로 구분하면 색각 이상 사용자에게는 정보가 아니다.
          → docs/25-design/10-foundations/07-accessibility.md
        */}
        {question.acceptedAnswerId ? (
          <span className="inline-flex items-center gap-1 font-medium text-success-on-subtle">
            <Check aria-hidden className="size-3.5" />
            {t('list.accepted')}
          </span>
        ) : null}

        <span className={cn(answered ? undefined : 'text-fg-muted')}>
          {t('list.answers', { count: question.answerCount })}
        </span>

        <span aria-hidden>·</span>
        <RelativeTime value={question.createdAt} />
        <span aria-hidden>·</span>
        <span>{question.authorNickname}</span>
      </div>
    </article>
  );
}
