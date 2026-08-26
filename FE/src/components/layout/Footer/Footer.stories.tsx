import type { Story } from '@ladle/react';
import { Footer } from './Footer';

export default { title: 'Layout / Footer' };

/**
 * 그룹마다 `<nav aria-label>` 이다 — `<nav>` 하나에 링크 30개를 넣으면
 * 랜드마크로 훑는 의미가 없다.
 *
 * konnect 는 여기에 **전역 고지**를 둔다: 이 사이트가 법률·행정 자문을 제공하지
 * 않는다는 것. 콘텐츠별 R1 배너와 별개로 사이트 전체에 한 번 명시한다.
 */
export const Default: Story = () => (
  <div className="-mx-6 -mb-6">
    <Footer
      groups={[
        {
          title: 'Community',
          links: [
            { href: '/questions', label: 'Questions' },
            { href: '/guides', label: 'Guides' },
            { href: '/meetups', label: 'Meetups' },
          ],
        },
        {
          title: 'Topics',
          links: [
            { href: '/topics/visa', label: 'Visa & Stay' },
            { href: '/topics/housing', label: 'Housing' },
            { href: '/topics/work', label: 'Work' },
          ],
        },
        {
          title: 'About',
          links: [
            { href: '/about', label: 'What is konnect' },
            { href: '/guidelines', label: 'Community guidelines' },
          ],
        },
        {
          title: 'Legal',
          links: [
            { href: '/terms', label: 'Terms' },
            { href: '/privacy', label: 'Privacy' },
          ],
        },
      ]}
      disclaimer="konnect is a community, not a legal or immigration service. Posts describe personal experience and may be out of date. Always confirm with the relevant office or your school before you act."
    />
  </div>
);
