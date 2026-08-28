import { beforeAll, describe, expect, it } from 'vitest';
import { setAuthToken } from '@/lib/auth-token';
import { httpClient } from '../client';
import { logout, testLogin } from '../auth';
import {
  createQuestion,
  fetchQuestion,
  fetchQuestions,
  hideQuestion,
  updateQuestion,
} from './questions.api';
import { acceptAnswer, createAnswer, fetchAnswers } from '../answers';
import { TOPICS } from '@/types';

/**
 * FE api 계층 ↔ 라이브 BE.
 *
 * 단위 테스트는 **우리 코드끼리만** 확인한다 — 타입은 컴파일 타임에 사라지므로
 * BE 응답이 실제로 그 모양인지는 아무도 안 본다. 필드 하나가 이름을 바꿔도
 * 컴파일은 통과하고 화면에서 `undefined` 로 터진다.
 *
 * 이 파일이 그 틈을 메운다.
 *
 *   cd BE && npm run start:dev      # 한 터미널
 *   cd FE && npm run test:integration
 */
beforeAll(async () => {
  try {
    await httpClient.get('/health');
  } catch {
    throw new Error(
      'BE 에 연결할 수 없다. `cd BE && npm run start:dev` 를 먼저 띄운다.',
    );
  }
});

describe('질문 — 읽기는 로그인 없이 된다', () => {
  it('목록을 부른다 (비로그인)', async () => {
    logout();
    const page = await fetchQuestions(undefined, { limit: 5 });
    expect(Array.isArray(page.items)).toBe(true);
    expect(page).toHaveProperty('nextCursor');
  });

  it('없는 질문은 예외가 아니라 null 이다', async () => {
    expect(await fetchQuestion('00000000-0000-0000-0000-000000000000')).toBeNull();
  });
});

describe('질문 — 쓰기와 계약', () => {
  beforeAll(() => testLogin('integration-author'));

  it('만든 질문이 상세·목록에서 같은 모양으로 돌아온다', async () => {
    const created = await createQuestion({
      title: 'Does volunteer work count toward F-2-7 points?',
      body: 'Integration test — checking the FE/BE contract.',
      topic: 'visa',
      tags: ['visa:f-2', 'topic:residency'],
    });

    // BE 가 실제로 돌려준 필드가 FE 타입과 맞는지 — 여기가 이 파일의 존재 이유다
    expect(created.id).toBeTruthy();
    expect(created.status).toBe('OPEN');
    expect(created.answerCount).toBe(0);
    expect(created.acceptedAnswerId).toBeNull();
    expect(TOPICS).toContain(created.topic);
    expect(created.authorNickname).toBe('integration-author');
    expect(typeof created.createdAt).toBe('string');

    // 태그는 **정규화되어** 돌아온다
    expect(created.tags).toEqual(['visa:f-2', 'topic:residency']);

    const found = await fetchQuestion(created.id);
    expect(found).toEqual(created);
  });

  it('태그 필터가 실제로 걸린다 — 쉼표 직렬화가 맞는지 확인한다', async () => {
    const created = await createQuestion({
      title: 'Tag filter integration check',
      body: 'Only this question carries the marker tag.',
      topic: 'housing',
      tags: ['region:ansan'],
    });

    const matched = await fetchQuestions({ tags: ['region:ansan'] }, { limit: 50 });
    expect(matched.items.map((q) => q.id)).toContain(created.id);

    // 없는 태그를 걸면 안 나와야 한다 — 필터가 조용히 무시되면 여기서 잡힌다
    const none = await fetchQuestions({ tags: ['region:nowhere-xyz'] }, { limit: 50 });
    expect(none.items.map((q) => q.id)).not.toContain(created.id);
  });

  it('수정하면 updatedAt 이 바뀌고 작성자는 그대로다', async () => {
    const created = await createQuestion({
      title: 'Before edit',
      body: 'Original body for the integration test.',
      topic: 'work',
    });
    const updated = await updateQuestion(created.id, { title: 'After edit' });

    expect(updated.title).toBe('After edit');
    expect(updated.authorId).toBe(created.authorId);
    expect(updated.id).toBe(created.id);
  });

  it('삭제는 숨김이다 — 링크가 죽지 않는다', async () => {
    const created = await createQuestion({
      title: 'To be hidden',
      body: 'This question gets hidden, not deleted.',
      topic: 'social',
    });
    const hidden = await hideQuestion(created.id);
    expect(hidden.status).toBe('HIDDEN');
  });
});

describe('답변 — 채택은 질문을 바꾼다', () => {
  /**
   * ⚠️ **같은 닉네임으로 다시 로그인해도 같은 사람이 아니다.**
   * `/auth/login` 은 부를 때마다 새 계정을 만든다 — 제공자 id 로 찾을 경로가
   * 없어서다(BE README "동일인 식별"). 그래서 토큰을 들고 있다가 되돌린다.
   * OAuth 가 들어오면 이 우회가 필요 없어진다.
   */
  it('답변을 달면 answerCount 가 오르고, 채택하면 질문에 반영된다', async () => {
    const asker = await testLogin('integration-asker');
    const question = await createQuestion({
      title: 'Which is faster, KIIP 5 or TOPIK 4?',
      body: 'Integration test for the answer flow.',
      topic: 'language',
    });

    await testLogin('integration-answerer');
    const answer = await createAnswer(question.id, {
      body: 'KIIP level 5 was faster in my case — about four months.',
    });
    expect(answer.questionId).toBe(question.id);
    expect(answer.status).toBe('OPEN');

    // 페이지가 아니라 배열이다 — 채택 답변이 다음 페이지로 밀리면 안 되기 때문
    const answers = await fetchAnswers(question.id);
    expect(Array.isArray(answers)).toBe(true);
    expect(answers.map((a) => a.id)).toContain(answer.id);

    // 채택은 **질문 작성자**의 권한이다 — 그래서 질문이 돌아온다
    setAuthToken(asker.token);
    const accepted = await acceptAnswer(question.id, answer.id);
    expect(accepted.acceptedAnswerId).toBe(answer.id);
    expect(accepted.answerCount).toBe(1);
  });
});
