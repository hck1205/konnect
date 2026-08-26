import type { Story } from '@ladle/react';
import { ThemeToggle } from './ThemeToggle';

export default { title: 'Theme / ThemeToggle' };

/**
 * 눌러 보세요 — light → dark → system → light 로 순환합니다.
 *
 * 아이콘은 **현재 선택**을 보여준다(적용 결과가 아니라). system 을 고르면 모니터
 * 아이콘이 뜨고, 실제 색은 OS 설정을 따른다.
 *
 * ⚠️ Ladle 안에서는 상단 툴바의 테마 컨트롤도 같은 `.dark` 클래스를 만지므로
 * 둘이 서로 덮어쓸 수 있다. 실제 앱에서는 이 토글이 유일한 주인이다.
 */
export const Default: Story = () => (
  <div className="flex items-center gap-4">
    <ThemeToggle />
    <p className="text-sm text-fg-muted">
      선택은 localStorage 에 남고, 다른 탭에도 전파된다.
    </p>
  </div>
);

export const Sizes: Story = () => (
  <div className="flex items-center gap-3">
    <ThemeToggle size="sm" />
    <ThemeToggle size="md" />
    <ThemeToggle size="lg" />
  </div>
);
