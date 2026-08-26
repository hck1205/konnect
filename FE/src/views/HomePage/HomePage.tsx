import { HomeView } from './HomeView';

/**
 * 홈 페이지 — business 레이어.
 * 데이터 조회/상태는 여기서 다루고, 마크업은 HomeView 에 위임한다.
 */
export function HomePage({ pathname }: { pathname: string }) {
  return <HomeView pathname={pathname} />;
}
