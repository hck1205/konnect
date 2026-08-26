'use client';

import { useId, type CSSProperties } from 'react';

/**
 * CSS 앵커 위치 지정용 이름 한 쌍.
 *
 * `useId()` 는 콜론 등 특수문자를 포함할 수 있는데, CSS 커스텀 프로퍼티 이름에는
 * 쓸 수 없다. 그 정리를 Popover 와 Tooltip 이 각자 하고 있었다 — 같은 실수를
 * 두 번 할 여지를 없앤다.
 *
 * `anchorName`/`positionAnchor` 는 아직 `CSSProperties` 타입에 없어 캐스팅한다.
 */
export interface AnchorBinding {
  /** popover 대상 id */
  id: string;
  /** 트리거에 붙일 style */
  anchorStyle: CSSProperties;
  /** 팝오버에 붙일 style */
  targetStyle: CSSProperties;
}

export function useAnchorName(prefix = 'anchor'): AnchorBinding {
  const id = useId();
  const name = `--${prefix}-${id.replace(/[^a-zA-Z0-9]/g, '')}`;

  return {
    id,
    anchorStyle: { anchorName: name } as CSSProperties,
    targetStyle: { positionAnchor: name } as CSSProperties,
  };
}
