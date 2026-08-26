'use client';

import type { FormHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  /** 제출 핸들러. `preventDefault` 는 내부에서 처리한다. */
  onSubmit: () => void;
  /** 제출 중. 안쪽 입력이 전부 비활성화되고 `aria-busy` 가 붙는다. */
  pending?: boolean;
  children: ReactNode;
}

/**
 * 폼 래퍼.
 *
 * `<form>` 을 쓰는 이유(div + 버튼이 아니라):
 * - Enter 로 제출되는 것이 브라우저 기본 동작이다
 * - 모바일 키보드에 "이동/완료" 대신 제출 키가 뜬다
 * - 브라우저 자동완성이 필드 묶음을 인식한다
 *
 * `pending` 중에는 **`<fieldset disabled>`** 로 안쪽을 통째로 잠근다 —
 * 각 입력에 disabled 를 내려보내는 것보다 정확하고, 이중 제출을 막는다.
 */
export function Form({ onSubmit, pending, children, className, ...rest }: FormProps) {
  return (
    <form
      noValidate
      aria-busy={pending || undefined}
      onSubmit={(e) => {
        e.preventDefault();
        if (pending) return;
        onSubmit();
      }}
      className={cn('flex flex-col gap-5', className)}
      {...rest}
    >
      {/* border:0 로 fieldset 기본 테두리를 지운다 — 여기서는 그룹 의미가 아니라
          '한꺼번에 잠그기' 용도다 */}
      <fieldset disabled={pending} className="contents">
        {children}
      </fieldset>
    </form>
  );
}
