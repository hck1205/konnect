import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface FieldsetProps {
  /** 그룹 이름. `<legend>` 로 렌더된다. */
  legend: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

/**
 * 관련된 입력들의 묶음 — **네이티브 `<fieldset>`/`<legend>`**.
 *
 * 스크린리더가 그룹 안의 각 입력을 읽을 때 legend 를 함께 읽어 준다
 * ("Notifications, Email" 처럼). `<div>` + `<h3>` 으로는 그 연결이 생기지 않는다.
 *
 * `disabled` 를 주면 **안쪽 입력이 전부 비활성화된다** — 브라우저가 처리한다.
 */
export function Fieldset({
  legend,
  description,
  children,
  disabled,
  className,
}: FieldsetProps) {
  return (
    <fieldset disabled={disabled} className={cn('flex flex-col gap-3', className)}>
      <legend className="text-sm font-medium text-fg">{legend}</legend>
      {description ? <p className="text-sm text-fg-muted">{description}</p> : null}
      {children}
    </fieldset>
  );
}
