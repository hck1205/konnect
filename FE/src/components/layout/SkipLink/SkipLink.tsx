export interface SkipLinkProps {
  /** 건너뛸 대상의 id. 그 요소에 `tabIndex={-1}` 을 둬야 포커스가 실제로 옮겨진다. */
  targetId?: string;
  /**
   * 링크 문구. **필수다.**
   *
   * ⚠️ 기본값(`'Skip to content'`)이 있던 동안 네 로케일 전부에서 영어였다.
   * 그리고 기본값만 없애면 더 나빠진다 — 빈 링크가 렌더되어 접근 이름이
   * 아예 사라진다(실제로 한 번 그렇게 만들었고 산출물을 보고 잡았다).
   * 필수로 두면 타입체크가 부르는 쪽에 번역을 요구한다.
   */
  children: string;
}

/**
 * 본문 바로가기 링크.
 *
 * 키보드 사용자가 페이지마다 네비게이션 링크를 전부 Tab 으로 지나치지 않아도 되게 한다.
 * 스크린리더 사용자에게는 이게 있고 없고가 체감 차이가 크다.
 *
 * 평소에는 화면 밖에 있다가 **포커스를 받으면 나타난다** — `display:none` 으로 숨기면
 * 포커스를 받을 수 없어 목적이 사라진다.
 */
export function SkipLink({
  targetId = 'main-content',
  children,
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-brand-solid focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-fg-on-solid"
    >
      {children}
    </a>
  );
}
