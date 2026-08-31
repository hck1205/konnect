import type { Locale } from './locales';
import { MESSAGES, en, type MessageKey } from './messages';
import { translate, type TranslateParams } from './translate';

/**
 * 서버용 번역 조회 — 훅이 아니라 순수 함수다.
 *
 * `useI18n` 은 클라이언트 컴포넌트에서만 쓸 수 있는데 `generateMetadata` 는
 * 서버에서 돈다. 그래서 페이지들이 `@/lib/i18n/messages` 를 **깊이 import** 해
 * 배럴을 우회하기 시작했다 — 공개 API 의 모양이 위반을 강제하고 있었다.
 *
 * 라우트가 늘면 새 `generateMetadata` 마다 같은 우회로가 복사된다.
 * 문을 먼저 내면 다음 라우트는 처음부터 옳은 쪽으로 들어온다.
 *
 * `'use client'` 를 붙이지 않는다 — 사전과 `translate` 는 순수 데이터·함수라
 * 서버에서 그대로 돈다. i18n 폴더에서 클라이언트 모듈은 `LocaleProvider` 하나뿐이다.
 */
export const t = (
  locale: Locale,
  key: MessageKey,
  params?: TranslateParams,
): string => translate(MESSAGES[locale] ?? en, en, key, locale, params);
