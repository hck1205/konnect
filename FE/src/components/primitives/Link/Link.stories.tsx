import type { Story } from '@ladle/react';
import { Link } from './Link';

export default { title: 'Primitives / Link' };

/**
 * 기본이 **밑줄 있음**이다 — 본문에서 색만으로 링크를 구분하면
 * 색각 이상 사용자에게 링크가 보이지 않는다.
 */
export const Variants: Story = () => (
  <div className="flex max-w-md flex-col gap-3 text-sm text-fg">
    <p>
      절차는 <Link href="#">이 가이드</Link>에 정리되어 있습니다.
    </p>
    <p>
      공식 안내는{' '}
      <Link href="https://example.com" external>
        출입국·외국인정책본부
      </Link>
      에서 확인하세요.
    </p>
    <p>
      <Link href="#" subtle>
        밑줄 없는 변형
      </Link>{' '}
      — 주변이 이미 링크임을 알려줄 때만
    </p>
  </div>
);

/** 외부 링크에는 아이콘과 함께 "새 탭에서 열림"이 스크린리더에 읽힌다 */
export const External: Story = () => (
  <Link href="https://example.com" external>
    Official immigration portal
  </Link>
);
