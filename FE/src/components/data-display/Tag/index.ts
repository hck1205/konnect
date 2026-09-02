export { Tag } from './Tag';
export { formatTagLabel, NAMESPACE_LABEL } from './Tag.utils';
// 어휘·규칙은 여기 소유가 아니다. 옛 import 경로가 깨지지 않게 재수출만 한다.
export { normalizeTag, parseTag } from '@/lib/text';
export { TAG_NAMESPACES } from '@/types/tag';
export type { TagProps } from './Tag';
export type { ParsedTag, TagNamespace } from '@/types/tag';
