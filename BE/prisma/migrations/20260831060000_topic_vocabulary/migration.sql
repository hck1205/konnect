-- 주제(topic) 어휘를 재편한다.
--
-- 왜: 두 가지 모순을 동시에 끝낸다.
--
--   1. VISA 가 카테고리로 들어가 있었다. 그런데 09-content-pillars 는 "비자는 카테고리가
--      아니라 축이다" 라고 결론냈다 — 집·일·행정 모두에 체류자격이 걸린다. 카테고리로 두면
--      나머지가 "비자 아닌 것" 이 되고, `visa:` 태그 네임스페이스와 이중 등록이 된다.
--   2. EDUCATION 이 있었다. ADR-0007 이 재학 중인 유학생을 비타깃으로 내렸는데
--      코드에는 남아 있었다. 졸업 후 잔류는 RESIDENCY·WORK 로 간다.
--
-- 그리고 비치헤드(영주·귀화 준비자)의 집인 RESIDENCY 와, 국적별로 답이 갈리는 것이
-- 모이는 ADMIN 이 아예 없었다.
--
-- → docs/50-decisions/0012-topic-vocabulary.md
--
-- ⚠️ 값 매핑을 명시한다. USING 절이 없으면 기존 행이 전부 실패한다.
--    VISA → RESIDENCY 인 이유: 지금 VISA 로 분류된 글은 F-2-7 점수 같은 체류자격 질문이다.
--    EDUCATION → RESIDENCY 인 이유: 유학 글이 남아 있다면 그건 졸업 후 잔류 맥락이다.

CREATE TYPE "Topic_new" AS ENUM ('RESIDENCY', 'WORK', 'HOUSING', 'ADMIN', 'LANGUAGE', 'SOCIAL');

ALTER TABLE "questions"
  ALTER COLUMN "topic" TYPE "Topic_new"
  USING (
    CASE "topic"::text
      WHEN 'VISA'      THEN 'RESIDENCY'
      WHEN 'EDUCATION' THEN 'RESIDENCY'
      ELSE "topic"::text
    END
  )::"Topic_new";

DROP TYPE "Topic";
ALTER TYPE "Topic_new" RENAME TO "Topic";
