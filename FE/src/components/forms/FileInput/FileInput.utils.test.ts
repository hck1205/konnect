import { describe, expect, it } from 'vitest';
import { formatBytes, selectFiles } from './FileInput.utils';

const file = (name: string, size: number) =>
  new File(['x'.repeat(Math.min(size, 10))], name, { type: 'text/plain' });

// File.size 는 내용에서 나오므로 테스트용으로 덮어쓴다
const sized = (name: string, size: number) => {
  const f = file(name, size);
  Object.defineProperty(f, 'size', { value: size });
  return f;
};

describe('selectFiles', () => {
  it('multiple 이면 기존에 이어붙인다', () => {
    const current = [sized('a.png', 10)];
    const result = selectFiles(current, [sized('b.png', 10)], { multiple: true });
    expect(result.accepted.map((f) => f.name)).toEqual(['a.png', 'b.png']);
  });

  it('단일 선택이면 기존을 대체한다 — 이어붙이면 단일의 의미가 없다', () => {
    const current = [sized('a.png', 10)];
    const result = selectFiles(current, [sized('b.png', 10), sized('c.png', 10)]);
    expect(result.accepted.map((f) => f.name)).toEqual(['b.png']);
  });

  it('크기 초과 파일을 걸러내고 이름을 남긴다 — 이유를 알려야 한다', () => {
    const result = selectFiles([], [sized('big.png', 5000), sized('ok.png', 10)], {
      multiple: true,
      maxBytes: 1000,
    });
    expect(result.accepted.map((f) => f.name)).toEqual(['ok.png']);
    expect(result.rejected).toEqual(['big.png']);
  });

  it('maxBytes 가 없으면 크기를 보지 않는다', () => {
    const result = selectFiles([], [sized('huge.png', 1e9)], { multiple: true });
    expect(result.accepted).toHaveLength(1);
    expect(result.rejected).toEqual([]);
  });

  it('빈 입력은 기존을 유지한다', () => {
    const current = [sized('a.png', 10)];
    expect(selectFiles(current, [], { multiple: true }).accepted).toEqual(current);
  });
});

describe('formatBytes', () => {
  it('단위를 올린다', () => {
    expect(formatBytes(512)).toBe('512 B');
    expect(formatBytes(2048)).toBe('2 KB');
    expect(formatBytes(2 * 1024 * 1024)).toBe('2 MB');
  });

  it('로케일 숫자 형식을 따른다 — 베트남어는 소수점이 쉼표다', () => {
    expect(formatBytes(1536, 'en')).toBe('1.5 KB');
    expect(formatBytes(1536, 'vi')).toBe('1,5 KB');
  });

  it('음수는 0으로 수렴한다', () => {
    expect(formatBytes(-5)).toBe('0 B');
  });
});
