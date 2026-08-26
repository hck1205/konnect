import type { FieldControlProps } from '@/components/forms/Field';

export interface TagInputProps extends Partial<FieldControlProps> {
  /** 현재 태그 목록(저장 형태). 제어 컴포넌트다. */
  value: readonly string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  /** 최대 개수. 도달하면 입력이 잠긴다. */
  max?: number;
  disabled?: boolean;
  className?: string;
}
