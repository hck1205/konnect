'use client';

import { cn } from '@/lib/cn';
import { Checkbox } from '@/components/forms/Checkbox';
import { Progress } from '@/components/primitives/Progress';
import { Link } from '@/components/primitives/Link';
import { countCompleted } from './Checklist.utils';
import type { ChecklistProps } from './Checklist.types';

/**
 * 시점별 할 일 묶음.
 *
 * 초기 정착의 좌절은 대부분 **순서를 몰라서** 생긴다 — 비자·ARC·통장·통신이
 * 서로의 선행조건이라 하나가 막히면 줄줄이 막힌다.
 * → docs/10-domain/40-housing-living/02-administration.md
 *
 * 진행 상태는 부모가 들고 있다(제어 컴포넌트). 로컬 저장을 전제로 설계했으므로
 * 계정 없이도 쓸 수 있고, 체류 관련 정보가 서버에 쌓이지 않는다.
 */
export function Checklist({
  title,
  description,
  items,
  checked,
  onToggle,
  className,
}: ChecklistProps) {
  const ids = items.map((i) => i.id);
  const done = countCompleted(ids, checked);

  return (
    <section
      aria-label={title}
      className={cn('rounded-lg border border-border bg-surface-raised p-4', className)}
    >
      <h3 className="text-base font-semibold text-fg">{title}</h3>
      {description ? <p className="mt-1 text-sm text-fg-muted">{description}</p> : null}

      <Progress
        className="mt-3"
        value={done}
        max={items.length}
        label={`${title} progress`}
        showValue
      />

      <ul className="mt-4 flex flex-col gap-3">
        {items.map((item) => (
          <li key={item.id}>
            <Checkbox
              checked={checked.includes(item.id)}
              onChange={(e) => onToggle(item.id, e.target.checked)}
              label={item.label}
              description={
                item.description || item.href ? (
                  <>
                    {item.description}
                    {item.href ? (
                      <>
                        {item.description ? ' ' : null}
                        <Link href={item.href}>Read the guide</Link>
                      </>
                    ) : null}
                  </>
                ) : undefined
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
