import type { Story } from '@ladle/react';
import { RelativeTime } from './RelativeTime';
import { LocaleProvider, LOCALES, LOCALE_LABELS, formatRelative } from '@/lib/i18n';

export default { title: 'Data display / RelativeTime' };

const NOW = new Date('2026-08-24T12:00:00Z');
const DAY = 24 * 60 * 60 * 1000;
const ago = (ms: number) => new Date(NOW.getTime() - ms).toISOString();

// 렌더 중 Date.now() 를 부르지 않는다 — 렌더는 순수해야 한다.
const LOADED_AT = Date.now();
const liveAgo = (ms: number) => new Date(LOADED_AT - ms).toISOString();

/**
 * 포맷은 **앱 로케일을 따른다.** 컴포넌트가 자체 포맷터를 갖지 않고
 * `useI18n().formatRelative` 에 위임한다 — 예전에는 기본값이 영어라
 * 한국어 화면에서도 "3 days ago" 가 나왔다.
 */
export const FollowsAppLocale: Story = () => (
  <div className="flex flex-col gap-3 text-sm text-fg">
    {LOCALES.map((l) => (
      <LocaleProvider key={l} locale={l}>
        <p className="flex items-baseline gap-3">
          <span className="w-24 text-fg-subtle">{LOCALE_LABELS[l]}</span>
          <RelativeTime value={liveAgo(3 * DAY)} />
        </p>
      </LocaleProvider>
    ))}
  </div>
);

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
        ['2시간 전', ago(2 * 60 * 60 * 1000)],
        ['어제', ago(DAY)],
        ['3일 전', ago(3 * DAY)],
        ['2개월 전', ago(60 * DAY)],
        ['미래(5일 후)', new Date(NOW.getTime() + 5 * DAY).toISOString()],
      ].map(([label, iso]) => (
        <tr key={label}>
          <td className="pr-6 py-1 text-fg-subtle">{label}</td>
          <td className="py-1 text-fg">{formatRelative(iso, NOW, 'en')}</td>
          <td className="pl-6 py-1 text-fg-muted">{formatRelative(iso, NOW, 'ko')}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
