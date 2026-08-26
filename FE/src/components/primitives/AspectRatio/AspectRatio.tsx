import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface AspectRatioProps {
  /** 가로/세로 비 (16/9, 1, 4/3 …) */
  ratio?: number;
  children: ReactNode;
  className?: string;
}

/**
 * 비율 고정 컨테이너 — **네이티브 `aspect-ratio`**.
 *
 * padding-top 해킹(`padding-top: 56.25%`)을 쓰지 않는다. CSS 속성 하나로 되는 것을
 * 절대 위치 겹치기로 만들면 안쪽 레이아웃이 제약된다.
 *
 * 이미지·지도·영상 자리를 미리 잡아 **로딩 후 레이아웃이 밀리는 것**을 막는다.
 */
export function AspectRatio({ ratio = 16 / 9, children, className }: AspectRatioProps) {
  return (
    <div
      style={{ aspectRatio: String(ratio) } as CSSProperties}
      className={cn('w-full overflow-hidden', className)}
    >
      {children}
    </div>
  );
}
