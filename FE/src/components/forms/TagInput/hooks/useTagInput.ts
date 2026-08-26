'use client';

import { useState, type KeyboardEvent } from 'react';
import { addTag, removeTag, splitTagInput } from '../TagInput.utils';

interface UseTagInputParams {
  value: readonly string[];
  onChange: (next: string[]) => void;
  max?: number;
}

/**
 * TagInput 의 상호작용 로직.
 *
 * 키 규칙
 * - Enter / 쉼표 : 확정
 * - Backspace(입력이 빈 상태) : 마지막 태그 제거 — 태그 입력의 관습적 동작
 */
export function useTagInput({ value, onChange, max }: UseTagInputParams) {
  const [draft, setDraft] = useState('');

  const isFull = max !== undefined && value.length >= max;

  const commit = (raw: string) => {
    let next = [...value];
    // 붙여넣기로 여러 개가 한 번에 들어올 수 있다
    for (const piece of splitTagInput(raw)) {
      next = addTag(next, piece, max).next;
    }
    if (next.length !== value.length) onChange(next);
    setDraft('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      // Enter 가 폼을 제출해 버리는 것을 막는다
      e.preventDefault();
      commit(draft);
      return;
    }
    if (e.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return {
    draft,
    setDraft,
    isFull,
    handleKeyDown,
    /** 포커스가 빠질 때도 확정한다 — 입력해 놓고 Enter 를 안 누르는 경우가 흔하다 */
    handleBlur: () => commit(draft),
    remove: (tag: string) => onChange(removeTag(value, tag)),
  };
}
