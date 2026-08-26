'use client';

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/primitives/Button';
import { formatBytes } from '../FileInput.utils';

export interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxBytes?: number;
  label: string;
  disabled?: boolean;
  onFiles: (files: File[]) => void;
}

/**
 * 파일 고르기 영역 — 버튼 + 드래그앤드롭.
 *
 * **버튼이 주 경로이고 드롭은 보조다.** 드롭만 되는 업로더는 키보드·터치
 * 사용자에게 존재하지 않는 기능이다.
 *
 * `<input type="file">` 을 `sr-only` 로 숨긴다 — `display:none` 이면 포커스를
 * 받을 수 없고, 파일 다이얼로그는 **사용자 제스처에서만** 열 수 있어 input 을
 * 없앨 수도 없다.
 */
export function FileDropzone({
  accept,
  multiple,
  maxBytes,
  label,
  disabled,
  onFiles,
}: FileDropzoneProps) {
  const { locale } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const emit = (list: FileList | null) => {
    if (list) onFiles(Array.from(list));
  };

  return (
    <div
      onDragOver={(e: DragEvent) => {
        e.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e: DragEvent) => {
        e.preventDefault();
        setDragging(false);
        if (!disabled) emit(e.dataTransfer.files);
      }}
      className={cn(
        'flex flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center',
        dragging ? 'border-brand bg-brand-subtle' : 'border-border-strong',
        disabled && 'opacity-50',
      )}
    >
      <Upload className="size-5 text-fg-subtle" aria-hidden="true" />
      <p className="text-sm text-fg-muted">Drag files here, or</p>
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
        <p className="text-xs text-fg-subtle">Up to {formatBytes(maxBytes, locale)} each</p>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-label={label}
        className="sr-only"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          emit(e.target.files);
          // 같은 파일을 다시 고를 수 있게 초기화한다
          e.target.value = '';
        }}
      />
    </div>
  );
}
