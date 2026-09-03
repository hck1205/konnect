'use client';

import { useSyncExternalStore } from 'react';
import { useI18n } from '@/lib/i18n';
import { Modal } from '@/components/overlays/Modal';
import { Button } from '@/components/primitives/Button';
import {
  getConfirm,
  getServerConfirm,
  resolveConfirm,
  subscribeConfirm,
} from './confirm.store';

/**
 * 확인 다이얼로그가 렌더되는 **단 하나의 지점**. 앱 루트에 한 번만 둔다.
 *
 * `Modal`(네이티브 `<dialog>`) 위에 얹으므로 포커스 트랩·복귀·Esc 는 그대로 따라온다.
 * Esc 는 **취소**로 해석한다 — 확인이 아니라.
 */
export function ConfirmDialogHost() {
  const { t } = useI18n();
  const request = useSyncExternalStore(
    subscribeConfirm,
    getConfirm,
    getServerConfirm,
  );

  return (
    <Modal
      open={request !== null}
      closeLabel={t('common.close')}
      onClose={() => resolveConfirm(false)}
      title={request?.title ?? ''}
      description={request?.description}
      // 파괴적 확인은 배경 클릭으로 닫히지 않는다 — 실수로 지나치지 않게
      closeOnBackdrop={!request?.destructive}
      footer={
        <>
          <Button variant="ghost" tone="neutral" onClick={() => resolveConfirm(false)}>
            {request?.cancelLabel ?? t('common.cancel')}
          </Button>
          <Button
            tone={request?.destructive ? 'danger' : 'brand'}
            onClick={() => resolveConfirm(true)}
          >
            {request?.confirmLabel ?? t('common.confirm')}
          </Button>
        </>
      }
    />
  );
}
