import type { Messages } from '../translate';

/**
 * 기준 사전. **모든 키는 여기 먼저 추가한다** — 다른 언어는 이 파일을 폴백으로 쓴다.
 * → docs/50-decisions/0003-english-first-multilingual.md
 */
export const en = {
  // ── 공통 ────────────────────────────────────────────────
  'common.cancel': 'Cancel',
  'common.save': 'Save',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.submit': 'Submit',
  'common.close': 'Close',
  'common.more': 'More',
  'common.loading': 'Loading',
  'common.retry': 'Try again',
  'common.previous': 'Previous',
  'common.next': 'Next',
  'common.signIn': 'Sign in',
  'common.justNow': 'just now',

  // ── 게시글 작성 ──────────────────────────────────────────
  'post.title.label': 'Title',
  'post.title.placeholder': 'Ask a specific question, e.g. "Can I change from D-2 to E-7 before I graduate?"',
  'post.body.label': 'Details',
  'post.body.placeholder': 'Include your status of stay, how long you have been in Korea, and what you already tried.',
  'post.body.hint': 'The more context you give, the better the answers.',
  'post.tags.label': 'Tags',
  'post.tags.hint': 'Add tags so the right people can find your question.',
  'post.publish': 'Post',
  'post.saveDraft': 'Save draft',
  'post.preview': 'Preview',
  'post.write': 'Write',
  'post.empty': 'Nothing to preview yet.',

  // ── 댓글 ────────────────────────────────────────────────
  'comment.count': { one: '{count} comment', other: '{count} comments' },
  'comment.reply': 'Reply',
  'comment.replyTo': 'Reply to {name}',
  'comment.replyCount': { one: '{count} reply', other: '{count} replies' },
  'comment.showReplies': 'Show replies',
  'comment.hideReplies': 'Hide replies',
  'comment.placeholder': 'Share what you know or what you went through.',
  'comment.post': 'Comment',
  'comment.empty': 'No comments yet. Be the first to help.',
  'comment.signInToComment': 'Sign in to comment',
  'comment.edited': 'edited',
  'comment.deleted': 'This comment was removed.',

  // ── 공감(리액션) ─────────────────────────────────────────
  'reaction.like': 'Like',
  'reaction.helpful': 'Helpful',
  'reaction.support': 'Support',
  'reaction.celebrate': 'Celebrate',
  'reaction.insightful': 'Insightful',
  'reaction.add': 'Add a reaction',
  'reaction.count': { one: '{count} reaction', other: '{count} reactions' },
  'reaction.byYou': 'You reacted with {name}',

  // ── 신고 ────────────────────────────────────────────────
  'report.title': 'Report this content',
  'report.description': 'Reports about scams or personal information are reviewed first.',
  'report.reason.label': 'Why are you reporting this?',
  'report.reason.scam': 'Scam or fraud',
  'report.reason.scamHint': 'Money is being asked for, or someone is offering to handle documents for a fee.',
  'report.reason.personalInfo': 'Personal information',
  'report.reason.personalInfoHint': 'A passport, residence card, address, or phone number is visible.',
  'report.reason.harassment': 'Harassment or hate speech',
  'report.reason.illegal': 'Advice to break the law',
  'report.reason.spam': 'Spam or advertising',
  'report.reason.other': 'Something else',
  'report.detail.label': 'Anything else we should know?',
  'report.detail.placeholder': 'Optional. This helps moderators act faster.',
  'report.submit': 'Submit report',
  'report.submitted': 'Report submitted. Thank you.',

  // ── 쪽지 ────────────────────────────────────────────────
  'message.title': 'Messages',
  'message.new': 'New message',
  'message.to': 'To',
  'message.placeholder': 'Write a message…',
  'message.send': 'Send',
  'message.empty': 'No messages yet.',
  'message.emptyHint': 'Messages are private between you and one other member.',
  'message.conversationEmpty': 'Say hello.',
  'message.block': 'Block this person',
  'message.report': 'Report this conversation',
  'message.safety': 'Never send money, passport photos, or your residence card. konnect staff will never ask for them.',
  'message.disabled': 'This member is not accepting messages.',
  'message.unread': { one: '{count} unread', other: '{count} unread' },

  // ── 언어 ────────────────────────────────────────────────
  'locale.label': 'Language',
  'locale.change': 'Change language',
  'locale.machineTranslated': 'Parts of this page are machine translated and may be wrong.',
} satisfies Messages;
