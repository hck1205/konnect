/**
 * 액세스 토큰 저장소 — 앱 인프라(lib).
 * 브라우저에서는 localStorage에 영속하고, window가 없는 환경
 * (SSR·node 통합 테스트)에서는 인메모리 폴백을 쓴다.
 * httpClient의 요청 인터셉터가 모든 요청에서 여기서 토큰을 읽으므로,
 * 스토리지 접근이 막힌 브라우저(사이트 데이터 차단, 일부 웹뷰)에서도
 * 던지지 않도록 모든 접근을 try/catch로 감싼다 — 실패는 "비로그인"으로 수렴.
 */

const STORAGE_KEY = 'konnect:access-token';

/** window가 없거나 localStorage가 막힌 환경용 인메모리 폴백 */
let memoryToken: string | null = null;

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return memoryToken;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return memoryToken;
  }
}

export function setAuthToken(token: string): void {
  memoryToken = token;
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, token);
  } catch {
    // 스토리지 불가 — 인메모리로만 유지(탭 생존 동안 로그인 유지)
  }
}

export function clearAuthToken(): void {
  memoryToken = null;
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 스토리지 불가 — 인메모리는 이미 비웠다
  }
}
