'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { Prose } from '@/components/data-display/Prose';
import type { Answer } from '@/types';
import { AuthorLine } from './AuthorLine';

/**
 * 답변 하나.
 *
 * 채택된 답변은 **테두리와 머리말로** 구분한다 — 색만으로 구분하면
 * 색각 이상 사용자에게 정보가 아니다
 * (docs/25-design/10-foundations/07-accessibility.md).
 */
export function AnswerCard({ answer, accepted }: { answer: Answer; accepted: boolean }) {
  const { t } = useI18n();

  return (
    <article
      className={cn(
        'overflow-hidden rounded-xl border',
        accepted ? 'border-success-300' : 'border-border',
      )}
    >
      {accepted ? (
        <div className="flex items-center gap-1.5 bg-success-subtle px-3.5 py-2">
          <Check aria-hidden className="size-4 text-success-on-subtle" />
          <span className="text-sm font-semibold text-success-on-subtle">
            {t('question.acceptedBy')}
          </span>
        </div>
      ) : null}

      <div className="flex flex-col gap-3.5 p-3.5">
        <Prose>{answer.body}</Prose>
        <div className="border-t border-border pt-3">
          <AuthorLine nickname={answer.authorNickname} />
        </div>
      </div>
    </article>
  );
}
