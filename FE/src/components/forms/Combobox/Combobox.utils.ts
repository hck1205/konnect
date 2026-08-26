export interface ComboboxOption {
  value: string;
  label: string;
  /** 검색에만 쓰이는 추가 키워드(한국어 표기 등) */
  keywords?: readonly string[];
}

/**
 * 후보 필터링 — 순수 함수.
 *
 * konnect 특유의 요구: 학교·관청 이름은 **영문과 한국어 양쪽**으로 검색된다.
 * "Seoul National" 로도, "서울대" 로도 찾아져야 한다. 그래서 label 뿐 아니라
 * keywords 도 함께 본다.
 *
 * 대소문자·앞뒤 공백은 무시하고, 부분 일치를 허용한다(퍼지 매칭은 하지 않는다 —
 * 오탐이 많아지면 오히려 고르기 어렵다).
 */
export function filterOptions(
  options: readonly ComboboxOption[],
  query: string,
  limit = 50,
): ComboboxOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return options.slice(0, limit);

  const matches = options.filter((o) => {
    if (o.label.toLowerCase().includes(q)) return true;
    return (o.keywords ?? []).some((k) => k.toLowerCase().includes(q));
  });

  // 앞에서부터 일치하는 것을 위로 — "Seoul" 검색에 "Seoul National" 이
  // "Hankuk Seoul" 보다 먼저 나와야 한다
  return matches
    .sort((a, b) => {
      const aStarts = a.label.toLowerCase().startsWith(q) ? 0 : 1;
      const bStarts = b.label.toLowerCase().startsWith(q) ? 0 : 1;
      return aStarts - bStarts;
    })
    .slice(0, limit);
}

/** value → label. 없으면 value 를 그대로 (삭제된 항목이 저장돼 있을 수 있다) */
export function labelFor(
  options: readonly ComboboxOption[],
  value: string,
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}
