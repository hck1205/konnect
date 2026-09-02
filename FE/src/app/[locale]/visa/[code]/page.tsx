import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SpinePage } from '@/views/SpinePage';
import { fetchQuestions } from '@/query/questions';
import { DEFAULT_LOCALE, LOCALES, isLocale, t, type Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { localeAlternates } from '@/lib/seo';
import { VISA_SPINES, findSource, findVisaSpine } from '@/data/visa-spine';
import type { QuestionFilter } from '@/types';

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
const spineTitle = (spine: { officialName: { ko: string; en: string }; codeLabel: string | null }, locale: Locale) => {
  const name = locale === 'ko' ? spine.officialName.ko : spine.officialName.en;
  return spine.codeLabel ? `${name} (${spine.codeLabel})` : name;
};

/** 명칭의 근거 법령 → 사전 키. 자격과 귀화가 다르다 */
const BASIS_KEY = {
  'enforcement-decree': 'spine.basisDecree',
  'nationality-act': 'spine.basisNationalityAct',
} as const;

/**
 * 관련 질문은 **치명적이지 않다.**
 *
 * ⚠️ 이걸 감싸지 않아 CI 의 `next build` 가 통째로 죽었다 — `generateStaticParams` 가
 * 48판을 빌드 시점에 프리렌더하는데 러너에는 BE 가 없어 ECONNREFUSED 가 났다.
 * 로컬에서는 BE 가 떠 있어 화면이 200 으로 보였다. **화면이 떠도 빌드는 죽을 수 있다.**
 *
 * 척추의 본체는 공식 출처다. 질문은 살이라 못 가져와도 페이지는 성립해야 한다.
 * 다만 **조용히 삼키지 않는다** — 서버 로그에 남겨야 "질문이 원래 없는 것" 과
 * "가져오기가 실패한 것" 을 구분할 수 있다.
 */
async function loadQuestions(label: string, filter: QuestionFilter) {
  try {
    return (await fetchQuestions(filter, { limit: 10 })).items;
  } catch (error) {
    console.error('[spine] fetchQuestions failed', { label, error });
    return [];
  }
}

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
  const questions = await loadQuestions(`visa:${code}`, { tags: [spine.tag] });

  return (
    <SpinePage
      title={spineTitle(spine, locale)}
      description={t(locale, BASIS_KEY[spine.basis])}
      sources={sources}
      questions={questions}
      askTags={[spine.tag]}
      pathname={routes.visa(locale, code)}
    />
  );
}
