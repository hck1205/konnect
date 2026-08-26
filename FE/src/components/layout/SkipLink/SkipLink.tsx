export interface SkipLinkProps {
  /** 건너뛸 대상의 id. 그 요소에 `tabIndex={-1}` 을 둬야 포커스가 실제로 옮겨진다. */
  targetId?: string;
  children?: string;
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
  children = 'Skip to content',
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
