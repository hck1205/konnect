import type { Story } from '@ladle/react';
import { useState } from 'react';
import { SearchInput } from './SearchInput';

export default { title: 'Forms / SearchInput' };

/**
 * `<form role="search">` + `<input type="search">` 다.
 * 랜드마크라 스크린리더가 바로 건너뛸 수 있고, 모바일 키보드의 엔터가 "검색"이 된다.
 */
export const Default: Story = () => {
  const [q, setQ] = useState('');
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <div className="flex max-w-md flex-col gap-3">
      <SearchInput value={q} onChange={setQ} onSubmit={setSubmitted} />
      {submitted ? (
        <p className="text-sm text-fg-muted">제출됨: {submitted}</p>
      ) : (
        <p className="text-sm text-fg-subtle">입력 후 Enter 를 눌러 보세요.</p>
      )}
    </div>
  );
};

/** 값이 있으면 지우기 버튼이 나타난다 */
export const WithValue: Story = () => {
  const [q, setQ] = useState('D-2 visa extension');
  return (
    <div className="max-w-md">
      <SearchInput value={q} onChange={setQ} />
    </div>
  );
};

export const Sizes: Story = () => {
  const [q, setQ] = useState('');
  return (
    <div className="flex max-w-md flex-col gap-3">
      <SearchInput value={q} onChange={setQ} size="sm" />
      <SearchInput value={q} onChange={setQ} size="md" />
      <SearchInput value={q} onChange={setQ} size="lg" />
    </div>
  );
};
