import { describe, expect, it } from 'vitest';
import { buildFieldAria } from './Field.utils';

describe('buildFieldAria', () => {
  const base = { id: 'f1', hasDescription: false, hasError: false, required: false };

  it('설명도 에러도 없으면 describedby 를 붙이지 않는다', () => {
    expect(buildFieldAria(base)['aria-describedby']).toBeUndefined();
  });

  it('설명만 있으면 설명 id 를 가리킨다', () => {
    expect(buildFieldAria({ ...base, hasDescription: true })['aria-describedby']).toBe(
      'f1-description',
    );
  });

  it('설명과 에러가 모두 있으면 둘 다 이어 붙인다', () => {
    expect(
      buildFieldAria({ ...base, hasDescription: true, hasError: true })[
        'aria-describedby'
      ],
    ).toBe('f1-description f1-error');
  });

  it('에러가 있으면 aria-invalid 가 켜진다', () => {
    expect(buildFieldAria({ ...base, hasError: true })['aria-invalid']).toBe(true);
    expect(buildFieldAria(base)['aria-invalid']).toBeUndefined();
  });

  it('required 는 aria 와 네이티브 속성 양쪽에 반영된다', () => {
    const aria = buildFieldAria({ ...base, required: true });
    expect(aria['aria-required']).toBe(true);
    expect(aria.required).toBe(true);
  });
});
