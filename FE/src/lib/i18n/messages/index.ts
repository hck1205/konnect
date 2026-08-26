import type { Locale } from '../locales';
import type { Messages } from '../translate';
import { en } from './en';
import { ko } from './ko';
import { vi } from './vi';
import { zh } from './zh';

/**
 * 로케일 → 사전.
 *
 * 지금은 전부 번들에 포함된다. 사전이 커지면 동적 import 로 분리한다
 * (그 시점은 "번들에서 사전이 눈에 띄게 보일 때"이지 지금이 아니다).
 */
export const MESSAGES: Record<Locale, Messages> = { en, ko, zh, vi };

/** 번역 키 타입 — 기준 사전이 진실이다. 오타가 컴파일 타임에 잡힌다. */
export type MessageKey = keyof typeof en;

export { en, ko, zh, vi };
