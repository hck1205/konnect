import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Combobox } from './Combobox';
import { labelFor, type ComboboxOption } from './Combobox.utils';
import { Field } from '@/components/forms/Field';

export default { title: 'Forms / Combobox' };

const SCHOOLS: ComboboxOption[] = [
  { value: 'snu', label: 'Seoul National University', keywords: ['서울대학교', '서울대'] },
  { value: 'yonsei', label: 'Yonsei University', keywords: ['연세대학교', '연대'] },
  { value: 'korea', label: 'Korea University', keywords: ['고려대학교', '고대'] },
  { value: 'hufs', label: 'Hankuk University of Foreign Studies', keywords: ['한국외대'] },
  { value: 'kaist', label: 'KAIST', keywords: ['카이스트'] },
];

/**
 * 네이티브 `<datalist>` 다. `role="combobox"` + `aria-activedescendant` + 화살표/Enter/Esc
 * 를 직접 만들지 않는다 — 그 조합을 정확히 맞춘 커스텀 구현은 드물다.
 *
 * **한국어로도 검색된다.** "서울대" 를 입력해 보세요 — 사용자가 두 언어를 섞어 쓴다.
 *
 * 한계: 항목에 아이콘·부가 설명을 못 넣는다. 그 대가로 접근성과 모바일 동작이 정확해진다.
 */
export const SchoolPicker: Story = () => {
  const [value, setValue] = useState('');
  return (
    <div className="max-w-md">
      <Field
        label="Your school"
        description="Type in English or Korean — 서울대, 연대, 카이스트 …"
      >
        {() => (
          <Combobox
            options={SCHOOLS}
            value={value}
            onChange={setValue}
            label="Your school"
            placeholder="Search schools"
          />
        )}
      </Field>
      <p className="mt-2 text-xs text-fg-subtle">
        저장 값: {value || '(없음)'} {value ? `→ ${labelFor(SCHOOLS, value)}` : ''}
      </p>
    </div>
  );
};
