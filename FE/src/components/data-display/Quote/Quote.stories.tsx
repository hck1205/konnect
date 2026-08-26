import type { Story } from '@ladle/react';
import { Quote } from './Quote';

export default { title: 'Data display / Quote' };

/**
 * R1 콘텐츠에서 **"규정은 이렇다"와 "내 경우엔 이랬다"는 시각적으로 구분**되어야 한다.
 * 개인 사례를 규정으로 오해하면 실제 피해가 난다.
 * → docs/10-domain/10-visa-immigration/03-content-and-risk-policy.md
 */
export const PersonalExperience: Story = () => (
  <div className="flex max-w-xl flex-col gap-5">
    <Quote
      personalExperience
      author="Maria Santos"
      context="E-7, Seoul, 2025"
    >
      In my case the office accepted a bank statement from my home country, but a
      friend at another school was asked for a Korean account.
    </Quote>

    <Quote author="Immigration guide">
      Requirements differ by office and change over time. Confirm before you act.
    </Quote>

    <Quote>출처 없는 일반 인용은 figure 없이 blockquote 만 렌더된다.</Quote>
  </div>
);
