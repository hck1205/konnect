import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { getAuthToken } from '@/lib/auth-token';

/**
 * 공용 HTTP 클라이언트(axios 인스턴스).
 * 모든 query/mutation 구현체는 이 인스턴스를 통해 통신한다.
 * dev에서는 next.config rewrites가 /api → BE(:4000)로 프록시한다.
 */
export const httpClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 저장된 액세스 토큰을 Bearer로 첨부
httpClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 응답 인터셉터: 에러 정규화 지점(필요 시 확장)
httpClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

/** BE 전역 TransformInterceptor의 응답 봉투 — 모든 성공 응답이 이 형태다 */
export interface ApiEnvelope<T> {
  data: T;
  timestamp: string;
}

/** 봉투 응답에서 data만 꺼낸다 — `unwrap(await httpClient.get<ApiEnvelope<T>>(...))` */
export const unwrap = <T>(response: AxiosResponse<ApiEnvelope<T>>): T =>
  response.data.data;

/**
 * 상태 코드를 null로 매핑하는 헬퍼 — "없음"이 정상 흐름인 조회에 사용.
 * 예) detail 404 → null (뷰어의 notFound 분기).
 */
export async function orNull<T>(
  promise: Promise<T>,
  statuses: number[] = [404],
): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    if (
      axios.isAxiosError(error) &&
      error.response &&
      statuses.includes(error.response.status)
    ) {
      return null;
    }
    throw error;
  }
}
