'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { Modal } from '@/components/overlays/Modal';
import { Button } from '@/components/primitives/Button';
import { RadioGroup } from '@/components/forms/RadioGroup';
import { Field } from '@/components/forms/Field';
import { Textarea } from '@/components/forms/Textarea';
import { Banner } from '@/components/feedback/Banner';
import { REPORT_REASONS, type ReportReason, type ReportSubmission } from './ReportDialog.types';
import { trackFor } from './ReportDialog.utils';

export interface ReportDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (submission: ReportSubmission) => void | Promise<void>;
  /** 무엇을 신고하는지 (제목 일부). 사용자가 대상을 확인할 수 있게 한다. */
  targetLabel?: string;
}

/**
 * 신고 창.
 *
 * 사유를 고르면 **긴급 트랙인지 즉시 알려준다** — 신고가 어딘가로 사라지는 느낌을
 * 주지 않는 것이 중요하다. 특히 사기 피해를 당하는 중인 사용자에게는
 * "먼저 검토됩니다"라는 확인이 실질적인 안심이다.
 *
 * 신고는 **로그인 없이도** 가능해야 한다는 논의가 있다(→ 열린 질문).
 * 지금은 화면이 게이트를 결정하고 이 컴포넌트는 관여하지 않는다.
 */
export function ReportDialog({ open, onClose, onSubmit, targetLabel }: ReportDialogProps) {
  const { t } = useI18n();
  const [reason, setReason] = useState<ReportReason>('scam');
  const [detail, setDetail] = useState('');
  const [pending, setPending] = useState(false);

  const track = trackFor(reason);

  const submit = async () => {
    setPending(true);
    try {
      await onSubmit({ reason, detail: detail.trim(), track });
      setDetail('');
      onClose();
    } finally {
      setPending(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('report.title')}
      description={targetLabel}
      closeOnBackdrop={false}
      footer={
        <>
          <Button variant="ghost" tone="neutral" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button tone="danger" loading={pending} onClick={() => void submit()}>
            {t('report.submit')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <RadioGroup
          legend={t('report.reason.label')}
          value={reason}
          onChange={(v) => setReason(v as ReportReason)}
          options={REPORT_REASONS.map((r) => ({
            value: r.value,
            label: t(r.labelKey),
            description: r.hintKey ? t(r.hintKey) : undefined,
          }))}
        />

        {/* 고른 사유가 긴급이면 바로 알려준다 */}
        {track === 'urgent' ? <Banner tone="info">{t('report.description')}</Banner> : null}

        <Field label={t('report.detail.label')}>
          {(aria) => (
            <Textarea
              {...aria}
              rows={3}
              value={detail}
              placeholder={t('report.detail.placeholder')}
              onChange={(e) => setDetail(e.target.value)}
            />
          )}
        </Field>
      </div>
    </Modal>
  );
}
