import type { Story } from '@ladle/react';
import { ErrorState } from './ErrorState';

export default { title: 'Feedback / ErrorState' };

/**
 * **사용자에게 기술적 메시지를 보여주지 않는다.**
 * "Request failed with status code 500" 은 사용자가 할 수 있는 일을 알려주지 않는다.
 *
 * `detail` 은 개발 환경에서만 렌더된다 — 운영에서 내부 정보를 노출하지 않는다.
 */
export const Default: Story = () => (
  <div className="max-w-xl">
    <ErrorState onRetry={() => {}} detail="AxiosError: Request failed with status code 500" />
  </div>
);

export const WithoutRetry: Story = () => (
  <div className="max-w-xl">
    <ErrorState
      title="This question was removed"
      description="It may have been deleted by its author or by a moderator."
    />
  </div>
);
