'use client';

import { BookOpen, MessageCircleQuestion, Users } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
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

  const nav = [
    { href: `/${locale}/questions`, label: t('nav.questions'), icon: <MessageCircleQuestion className="size-4" /> },
    { href: `/${locale}/guides`, label: t('nav.guides'), icon: <BookOpen className="size-4" /> },
    { href: `/${locale}/meetups`, label: t('nav.meetups'), icon: <Users className="size-4" /> },
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
