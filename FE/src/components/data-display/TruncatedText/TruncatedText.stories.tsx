import type { Story } from '@ladle/react';
import { TruncatedText } from './TruncatedText';

export default { title: 'Data display / TruncatedText' };

const LONG =
  'I got an offer from a company in Seoul but my degree finishes in February, and the company wants me to start in January. My university says I cannot get the graduation certificate before the ceremony, and the immigration office told me over the phone that they need it. I am not sure whether I should ask the company to delay, apply for D-10 in between, or something else entirely.';

/**
 * `line-clamp` 는 **시각적으로만** 자른다 — 텍스트는 DOM 에 그대로 있어
 * 스크린리더와 Ctrl+F 가 전체를 읽는다. `slice()` 로 자르면 그 정보가 사라진다.
 */
export const Expandable: Story = () => (
  <div className="flex max-w-xl flex-col gap-6 text-sm text-fg">
    <div>
      <p className="mb-1 text-xs text-fg-subtle">카드 미리보기 — 펼치기 없음</p>
      <TruncatedText lines={2}>{LONG}</TruncatedText>
    </div>
    <div>
      <p className="mb-1 text-xs text-fg-subtle">펼칠 수 있음 (aria-expanded)</p>
      <TruncatedText lines={2} expandable>
        {LONG}
      </TruncatedText>
    </div>
  </div>
);
