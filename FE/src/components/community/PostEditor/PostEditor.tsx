'use client';

import { useI18n } from '@/lib/i18n';
import { Form } from '@/components/forms/Form';
import { FormActions } from '@/components/forms/FormActions';
import { Field } from '@/components/forms/Field';
import { Input } from '@/components/forms/Input';
import { TagInput } from '@/components/forms/TagInput';
import { Button } from '@/components/primitives/Button';
import { PostBodyField } from './PostBodyField';
import { SimilarQuestions, type SimilarQuestion } from './SimilarQuestions';
import type { PostDraft } from '@/types';

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
  similar?: readonly SimilarQuestion[];
  className?: string;
}

/**
 * 게시글/질문 작성기 — 조립만 한다.
 *
 * 여기서 **공급이 결정된다.** 질문이 안 올라오면 커뮤니티가 없다.
 * 태그를 요구하면 이탈하고, 안 받으면 매칭이 안 된다(태그는 소급 적용이 불가능하다).
 * 그 균형을 강제가 아니라 **가치 제공**으로 잡는다 → `SimilarQuestions`.
 * → docs/20-product/10-features/10-post-editor.md
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

      <SimilarQuestions items={similar} />

      <Field label={t('post.body.label')} description={t('post.body.hint')} error={errors?.body}>
        {(aria) => (
          <PostBodyField {...aria} value={value.body} onChange={(body) => patch({ body })} />
        )}
      </Field>

      <Field label={t('post.tags.label')} description={t('post.tags.hint')} error={errors?.tags}>
        {(aria) => (
          <TagInput {...aria} value={value.tags} max={5} onChange={(tags) => patch({ tags })} />
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
