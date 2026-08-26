import type { Story } from '@ladle/react';
import { Breadcrumb } from './Breadcrumb';

export default { title: 'Navigation / Breadcrumb' };

/** 마지막 항목은 링크가 아니라 `aria-current="page"` 텍스트다 */
export const Default: Story = () => (
  <Breadcrumb
    items={[
      { label: 'Home', href: '/' },
      { label: 'Guides', href: '/guides' },
      { label: 'Visa & Stay', href: '/guides/visa' },
      { label: 'Changing from D-2 to E-7' },
    ]}
  />
);
