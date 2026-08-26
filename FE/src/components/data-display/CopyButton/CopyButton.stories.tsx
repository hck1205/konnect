import type { Story } from '@ladle/react';
import { CopyButton } from './CopyButton';
import { Code } from '@/components/primitives/Code';

export default { title: 'Data display / CopyButton' };

/**
 * konnect 에서 특히 쓸모가 있다: 한국어 행정 용어를 **그대로 복사해**
 * 검색창이나 서류에 붙여넣어야 하는 경우가 많다. 손으로 옮겨 적을 수 없는
 * 사용자가 다수다.
 *
 * 결과를 `aria-live` 로도 알린다 — 아이콘이 체크로 바뀌는 것은 보이는 사용자에게만
 * 피드백이다.
 */
export const KoreanTerms: Story = () => (
  <div className="flex max-w-md flex-col gap-3 text-sm text-fg">
    {[
      ['Alien Registration Card', '외국인등록증'],
      ['Certificate of admission', '표준입학허가서'],
      ['Immigration office', '출입국·외국인청'],
    ].map(([en, ko]) => (
      <div key={ko} className="flex items-center gap-2">
        <span className="flex-1">
          {en} (<Code korean>{ko}</Code>)
        </span>
        <CopyButton value={ko} label={`Copy ${en} in Korean`} />
      </div>
    ))}
  </div>
);
