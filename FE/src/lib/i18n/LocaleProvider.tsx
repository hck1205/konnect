'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { DEFAULT_LOCALE, type Locale } from './locales';
import { MESSAGES, en, type MessageKey } from './messages';
import { translate, type TranslateParams } from './translate';
import {
  formatCurrency,
  formatDate,
  formatList,
  formatNumber,
  formatRelative,
} from './format';

export interface I18n {
  locale: Locale;
  /** 번역. 키는 기준 사전(en)에 있는 것만 허용된다 — 오타가 컴파일 타임에 잡힌다. */
  t: (key: MessageKey, params?: TranslateParams) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency?: string) => string;
  formatDate: (value: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  formatList: (items: readonly string[], type?: Intl.ListFormatType) => string;
  /** 상대 시각. 1분 미만이면 `common.justNow` 문구를 돌려준다. */
  formatRelative: (value: Date | string, now: Date) => string;
}

/**
 * 기본값은 기준 로케일이다.
 *
 * Provider 를 깜빡해도 **영어로 동작한다** — 컴포넌트가 문구 대신 에러를 내는 것보다
 * 낫다. Ladle 스토리도 Provider 없이 렌더된다.
 */
const I18nContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return <I18nContext.Provider value={locale}>{children}</I18nContext.Provider>;
}

/**
 * 번역과 포맷터.
 *
 * 테마와 달리 **Context 를 쓴다.** 로케일은 URL 세그먼트라 페이지 전환 시에만
 * 바뀌고(그때는 어차피 전체가 다시 렌더된다), 서버 컴포넌트에서 내려온 값을
 * 트리에 흘려보내야 한다.
 */
export function useI18n(): I18n {
  const locale = useContext(I18nContext);

  return useMemo(() => {
    const messages = MESSAGES[locale] ?? en;

    const t = (key: MessageKey, params?: TranslateParams) =>
      translate(messages, en, key, locale, params);

    return {
      locale,
      t,
      formatNumber: (value, options) => formatNumber(value, locale, options),
      formatCurrency: (value, currency) => formatCurrency(value, locale, currency),
      formatDate: (value, options) => formatDate(value, locale, options),
      formatList: (items, type) => formatList(items, locale, type),
      formatRelative: (value, now) => {
        const relative = formatRelative(value, now, locale);
        // ⚠️ `|| t('common.justNow')` 하나로 두면 **파싱 실패가 "방금" 이 된다.**
        // 모르는 것을 가장 신선한 값으로 채우는 셈이라, R1 영역에서 위험이
        // 정확히 반대 방향으로 접힌다. 모르면 아무것도 말하지 않는다.
        if (relative === null) return '';
        return relative === '' ? t('common.justNow') : relative;
      },
    };
  }, [locale]);
}
