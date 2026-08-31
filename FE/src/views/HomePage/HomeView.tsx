'use client';

import { MessageCircleQuestion } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { AppShell } from '@/components/layout/AppShell';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageTitle } from '@/components/layout/PageTitle';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/primitives/Button';
import { LocaleSwitcher } from '@/components/i18n/LocaleSwitcher';

/**
 * 홈 페이지 — 프레젠테이셔널 레이어.
 *
 * 색은 semantic 토큰만 쓴다. 문구는 사전에서 가져온다(하드코딩 금지) —
 * docs/25-design/02-tokens.md · docs/30-architecture/06-i18n-strategy.md
 */
export function HomeView({ pathname }: { pathname: string }) {
  const { t, locale } = useI18n();

  /**
   * **있는 것만 링크한다.**
   *
   * 예전에는 guides·meetups 도 걸려 있었는데 라우트가 없어 셋 다 404 였다.
   * 가이드는 "반복 질문이 승격된 문서"라 질문이 쌓여야 성립하고(Phase 2),
   * meetups 는 색인 라우트 표에 아직 없다
   * → docs/30-architecture/07-routes-and-indexing.md
   *
   * 사전의 `nav.guides`·`nav.meetups` 는 지운 게 아니라 남겨 뒀다 —
   * 그 화면이 생기면 여기 한 줄만 되돌리면 된다.
   */
  const nav = [
    {
      href: routes.questions(locale),
      label: t('nav.questions'),
      icon: <MessageCircleQuestion className="size-4" />,
    },
  ];

  return (
    <AppShell
      width="prose"
      header={
        <PageHeader
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
      <PageTitle
        title="konnect"
        description="A community for foreigners living, studying, working, and travelling in Korea."
      />
      <p className="mt-4 text-sm text-fg-subtle">
        {/* 한국어 원문 병기 — 브라우저 번역기가 건드리면 안 된다(사용자가 실제
            서류에서 이 글자를 찾아야 한다). lang 은 스크린리더 발음을 위해 함께 둔다.
            → docs/25-design/10-foundations/08-native-platform.md */}
        Alien Registration Card (
        <span lang="ko" translate="no">
          외국인등록증
        </span>
        ), visas, housing, language — ask the people who have been through it.
      </p>
    </AppShell>
  );
}
