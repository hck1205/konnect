import type { Story } from '@ladle/react';
import { Section } from './Section';
import { Link } from '@/components/primitives/Link';

export default { title: 'Layout / Section' };

/** 제목이 있으면 `<section aria-labelledby>` 로 연결된다 — 랜드마크로 훑을 수 있다 */
export const WithTitle: Story = () => (
  <div className="max-w-2xl">
    <Section
      title="Recent questions"
      description="Newest first, across all topics."
      action={<Link href="#">See all</Link>}
    >
      <div className="rounded-md bg-surface-sunken p-6 text-sm text-fg-muted">
        목록이 들어갈 자리
      </div>
    </Section>
  </div>
);

export const WithoutTitle: Story = () => (
  <div className="max-w-2xl">
    <Section>
      <div className="rounded-md bg-surface-sunken p-6 text-sm text-fg-muted">
        제목이 없으면 랜드마크로서 쓸모가 없어 div 로 떨어진다
      </div>
    </Section>
  </div>
);
