'use client';

import type { ReactNode } from 'react';
import { AppShell, type AppShellProps } from '@/components/layout/AppShell';
import { PageHeader, type NavItem } from '@/components/layout/PageHeader';
import { Footer } from '@/components/layout/Footer';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';
import { Button } from '@/components/primitives/Button';
import { useI18n } from '@/lib/i18n';
import { routes } from '@/lib/routes';

export interface SiteShellProps {
  /** 현재 경로. `aria-current` 와 언어 전환 링크가 쓴다 */
  pathname: string;
  nav?: readonly NavItem[];
  aside?: ReactNode;
  width?: AppShellProps['width'];
  children: ReactNode;
}

/**
 * 모든 화면이 쓰는 **사이트 골격** — 헤더(브랜드·네비·언어·로그인) + 푸터.
 *
 * `AppShell` 과 다르다: `AppShell` 은 무엇이 들어올지 모르는 순수 배치이고,
 * 여기는 **이 사이트의 헤더와 푸터가 무엇인지**를 안다.
 *
 * 왜 뽑았나: 네 화면이 바이트 단위로 같은 헤더/푸터 블록을 각자 갖고 있었다.
 * 그래서 헤더에 속성 하나를 더하면 **네 파일을 고쳐야 하고, 하나를 빠뜨려도
 * 나머지 셋이 멀쩡해 보인다** — 홈 링크가 로케일을 잃는 종류의 버그가
 * 정확히 그렇게 한 화면에만 남는다. 안전 고지(`message.safety`)도 마찬가지로
 * 네 벌이었는데, 이건 **모든 페이지에 있어야 하는 법적 고지**다.
 */
export function SiteShell({ pathname, nav, aside, width = 'prose', children }: SiteShellProps) {
  const { t, locale } = useI18n();

  return (
    <AppShell
      width={width}
      aside={aside}
      header={
        <PageHeader
          homeHref={routes.home(locale)}
          nav={nav}
          currentPath={pathname}
          actions={
            <>
              <LocaleSwitcher pathname={pathname} />
              <Button size="sm">{t('common.signIn')}</Button>
            </>
          }
        />
      }
      footer={<Footer disclaimer={t('message.safety')} />}
    >
      {children}
    </AppShell>
  );
}
