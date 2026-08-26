'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/primitives/Button';
import { Textarea } from '@/components/forms/Textarea';
import { SafetyNotice } from '../SafetyNotice';
import { looksLikeSensitiveId } from '../MessageThread.utils';
import { useAsyncSubmit } from '@/hooks';

export interface MessageComposerProps {
  onSend: (body: string) => void | Promise<void>;
  /** 상대가 쪽지를 받지 않는 설정이면 잠긴다 */
  disabled?: boolean;
}

/**
 * 쪽지 입력.
 *
 * 여권번호·13자리 번호로 보이는 문자열을 입력하면 **보내기 전에 경고**한다.
 * 쪽지에서 신분증 번호를 주고받는 것은 사기의 전형적 경로다.
 * → docs/50-decisions/0004-direct-messages-with-safety-gates.md 출시 조건 3
 *
 * **막지는 않는다.** 정규식 판정에는 오탐이 있고, 오탐이 잦으면 사용자가 경고
 * 자체를 무시하게 된다 — 그러면 진짜 위험할 때도 안 읽는다.
 */
export function MessageComposer({ onSend, disabled }: MessageComposerProps) {
  const { t } = useI18n();
  const [body, setBody] = useState('');
  const { pending, submit } = useAsyncSubmit(onSend);

  const risky = looksLikeSensitiveId(body);

  return (
    <form
      className="flex flex-col gap-2 border-t border-border p-4"
      onSubmit={(e) => {
        e.preventDefault();
        void submit(body, () => setBody(''));
      }}
    >
      {risky ? <SafetyNotice urgent /> : null}

      <div className="flex items-end gap-2">
        <Textarea
          rows={2}
          value={body}
          disabled={disabled || pending}
          aria-label={t('message.placeholder')}
          placeholder={disabled ? t('message.disabled') : t('message.placeholder')}
          onChange={(e) => setBody(e.target.value)}
        />
        <Button
          type="submit"
          loading={pending}
          disabled={disabled || body.trim().length === 0}
          iconStart={<Send className="size-4" />}
        >
          {t('message.send')}
        </Button>
      </div>
    </form>
  );
}
