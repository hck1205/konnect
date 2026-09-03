'use client';

import type { ReactNode } from 'react';
import { AppShell, type AppShellProps } from '@/components/layout/AppShell';
import { PageHeader, type NavItem } from '@/components/layout/PageHeader';
import { Footer } from '@/components/layout/Footer';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';
import { Button } from '@/components/primitives/Button';
import { Banner } from '@/components/feedback/Banner';
import { useI18n, type Locale } from '@/lib/i18n';
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
/**
 * **원어민 검수를 아직 받지 않은 판.**
 *
 * 이 제품은 R1 영역(체류자격)이라 잘못된 안내가 생활 기반에 닿는다. 그래서
 * 문서가 zh·vi 원어민 검수를 출시 차단 조건으로 정해 뒀는데, 그동안
 * **경고 없이 나가고 있었다** — 고지 문구는 네 사전에 이미 번역돼 있었고
 * 렌더하는 곳만 없었다.
 *
 * 목록을 코드에 두는 것이 요점이다: 검수가 끝나면 배열에서 빼는 것이
 * **실제 커밋으로 남는다.** 문서에만 적으면 누가 언제 끝냈는지 알 수 없다.
 */
const UNREVIEWED: readonly Locale[] = ['zh', 'vi'];

export function SiteShell({ pathname, nav, aside, width = 'prose', children }: SiteShellProps) {
  const { t, locale } = useI18n();

  return (
    <AppShell
      width={width}
      aside={aside}
      asideLabel={t('nav.sidebar')}
      skipLabel={t('a11y.skipToContent')}
      header={
        <PageHeader
          homeHref={routes.home(locale)}
          homeLabel={t('nav.brandHome')}
          navLabel={t('nav.main')}
          menuLabel={t('nav.openMenu')}
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
      {UNREVIEWED.includes(locale) ? (
        <Banner tone="info" className="mb-6">
          {t('locale.machineTranslated')}
        </Banner>
      ) : null}
      {children}
    </AppShell>
  );
}
