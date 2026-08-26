import type { Story } from '@ladle/react';
import { RelativeTime } from './RelativeTime';
import { formatRelativeTime } from './RelativeTime.utils';

export default { title: 'Data display / RelativeTime' };

const NOW = new Date('2026-08-24T12:00:00Z');
const DAY = 24 * 60 * 60 * 1000;
const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();

// 렌더 중에 Date.now() 를 부르지 않는다 — 렌더는 순수해야 한다.
// 모듈 로드 시 한 번만 계산한다(스토리에서는 그걸로 충분하다).
const LOADED_AT = Date.now();
const liveAgo = (ms: number) => new Date(LOADED_AT - ms).toISOString();

/**
 * `Intl.RelativeTimeFormat` 을 쓴다 — "3 days ago" 를 직접 조립하지 않는다.
 * 로케일마다 복수형·어순이 다르고, 다국어로 확장할 예정이기 때문이다.
 */
export const Live: Story = () => (
  <div className="flex flex-col gap-2 text-sm text-fg">
    <p>
      Asked <RelativeTime value={liveAgo(3 * DAY)} />
    </p>
    <p>
      Answered <RelativeTime value={liveAgo(2 * 60 * 60 * 1000)} />
    </p>
    <p className="text-fg-subtle">
      마우스를 올리면 절대 시각(title)이 보인다. `&lt;time datetime&gt;` 이라 기계도 읽는다.
    </p>
  </div>
);

/** 기준 시각을 고정하면 출력이 결정적이다 — 그래서 유닛 테스트가 가능하다 */
export const FixedReference: Story = () => (
  <table className="text-sm">
    <tbody>
      {[
        ['5초 전', ago(5000)],
        ['2시간 전', ago(2 * 60 * 60 * 1000)],
        ['어제', ago(DAY)],
        ['3일 전', ago(3 * DAY)],
        ['2개월 전', ago(60 * DAY)],
        ['미래(5일 후)', new Date(NOW.getTime() + 5 * DAY).toISOString()],
      ].map(([label, iso]) => (
        <tr key={label}>
          <td className="pr-6 py-1 text-fg-subtle">{label}</td>
          <td className="py-1 text-fg">{formatRelativeTime(iso, NOW)}</td>
          <td className="pl-6 py-1 text-fg-muted">{formatRelativeTime(iso, NOW, 'ko')}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
