'use client';

import { useEffect, useRef } from 'react';

/**
 * `open` prop 을 네이티브 `<dialog>` 의 실제 상태와 동기화한다.
 *
 * `<dialog>` 는 `open` 속성을 직접 쓰면 **모달이 되지 않는다** —
 * `showModal()` 로 열어야 top layer 진입 · 포커스 트랩 · `::backdrop` · Esc 닫기가
 * 전부 활성화된다. 이 차이가 이 훅이 존재하는 이유다.
 *
 * 브라우저가 처리해 주는 것(직접 구현하지 않는다):
 *  - 열 때 포커스 이동, 닫을 때 호출 요소로 복귀
 *  - 포커스 트랩
 *  - Esc 닫기 (`cancel` 이벤트)
 *  - 뒤 콘텐츠를 접근성 트리에서 제외
 */
export function useDialogElement(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Esc 및 close() 로 닫혔을 때 부모 상태를 되돌린다.
    // 이게 없으면 Esc 로 닫은 뒤 open 이 true 로 남아 다시 열리지 않는다.
    const handleClose = () => onClose();
    el.addEventListener('close', handleClose);
    return () => el.removeEventListener('close', handleClose);
  }, [onClose]);

  return ref;
}
