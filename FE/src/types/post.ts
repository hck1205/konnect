/** 작성 중인 글 — 서버에 보내기 전 형태 */
export interface PostDraft {
  title: string;
  body: string;
  tags: string[];
}
