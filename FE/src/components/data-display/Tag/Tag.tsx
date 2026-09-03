'use client';

import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { parseTag } from '@/lib/text';
import { NAMESPACE_LABEL_KEY, formatTagLabel } from './Tag.utils';

export interface TagProps {
  /** 저장 형태의 태그 문자열 (`visa:d-2`, `interview`) */
  value: string;
  /** 네임스페이스 접두사를 함께 보여줄지. 목록에서 맥락이 분명하면 끈다. */
  showNamespace?: boolean;
  /** 제거 버튼 핸들러. 주면 X 버튼이 붙는다(TagInput 이 쓴다). */
  onRemove?: () => void;
  className?: string;
}

/**
 * 맥락 태그 표시.
 *
 * 저장 형태는 항상 정규화된 소문자이고, 사람이 읽는 형태로 올리는 것은
 * **표시 시점에만** 한다 → `Tag.utils.formatTagLabel`
 */
export function Tag({ value, showNamespace = true, onRemove, className }: TagProps) {
  // 접두사와 제거 버튼 이름은 **번역 대상**이라 사전에서 읽는다.
  // 잎 컴포넌트라 'use client' 비용이 사실상 없다 — 쓰는 화면이 이미 전부 클라이언트다.
  const { t } = useI18n();
  const { namespace } = parseTag(value);
  const label = formatTagLabel(value);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-xs',
        namespace
          ? 'bg-brand-subtle text-brand-on-subtle'
          : 'bg-surface-sunken text-fg-muted',
        className,
      )}
    >
      {showNamespace && namespace ? (
        <span className="opacity-70">{t(NAMESPACE_LABEL_KEY[namespace])}</span>
      ) : null}
      <span className="font-medium">{label}</span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          // 아이콘(×)만으로는 의미가 전달되지 않는다 → 접근 가능한 이름을 붙인다
          aria-label={t('tag.remove', { label })}
          className="ml-0.5 cursor-pointer rounded-sm leading-none opacity-60 hover:opacity-100"
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}
    </span>
  );
}
