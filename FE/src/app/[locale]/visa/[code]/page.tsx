import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SpinePage } from '@/views/SpinePage';
import { fetchQuestions } from '@/query/questions';
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { localeAlternates } from '@/lib/seo';
import { VISA_SPINES, findSource, findVisaSpine } from '@/data/visa-spine';

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

const toLocale = (raw: string): Locale => (isLocale(raw) ? raw : DEFAULT_LOCALE);

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

  const name = locale === 'ko' ? spine.officialName.ko : spine.officialName.en;
  const label = `${name} (${code.toUpperCase()})`;

  return {
    title: label,
    // 무엇을 담고 있는지를 그대로 적는다. 요건을 요약하면 그게 해석이다.
    description: `${label} — official sources and questions from people going through it.`,
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

  // 관련 질문. 목록이 비어도 화면은 뜬다 — 척추의 본체는 출처이고 질문은 살이다.
  const page = await fetchQuestions({ tags: [spine.tag] }, { limit: 10 });

  const name = locale === 'ko' ? spine.officialName.ko : spine.officialName.en;

  return (
    <SpinePage
      title={`${name} (${code.toUpperCase()})`}
      // 부제는 법령이 정한 공식 명칭이라는 사실만 말한다
      description={
        locale === 'ko'
          ? '출입국관리법 시행령 별표1의2 의 명칭입니다.'
          : 'Official designation in the Enforcement Decree of the Immigration Act.'
      }
      sources={sources}
      questions={page.items}
      askTags={[spine.tag]}
      pathname={routes.visa(locale, code)}
    />
  );
}
