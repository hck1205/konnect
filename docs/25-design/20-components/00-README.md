# 25.20 · 컴포넌트

> **미착수.** Foundation(토큰)만 완료된 상태다.

컴포넌트를 만들기 시작하면 여기에 하나씩 문서를 추가한다.
파일 구성 규약은 [FE/ARCHITECTURE.md](../../../FE/ARCHITECTURE.md#컴포넌트-규약-핵심)를 따른다.

## 만들 순서 (초안)

[MVP 범위](../../20-product/04-mvp-scope.md)에 필요한 것부터.

| 순서 | 컴포넌트 | 쓰이는 곳 |
| --- | --- | --- |
| 1 | Button | 전역 |
| 2 | Input / Textarea / Field | 질문 작성, 검색 |
| 3 | Tag / TagInput | 태그 (P0) |
| 4 | Card | 목록 |
| 5 | Avatar | 프로필 |
| 6 | Banner (R1 고지·최신성) | 상세 페이지 — [리스크 정책](../../10-domain/10-visa-immigration/03-content-and-risk-policy.md) |
| 7 | Menu / Dropdown | 헤더 |
| 8 | Modal | 신고, 확인 |
| 9 | EmptyState | 목록 |
| 10 | Skeleton | 로딩 |

## 각 컴포넌트 문서에 담을 것

- 어떤 semantic 토큰을 쓰는가 (primitive 직접 사용 금지)
- 변형(variant)과 크기
- 상태: default / hover / active / focus / disabled / loading
- **접근성 요구** — 키보드 조작, ARIA, 포커스 관리
- 쓰지 말아야 할 상황
