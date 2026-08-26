import { Ban, Flag, ShieldAlert } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { Avatar } from '@/components/primitives/Avatar';
import { IconButton } from '@/components/primitives/IconButton';
import { Menu, MenuItem, MenuSeparator } from '@/components/overlays/Menu';
import type { MessageParticipant } from '../MessageThread.types';

export interface MessageHeaderProps {
  participant: MessageParticipant;
  onBlock?: () => void;
  onReport?: () => void;
}

/**
 * 대화 헤더 — 상대 이름과 **차단·신고**.
 *
 * 차단과 신고가 여기 있는 것이 이 컴포넌트의 존재 이유다.
 * 메뉴 깊숙이 두면 위급한 순간에 못 찾는다 — 언어가 불편한 사용자에게 특히 그렇다.
 * → docs/50-decisions/0004-direct-messages-with-safety-gates.md 출시 조건 2
 */
export function MessageHeader({ participant, onBlock, onReport }: MessageHeaderProps) {
  const { t } = useI18n();

  return (
    <header className="flex items-center gap-3 border-b border-border px-4 py-3">
      <Avatar name={participant.nickname} src={participant.avatarUrl} size="sm" />
      <span className="flex-1 truncate text-sm font-medium text-fg">
        {participant.nickname}
      </span>

      <Menu
        trigger={(p) => (
          <IconButton
            {...p}
            size="sm"
            icon={<ShieldAlert className="size-4" />}
            label={t('common.more')}
          />
        )}
      >
        {onReport ? (
          <MenuItem icon={<Flag className="size-4" />} onSelect={onReport}>
            {t('message.report')}
          </MenuItem>
        ) : null}
        {onBlock ? (
          <>
            <MenuSeparator />
            <MenuItem icon={<Ban className="size-4" />} destructive onSelect={onBlock}>
              {t('message.block')}
            </MenuItem>
          </>
        ) : null}
      </Menu>
    </header>
  );
}
