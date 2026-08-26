import type { StatusTone } from '@/types/ui';

/**
 * 토스트 외부 스토어.
 *
 * Context Provider 가 아니라 모듈 스토어인 이유: 토스트는 **React 밖에서도** 띄워야 한다.
 * react-query 의 `onError` 는 컴포넌트가 아니라 라이브러리가 부르는 콜백이라 훅을 쓸 수 없다.
 * 스토어 함수라면 어디서든 `showToast(...)` 로 부를 수 있고, 렌더는 `ToastHost` 한 곳에서만
 * 일어난다.
 */

export interface Toast {
  id: string;
  tone: StatusTone;
  message: string;
  /** 자동으로 사라지기까지의 ms. 0이면 사라지지 않는다(사용자가 닫아야 한다). */
  durationMs: number;
}

type Listener = () => void;

const listeners = new Set<Listener>();
let toasts: readonly Toast[] = [];
let seq = 0;

/**
 * 동시에 띄울 최대 개수. 넘으면 가장 오래된 것을 밀어낸다 —
 * 화면을 토스트로 덮어 정작 내용을 못 보게 하지 않는다.
 */
const MAX_VISIBLE = 3;

function emit() {
  for (const l of listeners) l();
}

export function subscribeToasts(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToasts(): readonly Toast[] {
  return toasts;
}

/** 서버 스냅샷 — 서버에서는 토스트가 없다 */
export function getServerToasts(): readonly Toast[] {
  return EMPTY;
}
const EMPTY: readonly Toast[] = [];

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function showToast(
  message: string,
  options: { tone?: StatusTone; durationMs?: number } = {},
): string {
  const id = `toast-${++seq}`;
  const toast: Toast = {
    id,
    message,
    tone: options.tone ?? 'info',
    // danger 는 기본적으로 자동으로 사라지지 않는다 — 놓치면 안 되는 내용이다
    durationMs:
      options.durationMs ?? (options.tone === 'danger' ? 0 : 5000),
  };

  toasts = [...toasts, toast].slice(-MAX_VISIBLE);
  emit();
  return id;
}

/** 테스트/스토리 초기화용 */
export function clearToasts() {
  toasts = EMPTY;
  seq = 0;
  emit();
}
