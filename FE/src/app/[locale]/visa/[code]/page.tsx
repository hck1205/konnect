import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SpinePage } from '@/views/SpinePage';
import { fetchSpineQuestions } from '@/query/questions';
import { LOCALES, t, toLocale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { localeAlternates } from '@/lib/seo';
import { BASIS_KEY, VISA_SPINES, findSource, findVisaSpine, spineTitle } from '@/data/visa-spine';

/**
 * 비자 척추 — `/[locale]/visa/[code]`.
 *
 * **질문이 0건이어도 성립하는 유일한 페이지 종류다.** 태그 허브는 질문 20건,
 * 공간 승격은 주간 신규 10건 × 4주, 회사 페이지는 사용자가 써야 채워지는데
 * 법령과 고시는 우리 사용자와 무관하게 이미 존재한다.
 * 그래서 [승격 기준을 적용하지 않는다](docs/20-product/10-features/11-official-sources.md).
 *
 * 색인한다. 지금 사이트에는 색인할 만한 것이 질문 3건뿐이고, 척추가 그 구멍을 메운다.
 */

interface RouteParams {
  locale: string;
  code: string;
}

/**
 * 정적 스냅샷이 아니라 ISR 이다.
 *
 * 없으면 관련 질문이 **빌드 시점에 얼어붙어** 재배포 전까지 갱신되지 않는다 —
 * "아직 질문이 없습니다" 가 HTML 에 구워진 채 배포된다. 출처 절은 어차피 정적이라
 * 질문 절만 신선해지면 된다.
 */
export const revalidate = 300;

/**
 * 제목. `codeLabel` 이 없으면 괄호를 붙이지 않는다 —
 * 귀화는 체류자격이 아니라 국적 취득이라 `귀화 (NATURALIZATION)` 은 틀린 모양이다.
 */
/**
 * 빌드 시점에 모든 판을 만든다.
 *
 * 값이 여섯으로 **닫혀 있어서** 가능하다 — 지역(200+)이나 국적(190+)이었다면
 * 얕은 페이지가 폭발한다. 축이 닫혀 있는지가 척추를 허용하는 기준이다.
 */
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    VISA_SPINES.map((spine) => ({ locale, code: spine.code })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { locale: rawLocale, code } = await params;
  const locale = toLocale(rawLocale);
  const spine = findVisaSpine(code);
  if (!spine) return { title: 'konnect' };

  return {
    title: spineTitle(spine, locale),
    // 근거 법령은 자격마다 다르다 — 귀화는 국적법이지 시행령이 아니다
    description: t(locale, BASIS_KEY[spine.basis]),
    alternates: localeAlternates(locale, (l) => routes.visa(l, code)),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { locale: rawLocale, code } = await params;
  const locale = toLocale(rawLocale);

  const spine = findVisaSpine(code);
  if (!spine) notFound();

  const sources = spine.sourceIds.map(findSource).filter((s) => s !== undefined);
  const questions = await fetchSpineQuestions(`visa:${code}`, { tags: [spine.tag] });

  return (
    <SpinePage
      title={spineTitle(spine, locale)}
      description={t(locale, BASIS_KEY[spine.basis])}
      sources={sources}
      questions={questions}
      pathname={routes.visa(locale, code)}
    />
  );
}
