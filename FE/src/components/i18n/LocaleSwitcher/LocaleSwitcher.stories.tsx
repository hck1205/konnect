import type { Story } from '@ladle/react';
import { LocaleSwitcher } from './LocaleSwitcher';
import { LocaleProvider, LOCALES, LOCALE_LABELS, withLocale } from '@/lib/i18n';

export default { title: 'i18n / LocaleSwitcher' };

/**
 * **링크로 이동한다**(상태 토글이 아니라). 로케일이 URL 세그먼트라 주소가 바뀌어야
 * 사용자가 그 주소를 공유했을 때 같은 언어로 열린다.
 *
 * 각 언어 이름을 **그 언어로** 적는다 — "Korean" 이라고 쓰면 한국어 사용자가
 * 자기 언어를 못 찾는다.
 */
export const Default: Story = () => (
  <div className="flex flex-col gap-4">
    <LocaleSwitcher pathname="/ko/questions/123" />
    <div className="text-sm text-fg-muted">
      <p className="mb-1">현재 경로 <code>/ko/questions/123</code> 에서 만들어지는 주소:</p>
      <ul className="flex flex-col gap-0.5 font-mono text-xs">
        {LOCALES.map((l) => (
          <li key={l}>
            {LOCALE_LABELS[l]} → {withLocale('/ko/questions/123', l)}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

/** Provider 로 로케일을 바꾸면 트리거의 접근 가능한 이름도 그 언어를 반영한다 */
export const InEachLocale: Story = () => (
  <div className="flex items-center gap-4">
    {LOCALES.map((l) => (
      <LocaleProvider key={l} locale={l}>
        <div className="flex flex-col items-center gap-1">
          <LocaleSwitcher pathname={`/${l}/questions`} />
          <span className="text-xs text-fg-subtle">{LOCALE_LABELS[l]}</span>
        </div>
      </LocaleProvider>
    ))}
  </div>
);
