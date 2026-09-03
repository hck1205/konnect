import type { ReactNode } from 'react';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** 닫기 버튼의 접근 이름. 아이콘뿐이라 이 문구가 유일한 단서다 */
  closeLabel: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** 하단 액션 영역. 주요 버튼을 오른쪽에 둔다. */
  footer?: ReactNode;
  /** 배경 클릭으로 닫히게 할지. 파괴적 확인 다이얼로그에서는 끈다. */
  closeOnBackdrop?: boolean;
  className?: string;
}
