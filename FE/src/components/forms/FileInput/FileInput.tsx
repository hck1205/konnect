'use client';

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { Paperclip, Upload, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/primitives/Button';

export interface FileInputProps {
  /** 허용 타입 (`image/*`, `.pdf`) */
  accept?: string;
  multiple?: boolean;
  /** 개당 최대 바이트. 넘으면 그 파일만 걸러내고 사유를 알린다. */
  maxBytes?: number;
  files: readonly File[];
  onChange: (files: File[]) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/** 바이트 → 사람이 읽는 크기. Intl 로 로케일 숫자 형식을 따른다. */
function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB'];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value)} ${units[unit]}`;
}

/**
 * 파일 선택 — **네이티브 `<input type="file">`** 을 감춰 두고 버튼으로 연다.
 *
 * 파일 다이얼로그는 **사용자 제스처에서만** 열 수 있어 input 을 없앨 수 없다.
 * `sr-only` 로 숨기고(`display:none` 이 아니라 — 그러면 포커스를 못 받는다)
 * 레이블/버튼으로 연다.
 *
 * 드래그 앤 드롭은 **보조 수단**이다. 드롭만 되는 업로더는 키보드·터치
 * 사용자에게 존재하지 않는 기능이다.
 */
export function FileInput({
  accept,
  multiple,
  maxBytes,
  files,
  onChange,
  label = 'Attach files',
  disabled,
  className,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [rejected, setRejected] = useState<string[]>([]);

  const accept_ = (incoming: FileList | null) => {
    if (!incoming) return;
    const next: File[] = [];
    const bad: string[] = [];
    for (const file of Array.from(incoming)) {
      if (maxBytes !== undefined && file.size > maxBytes) bad.push(file.name);
      else next.push(file);
    }
    setRejected(bad);
    onChange(multiple ? [...files, ...next] : next.slice(0, 1));
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div
        onDragOver={(e: DragEvent) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e: DragEvent) => {
          e.preventDefault();
          setDragging(false);
          if (!disabled) accept_(e.dataTransfer.files);
        }}
        className={cn(
          'flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center',
          dragging ? 'border-brand bg-brand-subtle' : 'border-border-strong',
          disabled && 'opacity-50',
        )}
      >
        <Upload className="size-5 text-fg-subtle" aria-hidden="true" />
        <p className="text-sm text-fg-muted">
          Drag files here, or
        </p>
        <Button
          type="button"
          size="sm"
          variant="outline"
          tone="neutral"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {label}
        </Button>
        {maxBytes ? (
          <p className="text-xs text-fg-subtle">Up to {formatBytes(maxBytes)} each</p>
        ) : null}

        {/* sr-only 로 숨긴다 — display:none 이면 포커스를 못 받는다 */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-label={label}
          className="sr-only"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            accept_(e.target.files);
            // 같은 파일을 다시 고를 수 있게 초기화한다
            e.target.value = '';
          }}
        />
      </div>

      {rejected.length > 0 ? (
        <p role="alert" className="text-sm text-danger">
          Too large, not attached: {rejected.join(', ')}
        </p>
      ) : null}

      {files.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {files.map((file) => (
            <li
              key={`${file.name}-${file.size}`}
              className="flex items-center gap-2 rounded-md bg-surface-sunken px-2.5 py-1.5 text-sm"
            >
              <Paperclip className="size-3.5 shrink-0 text-fg-subtle" aria-hidden="true" />
              <span className="flex-1 truncate text-fg">{file.name}</span>
              <span className="shrink-0 text-xs text-fg-subtle">
                {formatBytes(file.size)}
              </span>
              <button
                type="button"
                disabled={disabled}
                aria-label={`Remove ${file.name}`}
                onClick={() => onChange(files.filter((f) => f !== file))}
                className="shrink-0 cursor-pointer rounded-sm p-0.5 text-fg-subtle hover:text-fg"
              >
                <X className="size-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
