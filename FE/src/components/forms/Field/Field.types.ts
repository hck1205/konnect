import type { ReactNode } from 'react';

export interface FieldProps {
  label: ReactNode;
  /** 보조 설명. 입력 전에 읽어야 하는 내용을 둔다(placeholder 는 레이블도 설명도 아니다). */
  description?: ReactNode;
  /** 에러 문구. 있으면 입력이 `aria-invalid` 가 되고 이 문구가 연결된다. */
  error?: ReactNode;
  required?: boolean;
  /** 미지정 시 자동 생성. 폼 라이브러리가 id 를 관리한다면 넘긴다. */
  id?: string;
  className?: string;
  children: (aria: FieldControlProps) => ReactNode;
}

/**
 * Field 가 자식 입력 요소에 내려주는 접근성 배선.
 * 입력 컴포넌트는 이걸 그대로 펼쳐 쓰면 된다.
 */
export interface FieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  'aria-required'?: true;
  required?: boolean;
}
