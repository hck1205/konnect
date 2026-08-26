import { beforeEach, describe, expect, it } from 'vitest';
import {
  confirm,
  getConfirm,
  resetConfirm,
  resolveConfirm,
  subscribeConfirm,
} from './confirm.store';

beforeEach(() => resetConfirm());

describe('confirm store', () => {
  it('요청하면 열린 확인이 생긴다', () => {
    void confirm({ title: 'Delete?' });
    expect(getConfirm()?.title).toBe('Delete?');
  });

  it('기본 라벨을 채운다', () => {
    void confirm({ title: 'Delete?' });
    expect(getConfirm()?.confirmLabel).toBe('Confirm');
    expect(getConfirm()?.cancelLabel).toBe('Cancel');
    expect(getConfirm()?.destructive).toBe(false);
  });

  it('확인하면 true 로 resolve 된다', async () => {
    const promise = confirm({ title: 'Delete?' });
    resolveConfirm(true);
    await expect(promise).resolves.toBe(true);
    expect(getConfirm()).toBeNull();
  });

  it('취소하면 false 로 resolve 된다', async () => {
    const promise = confirm({ title: 'Delete?' });
    resolveConfirm(false);
    await expect(promise).resolves.toBe(false);
  });

  it('새 요청은 앞선 것을 취소로 닫는다 — 확인 창이 쌓이면 안 된다', async () => {
    const first = confirm({ title: 'First' });
    const second = confirm({ title: 'Second' });
    expect(getConfirm()?.title).toBe('Second');
    await expect(first).resolves.toBe(false);
    resolveConfirm(true);
    await expect(second).resolves.toBe(true);
  });

  it('열린 것이 없을 때 resolve 해도 안전하다', () => {
    expect(() => resolveConfirm(true)).not.toThrow();
  });

  it('구독자에게 변경을 알린다', () => {
    let calls = 0;
    const off = subscribeConfirm(() => calls++);
    void confirm({ title: 'x' });
    expect(calls).toBe(1);
    resolveConfirm(true);
    expect(calls).toBe(2);
    off();
  });
});
