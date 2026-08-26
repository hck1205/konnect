/**
 * 화면에 사람을 표시하는 데 필요한 최소 정보.
 *
 * 댓글 작성자·쪽지 상대·참가자가 전부 같은 모양인데 각자 타입을 갖고 있었다
 * (`CommentAuthor`, `MessageParticipant`, 그리고 인라인 객체 두 개).
 * 하나가 바뀌면 나머지를 찾아 고쳐야 했다.
 *
 * **민감정보를 담지 않는다** — 체류자격·학교·직장·실명은 여기 없다.
 * → docs/25-design/20-components/#profiles
 */
export interface UserSummary {
  id: string;
  nickname: string;
  avatarUrl?: string | null;
}
