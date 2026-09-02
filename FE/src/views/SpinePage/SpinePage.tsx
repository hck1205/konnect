import { SpineView, type SpineViewProps } from './SpineView';

/**
 * 척추 — business 레이어.
 * 데이터는 서버 컴포넌트가 빌드 시점·요청 시점에 이미 모아 왔다.
 */
export function SpinePage(props: SpineViewProps) {
  return <SpineView {...props} />;
}
