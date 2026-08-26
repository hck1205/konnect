import type { DirectMessage } from './MessageThread.types';

export interface MessageGroup {
  /** 이 묶음의 날짜(로케일 무관 ISO 날짜) — 날짜 구분선에 쓴다 */
  date: string;
  senderId: string;
  messages: DirectMessage[];
}

/**
 * 연속된 같은 사람의 메시지를 묶는다.
 *
 * 매 메시지마다 아바타와 이름을 반복하면 대화가 읽히지 않는다.
 * 날짜가 바뀌면 무조건 새 묶음이다(날짜 구분선을 넣어야 한다).
 *
 * 시간 간격은 보지 않는다 — "5분 이상 지나면 분리" 같은 규칙은 임의적이고,
 * 대화가 며칠에 걸쳐 띄엄띄엄 이어지는 이 서비스에서는 도움이 안 된다.
 */
export function groupMessages(messages: readonly DirectMessage[]): MessageGroup[] {
  const groups: MessageGroup[] = [];

  for (const message of messages) {
    const date = message.createdAt.slice(0, 10);
    const last = groups[groups.length - 1];

    if (last && last.senderId === message.senderId && last.date === date) {
      last.messages.push(message);
    } else {
      groups.push({ date, senderId: message.senderId, messages: [message] });
    }
  }

  return groups;
}

/**
 * 개인정보로 보이는 문자열이 있는지.
 *
 * 쪽지에서 여권번호·외국인등록번호를 주고받는 것은 **사기의 전형적 경로**다.
 * 막지는 않고(오탐이 있을 수 있다) 보내기 전에 경고한다.
 * → docs/10-domain/60-social-community/02-safety-and-trust.md
 *
 * 판정은 보수적으로 — 오탐이 잦으면 사용자가 경고를 무시하게 된다.
 */
export function looksLikeSensitiveId(text: string): boolean {
  const compact = text.replace(/[\s-]/g, '');

  // 외국인등록번호/주민등록번호 형태: 13자리 숫자
  if (/\d{13}/.test(compact)) return true;

  // 여권번호 형태: 영문 1~2자 + 숫자 7~8자 (전체가 그 형태일 때만)
  if (/(^|[^A-Za-z0-9])[A-Z]{1,2}\d{7,8}([^A-Za-z0-9]|$)/.test(text.toUpperCase())) {
    return true;
  }

  return false;
}
