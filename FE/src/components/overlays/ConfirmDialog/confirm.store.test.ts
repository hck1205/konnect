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

  /**
   * ⚠️ 이 테스트는 예전에 `'Confirm'`·`'Cancel'` 을 **기대값으로 못박고 있었다.**
   * 그래서 스토어가 영어 폴백을 채우는 동작이 계약처럼 굳었고,
   * 문구를 생략한 호출은 **모든 로케일에서 영어 버튼**을 냈다.
   *
   * 스토어는 사전을 모르는 자리다. 비워 두고 **렌더하는 쪽이 사전에서 채운다** —
   * `ConfirmDialogHost` 가 `t('common.confirm')` 으로 받는다.
   */
  it('라벨을 주지 않으면 비워 둔다 — 영어 폴백을 여기서 채우지 않는다', () => {
    void confirm({ title: 'Delete?' });
    expect(getConfirm()?.confirmLabel).toBeUndefined();
    expect(getConfirm()?.cancelLabel).toBeUndefined();
    expect(getConfirm()?.destructive).toBe(false);
  });

  it('라벨을 주면 그대로 싣는다', () => {
    void confirm({ title: 'Delete?', confirmLabel: '삭제', cancelLabel: '취소' });
    expect(getConfirm()?.confirmLabel).toBe('삭제');
    expect(getConfirm()?.cancelLabel).toBe('취소');
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
