'use client';

import { Check, Languages } from 'lucide-react';
import { cn } from '@/lib/cn';
import { LOCALES, LOCALE_LABELS, useI18n, withLocale, type Locale } from '@/lib/i18n';
import { Menu, MenuItem } from '@/components/overlays/Menu';
import { IconButton } from '@/components/primitives/IconButton';

export interface LocaleSwitcherProps {
  /** 현재 경로 — 로케일만 바꾼 주소를 만들 때 쓴다 */
  pathname: string;
  className?: string;
}

/**
 * 언어 전환기.
 *
 * **링크로 이동한다**(상태 토글이 아니라). 로케일이 URL 세그먼트라 주소가 바뀌어야
 * 하고, 그래야 사용자가 그 주소를 공유했을 때 같은 언어로 열린다.
 *
 * 각 언어 이름을 **그 언어로** 적는다 — "Korean" 이라고 쓰면 한국어 사용자가
 * 자기 언어를 못 찾는다.
 */
export function LocaleSwitcher({ pathname, className }: LocaleSwitcherProps) {
  const { locale, t } = useI18n();

  return (
    <Menu
      className={className}
      trigger={(p) => (
        <IconButton
          {...p}
          size="sm"
          icon={<Languages className="size-4" />}
          label={`${t('locale.change')} (${LOCALE_LABELS[locale]})`}
        />
      )}
    >
      {LOCALES.map((code: Locale) => (
        <MenuItem key={code}>
          <a
            href={withLocale(pathname, code)}
            hrefLang={code}
            aria-current={code === locale ? 'true' : undefined}
            className={cn('flex w-full items-center gap-2', code === locale && 'font-medium')}
          >
            <Check
              className={cn('size-4 shrink-0', code === locale ? 'opacity-100' : 'opacity-0')}
              aria-hidden="true"
            />
            {LOCALE_LABELS[code]}
          </a>
        </MenuItem>
      ))}
    </Menu>
  );
}
