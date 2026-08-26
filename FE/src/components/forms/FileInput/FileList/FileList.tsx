import { Paperclip, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { formatBytes } from '../FileInput.utils';

export interface FileListProps {
  files: readonly File[];
  disabled?: boolean;
  onRemove: (file: File) => void;
}

/**
 * 선택된 파일 목록.
 *
 * 제거 버튼의 접근 가능한 이름에 **파일 이름을 넣는다** — 목록에 파일이 셋이면
 * "Remove" 세 개로는 어느 것을 지우는지 알 수 없다.
 */
export function FileList({ files, disabled, onRemove }: FileListProps) {
  const { locale } = useI18n();
  if (files.length === 0) return null;

  return (
    <ul className="flex flex-col gap-1">
      {files.map((file) => (
        <li
          key={`${file.name}-${file.size}`}
          className="flex items-center gap-2 rounded-md bg-surface-sunken px-2.5 py-1.5 text-sm"
        >
          <Paperclip className="size-3.5 shrink-0 text-fg-subtle" aria-hidden="true" />
          <span className="flex-1 truncate text-fg">{file.name}</span>
          <span className="shrink-0 text-xs text-fg-subtle">
            {formatBytes(file.size, locale)}
          </span>
          <button
            type="button"
            disabled={disabled}
            aria-label={`Remove ${file.name}`}
            onClick={() => onRemove(file)}
            className="shrink-0 cursor-pointer rounded-sm p-0.5 text-fg-subtle hover:text-fg"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </li>
      ))}
    </ul>
  );
}
