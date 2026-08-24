# 저장소 구조

```
konnect/
├─ .gitignore        루트는 화이트리스트 방식 — docs/·FE/·BE/·README만 추적
├─ README.md
├─ docs/             이 문서 모음
├─ BE/               NestJS + Prisma
└─ FE/               Next.js App Router
```

## 루트 .gitignore 규약

루트의 모든 항목을 먼저 무시하고(`/*`), 추적할 것만 화이트리스트로 되살린다.
로컬 도구·작업본이 실수로 커밋되는 것을 구조적으로 막기 위한 것이다.

새 최상위 폴더를 추적하려면 `.gitignore`에 `!폴더명/`을 **명시적으로 추가**해야 한다.

## BE 구조 요약

```
BE/src/
  config/     환경변수 로더 + APP_CONFIG DI 토큰
  common/     filters / interceptors / decorators / id
  prisma/     PrismaService(전역) + DB_DRIVER 저장소 스위치
  modules/    도메인 모듈 — 여기가 10-domain 과 대응된다
  utils/      순수 함수
```

도메인 모듈 파일 구성은 [BE/README.md](../../BE/README.md#도메인-모듈-관례) 참고.

## FE 구조 요약

```
FE/src/
  app/         라우팅 셸만
  views/       화면
  components/  UI (business/view 분리)
  atoms/       jotai 전역 상태
  query/       axios + react-query, 관심사별
  lib/         앱 인프라
  utils/       순수 함수
  types/       공유 도메인 모델
```

컴포넌트/atoms/query 컨벤션은 [FE/ARCHITECTURE.md](../../FE/ARCHITECTURE.md) 참고.

## 도메인 → 모듈 대응

[10-domain](../10-domain/)의 영역은 **BE 모듈과 1:1로 대응되지 않는다.**
도메인은 *사용자가 겪는 문제*의 분류이고, 모듈은 *데이터와 동작*의 분류다.

| 도메인 영역 | 대응 | 비고 |
| --- | --- | --- |
| 비자/어학/학교/주거/취업/교류 | `Topic` **값** | 모듈이 아니라 데이터다 |
| — | `modules/questions` | Q&A |
| — | `modules/tags` | 태그 |
| — | `modules/users`, `modules/auth` | |
| — | `modules/reports` | 신고 |
| 교류 | `modules/meetups` | 이건 실제로 별도 모듈 (M4) |
