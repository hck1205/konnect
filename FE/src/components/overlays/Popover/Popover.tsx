'use client';

import { useId, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface PopoverTriggerProps {
  /** 네이티브 popover 연결 속성 — 트리거 `<button>` 에 그대로 펼친다 */
  popoverTarget: string;
  style: CSSProperties;
}

export interface PopoverProps {
  /**
   * 트리거 렌더 함수. **`<button>` 이어야 한다** — div 에 걸면 키보드로 열 수 없다.
   * 받은 props 를 그대로 펼쳐 준다.
   */
  trigger: (props: PopoverTriggerProps) => ReactElement;
  children: ReactNode;
  className?: string;
}

/** CSS 커스텀 프로퍼티 이름으로 쓸 수 있게 useId 의 특수문자를 제거한다 */
const toAnchorName = (id: string) => `--anchor-${id.replace(/[^a-zA-Z0-9]/g, '')}`;

/**
 * 팝오버 — **네이티브 Popover API**.
 *
 * 브라우저가 처리하는 것: top layer 배치, 바깥 클릭 닫기, Esc 닫기, 트리거 연결.
 * **열림 상태를 위한 JS 가 전혀 없다** — 이게 이 방식을 택한 이유다.
 * → docs/25-design/10-foundations/08-native-platform.md
 *
 * 모달과의 차이: 팝오버는 non-modal 이라 뒤 페이지가 계속 조작 가능하다.
 * 뒤를 막아야 한다면 `Modal`(`<dialog>`)을 쓴다.
 *
 * 위치는 CSS 앵커 위치 지정을 쓰고, 미지원 브라우저에서는 화면 상단 중앙으로 떨어진다
 * (`popover-anchored` 유틸리티의 `@supports` 폴백).
 */
export function Popover({ trigger, children, className }: PopoverProps) {
  const id = useId();
  const anchorName = toAnchorName(id);

  return (
    <>
      {trigger({
        popoverTarget: id,
        // anchorName 은 아직 CSSProperties 타입에 없다
        style: { anchorName } as CSSProperties,
      })}
      <div
        id={id}
        popover="auto"
        style={{ positionAnchor: anchorName } as CSSProperties}
        className={cn(
          'popover-anchored w-56 rounded-lg border border-border bg-surface-overlay p-1 text-fg shadow-e3',
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}
