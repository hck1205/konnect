'use client';

import { useSyncExternalStore } from 'react';

/** 아무것도 구독하지 않는다 — 값이 바뀔 일이 없다 */
const noopSubscribe = () => () => {};

/**
 * 하이드레이션이 끝났는지.
 *
 * 서버와 클라이언트에서 결과가 달라지는 값(현재 시각, localStorage, 브라우저 API)을
 * 렌더할 때 쓴다.
 *
 * `useState(false)` + `useEffect(() => setState(true))` 로도 되지만, 그건 effect 안에서
 * 동기적으로 setState 하는 패턴이라 연쇄 렌더를 부른다.
 * `useSyncExternalStore` 는 **서버 스냅샷과 클라이언트 스냅샷을 다르게** 줄 수 있어
 * 이 목적에 정확히 맞는다 — 서버는 false, 클라이언트는 true 를 반환하고,
 * React 가 하이드레이션 시점에 알아서 전환한다.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true, // 클라이언트
    () => false, // 서버
  );
}
