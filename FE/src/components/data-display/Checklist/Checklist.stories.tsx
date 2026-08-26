import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Checklist } from './Checklist';
import { toggleChecked } from './Checklist.utils';

export default { title: 'Data display / Checklist' };

/**
 * 초기 정착의 좌절은 대부분 **순서를 몰라서** 생긴다 — 비자·ARC·통장·통신이
 * 서로의 선행조건이라 하나가 막히면 줄줄이 막힌다.
 *
 * 진행 상태는 부모가 들고 있다(제어 컴포넌트). 로컬 저장을 전제로 설계했으므로
 * 계정 없이도 쓸 수 있고 체류 정보가 서버에 쌓이지 않는다.
 */
export const AfterArrival: Story = () => {
  const [checked, setChecked] = useState<string[]>(['arc']);
  return (
    <div className="max-w-lg">
      <Checklist
        title="Right after you arrive"
        description="These depend on each other, so the order matters."
        checked={checked}
        onToggle={(id, next) => setChecked(toggleChecked(checked, id, next))}
        items={[
          {
            id: 'arc',
            label: 'Register as a foreign resident',
            description: 'Almost everything below needs this first.',
            href: '#',
          },
          { id: 'bank', label: 'Open a bank account', description: 'Requirements vary by branch.' },
          { id: 'phone', label: 'Get a phone number', href: '#' },
          { id: 'insurance', label: 'Health insurance' },
          { id: 'transport', label: 'Transit card' },
        ]}
      />
    </div>
  );
};
