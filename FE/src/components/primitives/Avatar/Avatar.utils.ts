/**
 * 이름 → 이니셜.
 *
 * konnect 사용자의 닉네임은 라틴·한글·그 밖의 문자가 섞인다. 규칙:
 * - 공백으로 나뉘면 앞 두 토큰의 **첫 글자**를 딴다 ("Maria Santos" → "MS")
 * - 한 덩어리면 앞 한 글자만 딴다 ("아마르" → "아", "chen" → "C")
 *   한글은 한 글자가 이미 음절이라 두 글자를 따면 이름 일부가 그대로 노출된다.
 * - 서로게이트 페어(이모지 등)를 반으로 자르지 않도록 코드포인트 단위로 다룬다.
 */
export function toInitials(name: string): string {
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return '?';

  const firstOf = (token: string) => [...token][0] ?? '';

  if (tokens.length === 1) {
    const ch = firstOf(tokens[0]);
    // 라틴 문자는 대문자로 올린다. 한글·한자 등은 대소문자가 없어 그대로 둔다.
    return ch.toUpperCase();
  }

  return (firstOf(tokens[0]) + firstOf(tokens[1])).toUpperCase();
}

/**
 * 이름 → 안정적인 배경색 인덱스.
 *
 * 같은 사람은 항상 같은 색이어야 한다(목록에서 사람을 색으로 구분하게 된다).
 * 암호학적 강도가 필요 없으므로 단순 문자열 해시로 충분하다.
 */
export function toColorIndex(name: string, buckets: number): number {
  let hash = 0;
  for (const ch of name) {
    hash = (hash * 31 + ch.codePointAt(0)!) >>> 0;
  }
  return hash % buckets;
}
