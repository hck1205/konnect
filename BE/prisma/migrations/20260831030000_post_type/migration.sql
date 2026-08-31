-- 글의 종류(type) 를 추가한다.
--
-- topic 이 "무엇에 대한 글인가"라면 type 은 "글쓴이가 무엇을 하려는가"다.
-- 게시판은 둘의 곱이다 → docs/00-overview/07-current-state.md
--
-- 기본값 QUESTION 이 필수인 이유: 이 컬럼이 생기기 전의 글은 전부 질문이었고,
-- 기본값이 없으면 기존 행에 채울 값이 없어 ALTER 가 막힌다.

CREATE TYPE "PostType" AS ENUM ('QUESTION', 'REVIEW', 'SHARE', 'RECRUIT');

ALTER TABLE "questions" ADD COLUMN "type" "PostType" NOT NULL DEFAULT 'QUESTION';

-- 게시판 목록: 필터(topic·type·status) 먼저, 정렬(id) 나중이어야 인덱스를 탄다.
CREATE INDEX "questions_topic_type_status_id_idx"
  ON "questions" ("topic", "type", "status", "id" DESC);
