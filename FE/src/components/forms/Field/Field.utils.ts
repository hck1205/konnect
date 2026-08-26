import type { FieldControlProps } from './Field.types';

/**
 * 레이블/설명/에러를 입력 요소에 연결하는 ARIA 속성을 만든다.
 *
 * 이 배선을 각 입력 컴포넌트가 따로 하면 반드시 어딘가 빠진다
 * (특히 `aria-describedby` 에 설명과 에러를 **둘 다** 넣는 것).
 * 그래서 한 곳에 모아 순수 함수로 두고 테스트한다.
 */
export function buildFieldAria(params: {
  id: string;
  hasDescription: boolean;
  hasError: boolean;
  required: boolean;
}): FieldControlProps {
  const { id, hasDescription, hasError, required } = params;

  // 설명과 에러가 모두 있으면 공백으로 이어 붙인다 — 스크린리더가 둘 다 읽는다.
  const describedBy = [
    hasDescription ? `${id}-description` : null,
    hasError ? `${id}-error` : null,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    id,
    'aria-describedby': describedBy || undefined,
    'aria-invalid': hasError ? true : undefined,
    'aria-required': required ? true : undefined,
    required: required || undefined,
  };
}
