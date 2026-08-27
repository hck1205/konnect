import { patchRecord } from './patch';

interface Record {
  id: string;
  authorId: string;
  title: string;
  createdAt: string;
}

const existing: Record = {
  id: 'q1',
  authorId: 'owner',
  title: 'before',
  createdAt: '2026-08-24T12:00:00Z',
};

const IMMUTABLE = ['id', 'authorId', 'createdAt'] as const;

describe('patchRecord', () => {
  it('바뀔 수 있는 필드는 반영한다', () => {
    expect(patchRecord(existing, { title: 'after' }, IMMUTABLE).title).toBe(
      'after',
    );
  });

  it('**소유자를 바꿀 수 없다** — 이걸 빠뜨리면 patch 로 소유권이 넘어간다', () => {
    const next = patchRecord(existing, { authorId: 'attacker' }, IMMUTABLE);
    expect(next.authorId).toBe('owner');
  });

  it('id 와 생성 시각도 고정된다', () => {
    const next = patchRecord(
      existing,
      { id: 'other', createdAt: '2000-01-01T00:00:00Z' },
      IMMUTABLE,
    );
    expect(next.id).toBe('q1');
    expect(next.createdAt).toBe('2026-08-24T12:00:00Z');
  });

  it('불변 필드와 가변 필드가 섞여 와도 가변만 반영한다', () => {
    const next = patchRecord(
      existing,
      { title: 'after', authorId: 'attacker' },
      IMMUTABLE,
    );
    expect(next.title).toBe('after');
    expect(next.authorId).toBe('owner');
  });

  it('원본을 변형하지 않는다', () => {
    patchRecord(existing, { title: 'after' }, IMMUTABLE);
    expect(existing.title).toBe('before');
  });

  it('빈 patch 는 그대로', () => {
    expect(patchRecord(existing, {}, IMMUTABLE)).toEqual(existing);
  });
});
