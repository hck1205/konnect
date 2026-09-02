'use client';

import Link from 'next/link';
import { MessageCircleQuestion } from 'lucide-react';
import { splitAtSlot, useI18n } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { TOPICS } from '@/types';
import { VISA_SPINES, spineName, spineTitle } from '@/data/visa-spine';
import { SiteShell } from '@/components/layout/SiteShell';
import { PageTitle } from '@/components/layout/PageTitle';

/**
 * 홈 페이지 — 프레젠테이셔널 레이어.
 *
 * 색은 semantic 토큰만 쓴다. 문구는 사전에서 가져온다(하드코딩 금지) —
 * docs/25-design/02-tokens.md · docs/30-architecture/06-i18n-strategy.md
 */
/**
 * 한국어 원문. **번역하지 않는다** — 사용자가 실제 서류에서 이 글자를 눈으로 찾는다.
 * 사전이 아니라 여기 있는 이유: 이건 번역 대상이 아니라 **인용**이다.
 */
const ARC_KO = '외국인등록증';

export function HomeView({ pathname }: { pathname: string }) {
  const { t, locale } = useI18n();
  const intro = splitAtSlot(t('home.intro'), 'arc');

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
    <SiteShell pathname={pathname} nav={nav}>
      {/* 제품 이름은 번역하지 않는다 — 고유명사다 */}
      <PageTitle title="konnect" description={t('home.tagline')} />
      <p className="mt-4 text-sm text-fg-subtle">
        {/* 문구는 사전이, 태그는 여기가 갖는다. 사전에 마크업을 넣으면 번역자가
            태그를 손대게 되고 사전이 XSS 표면이 된다.
            `translate="no"` 는 브라우저 번역기를 막는다 — 이 글자가 바뀌면
            사용자가 서류에서 찾을 수 없다.
            → docs/25-design/10-foundations/08-native-platform.md */}
        {intro.before}
        {intro.after !== null ? (
          <>
            <span lang="ko" translate="no">
              {ARC_KO}
            </span>
            {intro.after}
          </>
        ) : null}
      </p>

      {/*
        홈에서 나가는 링크가 하나도 없었다. 커서 페이지네이션이라 목록을 크롤 경로로
        쓸 수 없고(sitemap 이 유일한 열거 수단인데 그것도 아직 없다), 그러면 상세
        페이지에 도달할 경로가 사실상 없다 — 검색이 유일한 유입 채널인 서비스에서
        그건 구조적으로 보이지 않는다는 뜻이다.
        → docs/30-architecture/07-routes-and-indexing.md
      */}
      {/* 랜드마크 이름을 제목에서 가져온다(`aria-labelledby`). `aria-label` 로 같은
          문구를 또 쓰면 번역이 갈라질 때 눈에 보이는 제목과 스크린리더가 읽는 이름이
          달라지고, 그 어긋남은 화면을 봐서는 드러나지 않는다. */}
      <nav aria-labelledby="home-topics" className="mt-8">
        {/* 홈은 필터가 아니라 허브다 — 목록 화면의 `list.filterTopic` 을 빌려 쓰면
            한쪽 문구를 고칠 때 다른 쪽이 조용히 따라 바뀐다 */}
        <h2 id="home-topics" className="text-sm font-semibold">
          {t('home.topicHeading')}
        </h2>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TOPICS.map((topic) => (
            <li key={topic}>
              <Link
                href={routes.topic(locale, topic)}
                className="block rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-surface-sunk"
              >
                {t(`topic.${topic}`)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav aria-labelledby="home-visa" className="mt-6">
        {/* 비자 목록이지 출처 목록이 아니다 — `spine.officialSources`("공식 출처")를
            빌려 쓰고 있었다. 네 판 전부에서 제목이 내용과 어긋났다. */}
        <h2 id="home-visa" className="text-sm font-semibold">
          {t('home.visaHeading')}
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {VISA_SPINES.map((spine) => (
            <li key={spine.code}>
              <Link
                href={routes.visa(locale, spine.code)}
                // 보이는 글자는 코드뿐이라(F-5) 스크린리더로 훑으면 링크 목록이
                // "에프 오 다시 파이브" 의 나열이 된다. 접근 이름에 법령상 명칭을 준다.
                aria-label={spineTitle(spine, locale)}
                className="inline-block rounded-full border border-border px-3 py-1 text-xs text-fg-subtle transition-colors hover:bg-surface-sunk"
              >
                {/* 귀화는 체류자격이 아니라 `codeLabel` 이 없다 — 코드를 대문자로
                    올리면 `NATURALIZATION` 이라는 칩이 나온다 */}
                {spine.codeLabel ?? spineName(spine, locale)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </SiteShell>
  );
}
