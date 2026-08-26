import type { ReactNode } from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** 하단 액션 영역. 주요 버튼을 오른쪽에 둔다. */
  footer?: ReactNode;
  /** 배경 클릭으로 닫히게 할지. 파괴적 확인 다이얼로그에서는 끈다. */
  closeOnBackdrop?: boolean;
  className?: string;
}
