'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { Form } from '@/components/forms/Form';
import { FormActions } from '@/components/forms/FormActions';
import { Field } from '@/components/forms/Field';
import { Input } from '@/components/forms/Input';
import { Textarea } from '@/components/forms/Textarea';
import { TagInput } from '@/components/forms/TagInput';
import { SegmentedControl } from '@/components/forms/SegmentedControl';
import { Button } from '@/components/primitives/Button';
import { Prose } from '@/components/data-display/Prose';
import { Banner } from '@/components/feedback/Banner';

export interface PostDraft {
  title: string;
  body: string;
  tags: string[];
}

export interface PostEditorProps {
  value: PostDraft;
  onChange: (draft: PostDraft) => void;
  onSubmit: () => void | Promise<void>;
  onCancel?: () => void;
  onSaveDraft?: () => void;
  pending?: boolean;
  /** 필드별 에러. 서버 검증 결과를 그대로 받는다. */
  errors?: Partial<Record<keyof PostDraft, string>>;
  /** 비슷한 질문 — 작성 중에 보여준다 */
  similar?: readonly { id: string; title: string; href: string }[];
  className?: string;
}

/**
 * 게시글/질문 작성기.
 *
 * 작성 화면은 **가장 중요한 UX 지점**이다. 태그를 요구하면 이탈하고, 안 받으면
 * 매칭이 안 된다(태그는 P0 이고 소급 적용이 불가능하다).
 * → docs/20-product/10-features/02-qna.md
 *
 * 그래서:
 * - **비슷한 질문을 작성 중에** 보여준다. 중복을 막고, "이미 답이 있다"는 즉각적
 *   가치를 준다 — 태그를 강제하는 것보다 효과가 크다.
 * - 미리보기를 탭이 아니라 `SegmentedControl` 로 둔다. 탭은 화면을 바꾸는
 *   내비게이션이고 이건 **입력 모드 선택**이다.
 *
 * 본문 형식은 아직 정해지지 않았다(마크다운 vs WYSIWYG). 지금은 평문 + 줄바꿈
 * 보존이고, `Prose` 가 렌더를 맡으므로 형식이 정해지면 미리보기만 바꾸면 된다.
 */
export function PostEditor({
  value,
  onChange,
  onSubmit,
  onCancel,
  onSaveDraft,
  pending,
  errors,
  similar = [],
  className,
}: PostEditorProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<'write' | 'preview'>('write');

  const patch = (partial: Partial<PostDraft>) => onChange({ ...value, ...partial });

  return (
    <Form pending={pending} onSubmit={onSubmit} className={className}>
      <Field label={t('post.title.label')} required error={errors?.title}>
        {(aria) => (
          <Input
            {...aria}
            value={value.title}
            placeholder={t('post.title.placeholder')}
            onChange={(e) => patch({ title: e.target.value })}
          />
        )}
      </Field>

      {/* 중복을 막는 가장 효과적인 지점 — 작성 중이다 */}
      {similar.length > 0 ? (
        <Banner tone="info" title={t('common.more')}>
          <ul className="mt-1 flex flex-col gap-1">
            {similar.map((item) => (
              <li key={item.id}>
                <a href={item.href} className="underline underline-offset-2">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </Banner>
      ) : null}

      <Field
        label={t('post.body.label')}
        description={t('post.body.hint')}
        error={errors?.body}
      >
        {(aria) => (
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
                value={value.body}
                placeholder={t('post.body.placeholder')}
                onChange={(e) => patch({ body: e.target.value })}
              />
            ) : (
              <div
                className={cn(
                  'min-h-40 rounded-md border border-border bg-surface-sunken p-3',
                )}
              >
                {value.body.trim() ? (
                  <Prose>
                    <p className="whitespace-pre-wrap">{value.body}</p>
                  </Prose>
                ) : (
                  <p className="text-sm text-fg-subtle">{t('post.empty')}</p>
                )}
              </div>
            )}
          </div>
        )}
      </Field>

      <Field
        label={t('post.tags.label')}
        description={t('post.tags.hint')}
        error={errors?.tags}
      >
        {(aria) => (
          <TagInput
            {...aria}
            value={value.tags}
            max={5}
            onChange={(tags) => patch({ tags })}
          />
        )}
      </Field>

      <FormActions
        secondary={
          <>
            {onCancel ? (
              <Button variant="ghost" tone="neutral" type="button" onClick={onCancel}>
                {t('common.cancel')}
              </Button>
            ) : null}
            {onSaveDraft ? (
              <Button variant="outline" tone="neutral" type="button" onClick={onSaveDraft}>
                {t('post.saveDraft')}
              </Button>
            ) : null}
          </>
        }
        primary={
          <Button type="submit" loading={pending} disabled={!value.title.trim()}>
            {t('post.publish')}
          </Button>
        }
      />
    </Form>
  );
}
