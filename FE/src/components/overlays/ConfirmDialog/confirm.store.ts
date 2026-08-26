/**
 * 확인 다이얼로그 외부 스토어.
 *
 * `window.confirm` 을 대체한다. 브라우저 기본 confirm 은 스타일을 못 바꾸고,
 * 모바일에서 도메인이 노출되며, 무엇보다 **Promise 를 돌려주지 않아** 흐름이 끊긴다.
 *
 * Toast 와 같은 이유로 모듈 스토어다 — React 밖(이벤트 핸들러, 뮤테이션 콜백)에서
 * 부를 수 있어야 하고, 렌더는 `ConfirmDialogHost` 한 곳에서만 일어난다.
 */

export interface ConfirmRequest {
  id: string;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel: string;
  /** 파괴적 행동이면 확인 버튼이 danger 가 되고 배경 클릭으로 닫히지 않는다 */
  destructive: boolean;
}

type Listener = () => void;

const listeners = new Set<Listener>();
let current: ConfirmRequest | null = null;
let resolver: ((ok: boolean) => void) | null = null;
let seq = 0;

function emit() {
  for (const l of listeners) l();
}

export function subscribeConfirm(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getConfirm(): ConfirmRequest | null {
  return current;
}

/** 서버에서는 열린 다이얼로그가 없다 */
export function getServerConfirm(): ConfirmRequest | null {
  return null;
}

/**
 * 확인을 요청하고 사용자의 선택을 기다린다.
 *
 * ```ts
 * if (await confirm({ title: 'Delete this question?', destructive: true })) { … }
 * ```
 *
 * 이미 열린 확인이 있으면 **그것을 취소로 닫고** 새 요청을 띄운다 —
 * 확인 창이 쌓이면 사용자가 무엇에 답하는지 알 수 없다.
 */
export function confirm(options: {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}): Promise<boolean> {
  resolver?.(false);

  current = {
    id: `confirm-${++seq}`,
    title: options.title,
    description: options.description,
    confirmLabel: options.confirmLabel ?? 'Confirm',
    cancelLabel: options.cancelLabel ?? 'Cancel',
    destructive: options.destructive ?? false,
  };
  emit();

  return new Promise<boolean>((resolve) => {
    resolver = resolve;
  });
}

/** 사용자 응답 — 호스트가 부른다 */
export function resolveConfirm(ok: boolean) {
  const resolve = resolver;
  current = null;
  resolver = null;
  emit();
  resolve?.(ok);
}

/** 테스트 초기화용 */
export function resetConfirm() {
  resolver?.(false);
  current = null;
  resolver = null;
  seq = 0;
  emit();
}
