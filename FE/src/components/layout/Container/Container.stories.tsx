import type { Story } from '@ladle/react';
import { Container } from './Container';

export default { title: 'Layout / Container' };

const WIDTHS = ['prose', 'content', 'wide'] as const;

/** `prose` 는 읽기 폭(약 70자)이다 — 긴 줄은 다음 줄을 찾기 어렵다 */
export const Widths: Story = () => (
  <div className="flex flex-col gap-4">
    {WIDTHS.map((w) => (
      <Container key={w} width={w}>
        <div className="rounded-md bg-surface-sunken p-3 text-sm text-fg-muted">
          width=&quot;{w}&quot;
        </div>
      </Container>
    ))}
  </div>
);
