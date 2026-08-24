# API 규약

## 응답 봉투

성공 응답은 전역 인터셉터가 감싼다:

```json
{ "data": <payload>, "timestamp": "2026-08-24T14:00:00.000Z" }
```

에러는 전역 필터가 정규화한다:

```json
{
  "statusCode": 404,
  "path": "/questions/abc",
  "timestamp": "2026-08-24T14:00:00.000Z",
  "message": "Question not found"
}
```

FE는 `query/client.ts`의 `unwrap()`으로 봉투를 벗기고, "없음"이 정상인 조회는 `orNull()`을 쓴다.

## 식별자

**UUIDv7**을 쓴다 (`BE/src/common/id.ts`). 이유:

- 시간 정렬이라 B-tree 삽입이 append-only에 가까워 인덱스 성능이 낫다
- **커서 = id 하나로 시간순 키셋 페이지네이션**이 성립한다

## 페이지네이션

**키셋(커서) 방식**을 기본으로 한다. offset은 쓰지 않는다.

```
GET /questions?limit=20&cursor=<lastId>
→ { data: { items: [...], nextCursor: "..." | null }, timestamp }
```

이유: 목록이 시간순이고 계속 새 글이 들어오므로, offset은 중복/누락이 생긴다.

## 접근 정책

**Read는 공개, Write는 인증.** 검색 유입자가 로그인 벽에 막히면 안 된다
([J1](../20-product/03-user-journeys.md)).

| 동작 | 권한 |
| --- | --- |
| 목록/상세 조회 | 비회원 공개 |
| 작성 | 인증 |
| 수정/삭제 | 인증 + **작성자 본인** |
| 채택 | 인증 + **질문 작성자** |
| 모더레이션 | 관리자 |

정책은 **서버가 강제**한다. FE의 버튼 숨김은 UX일 뿐 보안이 아니다.

## 검증

DTO + `class-validator`, 전역 `ValidationPipe`(`whitelist: true, transform: true`).
DTO에 없는 필드는 조용히 제거된다.

## 열린 질문

- API 버저닝(`/v1`)을 처음부터 붙일 것인가?
- 목록 응답에 총 개수를 포함할 것인가? (키셋과 상성이 나쁘다)
