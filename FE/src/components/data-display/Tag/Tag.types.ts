/**
 * 태그 어휘는 이 컴포넌트의 것이 아니다 — **BE 와 대조되는 도메인 어휘**라
 * `@/types/tag` 가 소유한다. 여기서는 편의를 위해 재수출만 한다.
 *
 * 옮긴 이유: 컴포넌트가 어휘를 소유하면 `lib/text` 의 계약 테스트가 `components/` 를
 * import 하는 역방향 간선이 생긴다. 화면을 옮기면 BE 와의 계약 검사가 함께 깨진다.
 */
export {
  TAG_NAMESPACES,
  type ParsedTag,
  type TagNamespace,
} from '@/types/tag';
