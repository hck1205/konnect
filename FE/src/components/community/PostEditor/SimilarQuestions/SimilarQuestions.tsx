import { useI18n } from '@/lib/i18n';
import { Banner } from '@/components/feedback/Banner';

export interface SimilarQuestion {
  id: string;
  title: string;
  href: string;
}

export interface SimilarQuestionsProps {
  items: readonly SimilarQuestion[];
}

/**
 * 작성 중 나타나는 비슷한 질문.
 *
 * **중복을 막는 가장 효과적인 지점이 여기다** — 이미 올린 뒤에 "중복입니다"라고
 * 하면 늦고, 태그를 강제하는 것보다 마찰이 적다. 동시에 "이미 답이 있다"는
 * 즉각적 가치를 준다.
 * → docs/20-product/10-features/10-post-editor.md
 *
 * 없으면 아무것도 렌더하지 않는다 — 빈 영역이 자리를 차지하면 입력이 밀린다.
 */
export function SimilarQuestions({ items }: SimilarQuestionsProps) {
  const { t } = useI18n();
  if (items.length === 0) return null;

  return (
    <Banner tone="info" title={t('common.more')}>
      <ul className="mt-1 flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <a href={item.href} className="underline underline-offset-2">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </Banner>
  );
}
