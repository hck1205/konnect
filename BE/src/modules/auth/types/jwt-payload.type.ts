/**
 * JWT 페이로드.
 *
 * `sub` 는 내부 사용자 id. 닉네임을 넣는 이유는 매 요청마다 사용자 조회를 하지
 * 않기 위해서다 — 다만 닉네임이 바뀌어도 토큰이 만료될 때까지 옛 값이 남는다.
 * 표시용으로만 쓰고, **권한 판정에는 `sub` 만** 쓴다.
 */
export interface JwtPayload {
  sub: string;
  nickname: string;
}

/** 요청에 실리는 인증 사용자 */
export interface RequestUser {
  id: string;
  nickname: string;
}
