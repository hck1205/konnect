'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { FileDropzone } from './FileDropzone';
import { FileList } from './FileList';
import { selectFiles } from './FileInput.utils';

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

/**
 * 파일 선택 — 조립만 한다.
 *
 * 걸러내는 규칙은 `selectFiles`(순수 함수, 테스트됨)에 있다.
 * 단일 선택인데 이어붙이거나, 걸러진 이유를 안 알리는 것이 여기서 틀리기 쉬운 부분이라
 * UI 밖으로 뺐다.
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
  const [rejected, setRejected] = useState<string[]>([]);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <FileDropzone
        accept={accept}
        multiple={multiple}
        maxBytes={maxBytes}
        label={label}
        disabled={disabled}
        onFiles={(incoming) => {
          const result = selectFiles(files, incoming, { multiple, maxBytes });
          setRejected(result.rejected);
          onChange(result.accepted);
        }}
      />

      {rejected.length > 0 ? (
        <p role="alert" className="text-sm text-danger">
          Too large, not attached: {rejected.join(', ')}
        </p>
      ) : null}

      <FileList
        files={files}
        disabled={disabled}
        onRemove={(file) => onChange(files.filter((f) => f !== file))}
      />
    </div>
  );
}
