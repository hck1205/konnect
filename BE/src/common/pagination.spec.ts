import { clampLimit, paginateByCursor } from './pagination';

const items = Array.from({ length: 5 }, (_, i) => ({ id: `id-${i}` }));

describe('clampLimit', () => {
  it('미지정이면 기본값', () => {
    expect(clampLimit(undefined)).toBe(20);
    expect(clampLimit(NaN)).toBe(20);
  });

  it('범위를 벗어나면 자른다 — 클라이언트가 10000 을 보내도 서버가 죽지 않는다', () => {
    expect(clampLimit(10000)).toBe(100);
    expect(clampLimit(0)).toBe(1);
    expect(clampLimit(-5)).toBe(1);
  });

  it('소수는 버린다', () => {
    expect(clampLimit(10.9)).toBe(10);
  });
});

describe('paginateByCursor', () => {
  it('첫 페이지는 앞에서부터', () => {
    const page = paginateByCursor(items, { limit: 2 });
    expect(page.items.map((i) => i.id)).toEqual(['id-0', 'id-1']);
    expect(page.nextCursor).toBe('id-1');
  });

  it('커서 **다음**부터 이어진다', () => {
    const page = paginateByCursor(items, { cursor: 'id-1', limit: 2 });
    expect(page.items.map((i) => i.id)).toEqual(['id-2', 'id-3']);
  });

  it('마지막 페이지는 nextCursor 가 null', () => {
    const page = paginateByCursor(items, { cursor: 'id-2', limit: 5 });
    expect(page.items.map((i) => i.id)).toEqual(['id-3', 'id-4']);
    expect(page.nextCursor).toBeNull();
  });

  it('정확히 떨어지면 다음이 없다고 판단한다 — limit+1 로 확인하기 때문', () => {
    const page = paginateByCursor(items.slice(0, 2), { limit: 2 });
    expect(page.items).toHaveLength(2);
    expect(page.nextCursor).toBeNull();
  });

  it('없는 커서는 첫 페이지로 떨어진다 — 빈 결과면 사용자가 막다른 길에 갇힌다', () => {
    const page = paginateByCursor(items, { cursor: 'deleted-id', limit: 2 });
    expect(page.items.map((i) => i.id)).toEqual(['id-0', 'id-1']);
  });

  it('빈 목록도 안전하다', () => {
    expect(paginateByCursor([], { limit: 10 })).toEqual({
      items: [],
      nextCursor: null,
    });
  });

  it('limit 을 넘겨도 안전 범위로 잘린다', () => {
    const many = Array.from({ length: 200 }, (_, i) => ({ id: `x-${i}` }));
    expect(paginateByCursor(many, { limit: 10000 }).items).toHaveLength(100);
  });
});
