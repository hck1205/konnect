# 데이터 모델 (초안)

> **초안이다.** MVP 범위([04-mvp-scope](../20-product/04-mvp-scope.md))에 맞춘 최소 형태이며,
> 실제 `schema.prisma`는 구현 시점에 이 문서를 근거로 작성한다.

## 엔티티

```
User
  id, nickname, avatarUrl, bio?, languages[]
  role            USER | ADMIN
  createdAt
  ── 민감정보(체류자격·학교·직장)는 기본적으로 담지 않는다

AuthIdentity                     소셜 계정 연결 (한 User에 N개)
  id, userId, provider, providerId
  UNIQUE(provider, providerId)

Question
  id, authorId, title, body
  topic                          Topic enum
  acceptedAnswerId?
  status                         OPEN | HIDDEN
  createdAt, updatedAt

Answer
  id, questionId, authorId, body
  createdAt, updatedAt

Comment                          질문/답변에 붙는 부연
  id, authorId, body
  targetType                     QUESTION | ANSWER
  targetId
  createdAt

Tag
  id, namespace?, value, label
  kind                           CONTROLLED | FREE
  UNIQUE(namespace, value)

TagAlias                         'D2' → visa:d-2 흡수
  id, tagId, alias

QuestionTag                      N:M
  questionId, tagId

Report
  id, reporterId, targetType, targetId
  reason, detail?
  track                          URGENT | NORMAL
  status                         PENDING | RESOLVED | REJECTED
  createdAt, resolvedAt?
```

## M2 이후

```
Guide
  id, title, body, topic
  sources[]                      공식 출처 URL — R1은 필수
  lastVerifiedAt                 최신성
GuideRevision
  id, guideId, editorId, diff, createdAt
TagSubscription                  알림의 공급원
  userId, tagId
Notification
  id, userId, type, targetType, targetId, readAt?
```

## 설계 노트

- **id는 UUIDv7** ([API 규약](./03-api-conventions.md))
- `Topic`은 enum으로 고정한다 — [도메인 6영역](../10-domain/)과 대응
- `Tag.kind`로 고정 어휘와 자유 태그를 구분한다. 필터는 CONTROLLED만 쓴다
- **시각은 timestamptz.** 사용자가 여러 시간대에 흩어져 있다 — 이 서비스에서는 실질적 요구사항이다
- `Comment.targetType/targetId` 다형 참조는 물리 FK를 걸 수 없다.
  대안(질문댓글/답변댓글 테이블 분리)과 비교 필요 → 열린 질문

## 열린 질문

- 다형 참조(Comment, Report)를 유지할 것인가, 테이블을 나눌 것인가?
- 조회수/투표수 같은 카운터를 **비정규화 컬럼**으로 둘 것인가?
- 소프트 삭제를 어떻게 표현할 것인가? (`status: HIDDEN` 으로 충분한가)
