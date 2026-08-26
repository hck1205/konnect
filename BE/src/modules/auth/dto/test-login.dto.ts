import { IsString, Length, Matches } from 'class-validator';

/**
 * ⚠️ **테스트 전용 로그인** 입력.
 *
 * 실제 인증은 소셜 OAuth 로 대체된다(→ docs/30-architecture/05-authentication.md).
 * 이건 그때까지 Q&A·댓글 등 인증이 필요한 기능을 개발·검증하기 위한 임시 통로다.
 * **운영(NODE_ENV=production)에서는 라우트 자체가 존재하지 않는다.**
 */
export class TestLoginDto {
  @IsString()
  @Length(2, 24)
  // 태그·slug 와 같은 문자 정책 — 표시 이름에 제어문자나 공백만 들어오지 않게 한다
  @Matches(/^[\p{L}\p{N} _-]+$/u, {
    message:
      'nickname must contain letters, numbers, spaces, hyphens or underscores',
  })
  nickname!: string;
}
