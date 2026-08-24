import { HomeView } from './HomeView';

/**
 * 홈 페이지 — business 레이어.
 * 데이터 조회/상태는 여기서 다루고, 마크업은 HomeView 에 위임한다.
 * (지금은 골격이라 넘길 상태가 없다)
 */
export function HomePage() {
  return <HomeView />;
}
