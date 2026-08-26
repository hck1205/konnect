import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Slider } from './Slider';

export default { title: 'Forms / Slider' };

/**
 * 네이티브 `<input type="range">` 다 — 화살표·Home/End·PageUp 키 조작을
 * 브라우저가 처리한다. 현재 값을 **텍스트로도** 보여준다(위치만으로는 정확한 값을 모른다).
 */
export const Default: Story = () => {
  const [budget, setBudget] = useState(600000);
  return (
    <div className="max-w-md">
      <Slider
        label="Maximum monthly rent"
        min={200000}
        max={2000000}
        step={50000}
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
        formatValue={(v) => `${new Intl.NumberFormat('en-US').format(v)} KRW`}
        minLabel="200,000"
        maxLabel="2,000,000"
      />
    </div>
  );
};
