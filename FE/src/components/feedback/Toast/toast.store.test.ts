import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearToasts,
  dismissToast,
  getToasts,
  showToast,
  subscribeToasts,
} from './toast.store';

beforeEach(() => clearToasts());

describe('toast store', () => {
  it('토스트를 추가하고 id 를 돌려준다', () => {
    const id = showToast('Saved');
    expect(getToasts()).toHaveLength(1);
    expect(getToasts()[0].id).toBe(id);
    expect(getToasts()[0].tone).toBe('info');
  });

  it('danger 는 기본적으로 자동으로 사라지지 않는다 — 놓치면 안 되는 내용이다', () => {
    showToast('Failed', { tone: 'danger' });
    expect(getToasts()[0].durationMs).toBe(0);
  });

  it('durationMs 를 명시하면 그 값을 쓴다', () => {
    showToast('Failed', { tone: 'danger', durationMs: 3000 });
    expect(getToasts()[0].durationMs).toBe(3000);
  });

  it('최대 3개까지만 유지하고 오래된 것을 밀어낸다', () => {
    showToast('1');
    showToast('2');
    showToast('3');
    showToast('4');
    expect(getToasts().map((t) => t.message)).toEqual(['2', '3', '4']);
  });

  it('id 로 닫는다', () => {
    const id = showToast('Saved');
    dismissToast(id);
    expect(getToasts()).toHaveLength(0);
  });

  it('없는 id 를 닫아도 안전하다', () => {
    showToast('Saved');
    dismissToast('nope');
    expect(getToasts()).toHaveLength(1);
  });

  it('구독자에게 변경을 알린다', () => {
    let calls = 0;
    const unsubscribe = subscribeToasts(() => calls++);
    showToast('a');
    expect(calls).toBe(1);
    unsubscribe();
    showToast('b');
    expect(calls).toBe(1);
  });

  it('스냅샷은 불변 참조로 교체된다 — useSyncExternalStore 가 참조로 비교한다', () => {
    const before = getToasts();
    showToast('a');
    expect(getToasts()).not.toBe(before);
  });
});
