'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';
import { controlVariants } from '@/components/forms/Input';
import { filterOptions, type ComboboxOption } from './Combobox.utils';
import type { Size } from '@/types/ui';

export interface ComboboxProps {
  options: readonly ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  size?: Size;
  disabled?: boolean;
  className?: string;
}

/**
 * 검색 가능한 선택 — **네이티브 `<datalist>`**.
 *
 * 커스텀 콤보박스는 `role="combobox"` + `aria-expanded` + `aria-activedescendant`
 * + 화살표/Enter/Esc 키보드 + 포커스 관리 + 모바일 대응을 전부 만들어야 하고,
 * 그 조합을 정확히 맞춘 구현은 드물다. `<input list>` 는 브라우저가 그걸 다 한다.
 *
 * 한계도 분명하다: 항목에 아이콘·부가 설명을 넣을 수 없고, 드롭다운 모양을
 * 꾸밀 수 없다. **그 대가로 접근성과 모바일 동작이 공짜로 정확해진다.**
 * 항목을 꾸며야 한다면 그때 커스텀 구현을 검토한다(그리고 키보드 계약을 지킨다).
 *
 * konnect 에서는 학교·지역처럼 **고정 어휘 태그**를 고르는 데 쓴다.
 * 한국어 키워드로도 검색된다 — 사용자가 두 언어를 섞어 쓴다.
 */
export function Combobox({
  options,
  value,
  onChange,
  label,
  placeholder,
  size,
  disabled,
  className,
}: ComboboxProps) {
  const listId = useId();
  const [query, setQuery] = useState('');
  const visible = filterOptions(options, query);

  return (
    <>
      {/* role="combobox" 를 손으로 붙이지 않는다 — `list` 속성이 있으면 브라우저가
          이미 combobox 의미를 부여한다. 롤만 추가하면 aria-controls/aria-expanded 를
          함께 관리해야 하는데, 그건 우리가 아니라 브라우저가 하고 있는 일이다. */}
      <input
        type="text"
        list={listId}
        aria-label={label}
        placeholder={placeholder}
        disabled={disabled}
        value={query || value}
        onChange={(e) => {
          const next = e.target.value;
          setQuery(next);
          // datalist 에서 고르면 값이 통째로 바뀐다 — 그때만 확정한다
          const picked = options.find((o) => o.label === next || o.value === next);
          if (picked) {
            onChange(picked.value);
            setQuery('');
          }
        }}
        className={cn(controlVariants({ size }), className)}
      />
      <datalist id={listId}>
        {visible.map((o) => (
          <option key={o.value} value={o.label} />
        ))}
      </datalist>
    </>
  );
}
