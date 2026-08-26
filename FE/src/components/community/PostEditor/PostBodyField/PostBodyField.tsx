'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Textarea } from '@/components/forms/Textarea';
import { SegmentedControl } from '@/components/forms/SegmentedControl';
import { Prose } from '@/components/data-display/Prose';
import type { FieldControlProps } from '@/components/forms/Field';

export interface PostBodyFieldProps extends Partial<FieldControlProps> {
  value: string;
  onChange: (value: string) => void;
}

/**
 * 본문 입력 + 미리보기 전환.
 *
 * 미리보기를 **탭이 아니라 `SegmentedControl`** 로 둔다 — 탭은 화면 영역을 바꾸는
 * 내비게이션이고, 이건 **입력 모드 선택**이다. 롤이 다르면 스크린리더가 다르게 읽는다.
 *
 * 본문 형식은 아직 정해지지 않았다(마크다운 vs WYSIWYG). 지금은 평문 + 줄바꿈
 * 보존이고 `Prose` 가 렌더를 맡으므로, 형식이 정해지면 **이 파일만** 바뀐다.
 * → docs/20-product/10-features/10-post-editor.md
 */
export function PostBodyField({ value, onChange, ...aria }: PostBodyFieldProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<'write' | 'preview'>('write');

  return (
    <div className="flex flex-col gap-2">
      <SegmentedControl
        size="sm"
        label={t('post.body.label')}
        value={mode}
        onChange={(v) => setMode(v as 'write' | 'preview')}
        options={[
          { value: 'write', label: t('post.write') },
          { value: 'preview', label: t('post.preview') },
        ]}
      />

      {mode === 'write' ? (
        <Textarea
          {...aria}
          rows={10}
          value={value}
          placeholder={t('post.body.placeholder')}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className="min-h-40 rounded-md border border-border bg-surface-sunken p-3">
          {value.trim() ? (
            <Prose>
              <p className="whitespace-pre-wrap">{value}</p>
            </Prose>
          ) : (
            <p className="text-sm text-fg-subtle">{t('post.empty')}</p>
          )}
        </div>
      )}
    </div>
  );
}
