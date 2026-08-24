import { SetMetadata } from '@nestjs/common';

/**
 * 인증 가드를 통과시키는 라우트 표시.
 * 핸들러 또는 컨트롤러에 @Public()을 붙이면 비회원 접근이 허용된다.
 * (전역 가드가 도입되기 전이라도 "공개 라우트"의 표기 지점을 미리 고정해 둔다)
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
