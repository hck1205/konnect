import type { Story } from '@ladle/react';
import { useState } from 'react';
import { Banner } from './Banner';
import { riskToTone } from './Banner.utils';
import type { StatusTone } from '@/types/ui';

export default { title: 'Feedback / Banner' };

const TONES: StatusTone[] = ['info', 'success', 'warning', 'danger'];

export const Tones: Story = () => (
  <div className="flex max-w-2xl flex-col gap-3">
    {TONES.map((tone) => (
      <Banner key={tone} tone={tone} title={tone}>
        Each tone has a fixed icon so the state is never communicated by colour alone.
      </Banner>
    ))}
  </div>
);

/**
 * konnect 의 주 용도 — **R1 콘텐츠 고지**.
 * 닫기 버튼을 주지 않는다(고지는 닫히면 안 된다).
 */
export const RiskDisclaimer: Story = () => {
  const tone = riskToTone('R1');
  if (!tone) return null;
  return (
    <div className="max-w-2xl">
      <Banner tone={tone} title="This is not legal advice">
        This post describes one person&apos;s experience. Immigration rules change and
        depend on your situation. Confirm with the{' '}
        <span lang="ko" translate="no">
          출입국·외국인청
        </span>{' '}
        or your school before you act.
      </Banner>
    </div>
  );
};

/** R3(생활 팁·교류)은 배너를 띄우지 않는다 — 모든 글에 배너가 붙으면 아무도 안 읽는다 */
export const RiskLevels: Story = () => (
  <div className="flex max-w-2xl flex-col gap-3">
    {(['R1', 'R2', 'R3'] as const).map((level) => {
      const tone = riskToTone(level);
      return (
        <div key={level}>
          <p className="mb-1 text-xs font-medium text-fg-subtle">{level}</p>
          {tone ? (
            <Banner tone={tone}>Risk level {level} shows a banner.</Banner>
          ) : (
            <p className="text-sm text-fg-muted">배너 없음</p>
          )}
        </div>
      );
    })}
  </div>
);

export const Dismissible: Story = () => {
  const [open, setOpen] = useState(true);
  return (
    <div className="max-w-2xl">
      {open ? (
        <Banner tone="info" onDismiss={() => setOpen(false)}>
          Dismissible banners are for tips — never for risk disclaimers.
        </Banner>
      ) : (
        <button
          type="button"
          className="text-sm text-brand underline"
          onClick={() => setOpen(true)}
        >
          다시 보기
        </button>
      )}
    </div>
  );
};
