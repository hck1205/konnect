import type { KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';
import { Tag } from '@/components/data-display/Tag';
import type { FieldControlProps } from '@/components/forms/Field';

interface TagInputViewProps extends Partial<FieldControlProps> {
  tags: readonly string[];
  draft: string;
  placeholder?: string;
  disabled?: boolean;
  isFull: boolean;
  className?: string;
  onDraftChange: (v: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onRemove: (tag: string) => void;
}

/**
 * TagInput 의 마크업만 담당한다(상태 없음).
 *
 * 바깥 상자는 `<div>` 지만 클릭하면 안쪽 `<input>` 이 포커스를 받도록 `<label>` 이 아니라
 * 입력을 상자 안에 두는 구조를 쓴다 — 상자 자체가 입력처럼 보이되, 접근성 상으로는
 * 진짜 input 하나만 존재한다.
 */
export function TagInputView({
  tags,
  draft,
  placeholder,
  disabled,
  isFull,
  className,
  onDraftChange,
  onKeyDown,
  onBlur,
  onRemove,
  ...aria
}: TagInputViewProps) {
  return (
    <div
      className={cn(
        'flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border bg-surface-sunken px-2 py-1.5',
        aria['aria-invalid'] ? 'border-danger' : 'border-border-interactive',
        disabled && 'cursor-not-allowed opacity-50',
        // 안쪽 input 이 포커스를 받으면 상자에 링을 그린다
        'focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus-ring',
        className,
      )}
    >
      {tags.map((tag) => (
        <Tag
          key={tag}
          value={tag}
          showNamespace={false}
          onRemove={disabled ? undefined : () => onRemove(tag)}
        />
      ))}

      <input
        {...aria}
        type="text"
        value={draft}
        disabled={disabled || isFull}
        placeholder={isFull ? undefined : placeholder}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        className="min-w-24 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle disabled:cursor-not-allowed"
      />
    </div>
  );
}
