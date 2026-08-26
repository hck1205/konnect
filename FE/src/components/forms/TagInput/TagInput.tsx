'use client';

import { useTagInput } from './hooks';
import { TagInputView } from './TagInput.view';
import type { TagInputProps } from './TagInput.types';

/**
 * 맥락 태그 입력.
 *
 * 태그는 MVP 의 P0 다 — 나중에 붙이면 기존 글이 영원히 매칭에서 빠지기 때문이다
 * (→ docs/20-product/02-core-features.md). 그래서 입력 마찰을 낮추는 것이 이 컴포넌트의
 * 목적이다: Enter·쉼표·붙여넣기·Backspace 를 전부 받아들인다.
 *
 * 상태 로직은 `hooks/useTagInput`, 마크업은 `TagInput.view` 가 담당한다.
 */
export function TagInput({
  value,
  onChange,
  max,
  placeholder = 'Add a tag and press Enter',
  disabled,
  className,
  ...aria
}: TagInputProps) {
  const { draft, setDraft, isFull, handleKeyDown, handleBlur, remove } = useTagInput({
    value,
    onChange,
    max,
  });

  return (
    <TagInputView
      {...aria}
      tags={value}
      draft={draft}
      placeholder={placeholder}
      disabled={disabled}
      isFull={isFull}
      className={className}
      onDraftChange={setDraft}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onRemove={remove}
    />
  );
}
