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

  // ── 질문 상세 ────────────────────────────────────────────
  'question.writtenIn': 'Written in {language}',
  'question.translate': 'Translate to {language}',
  'question.freshness': 'Updated {when}.',
  'question.freshnessWarning': 'Immigration rules change often — always confirm on the official page.',
  'question.officialSource': 'Official page',
  'question.disclaimer': 'Community answers are personal experience, not legal advice. konnect does not file applications for you.',
  'question.acceptedBy': 'Accepted by the asker',
  'question.answers': { one: '{count} answer', other: '{count} answers' },
  'question.noAnswers': 'No answers yet. Be the first to help.',
  'question.follow': 'Follow {tag}',
  'question.askedBy': 'Asked by {name}',
  'question.hidden': 'This question is hidden. Only you can see it.',
  'question.notFound': 'This question does not exist, or it was hidden.',
  'question.backToList': 'Back to questions',
  'question.yearsInKorea': { one: '{count} year in Korea', other: '{count} years in Korea' },
  'question.koreanTerm': 'Korean term — copy this to search',


  // ── 질문 목록 ────────────────────────────────────────────
  'list.title': 'Questions',
  'list.description': 'Questions from people living, studying, and working in Korea.',
  'list.empty': 'No questions here yet.',
  'list.emptyHint': 'Be the first to ask — someone who has been through it will know.',
  'list.emptyFiltered': 'No questions match this filter.',
  'list.emptyFilteredHint': 'Try a different topic, or clear the filter.',
  'list.answers': { zero: 'No answers', one: '{count} answer', other: '{count} answers' },
  'list.accepted': 'Accepted answer',
  'list.loadMore': 'Load more',
  'list.filterTopic': 'Topic',
  'list.allTopics': 'All',
  'list.clearFilter': 'Clear filter',
  'topic.residency': 'Residency',
  'topic.work': 'Work',
  'topic.housing': 'Housing',
  'topic.admin': 'Paperwork',
  'topic.language': 'Language',
  'topic.social': 'Community',

  // ── 척추 페이지 ──────────────────────────────────────────
  'spine.officialSources': 'Official sources',
  'spine.sourcesNote': 'We link and quote. We do not interpret — rules change and a wrong answer can cost your status.',
  'spine.viewOriginal': 'View original',
  'spine.relatedQuestions': 'Questions about this',
  'spine.noQuestions': 'No questions about this yet.',
  'spine.askFirst': 'Ask the first one',
  'spine.statute': 'Statute',
  'spine.notice': 'Notice',
  'spine.guide': 'Guide',
  'spine.missing': 'Not here yet',
  'spine.missingNote': 'Last-checked dates and change badges are not on this page yet — the watcher runs daily on the server but the app cannot read its output.',
  'spine.basisDecree': 'Official designation in the Enforcement Decree of the Immigration Act, Appendix 1-2.',
  'spine.basisNationalityAct': 'A route to citizenship defined by the Nationality Act.',
  'spine.topicIntro': 'Questions, and the official sources behind them.',

  // ── 홈 ──────────────────────────────────────────────────
  // 홈 본문은 **이 서비스가 무엇인지**를 말하는 유일한 자리라 하드코딩 유혹이 크다.
  // 실제로 하드코딩돼 있었고, zh·vi 사용자가 중국어·베트남어 화면에서 영어를 읽었다.
  // 사전끼리만 비교하는 messages.test.ts 는 이걸 원리적으로 볼 수 없다.
  'home.tagline': 'A community for foreigners living, studying, working, and travelling in Korea.',
  // `{arc}` 는 한국어 원문(외국인등록증)이 들어갈 자리다. **네 판 모두 이 자리를 쓴다** —
  // 한국어 판에서도 그 낱말은 사용자가 실제 서류에서 눈으로 찾아야 하는 원문이라
  // `lang="ko" translate="no"` 가 그대로 필요하다. 자리를 비우면
  // 사전 간 자리표시자 대조가 깨지고, 그 예외가 한 번 생기면 규칙이 아니게 된다.
  'home.intro':
    'Alien Registration Card ({arc}), visas, housing, language — ask the people who have been through it.',
  'home.topicHeading': 'Browse by topic',
  'home.visaHeading': 'Visa and residence status',

  // ── 네비게이션 ───────────────────────────────────────────
  'nav.questions': 'Questions',
  'nav.guides': 'Guides',
  'nav.meetups': 'Meetups',

  'nav.brandHome': 'konnect — home',
  'nav.main': 'Main navigation',
  'nav.sidebar': 'Page sidebar',

  // ── 태그 네임스페이스 배지 ────────────────────────────────
  // 목록·상세의 **모든 태그 칩**에 붙는 접두사다. 문구가 `Tag.utils.ts` 에 있어서
  // 하드코딩 검사가 파일 자체를 안 읽었고, 네 로케일 모두 영어로 나가고 있었다.
  'tag.namespace.visa': 'Visa',
  'tag.namespace.topic': 'Topic',
  'tag.namespace.region': 'Region',
  'tag.namespace.nationality': 'Nationality',
  'tag.namespace.school': 'School',
  'tag.namespace.lang': 'Language',
  'tag.remove': 'Remove tag {label}',

  // ── 접근성·크롬 ─────────────────────────────────────────
  // 아래 넷은 **모든 페이지에 렌더된다**. 화면에 글자로 보이지 않거나
  // (aria-label) 첫 Tab 에서야 나타나서(SkipLink) 눈으로는 안 드러난다.
  'a11y.skipToContent': 'Skip to content',
  'a11y.dismiss': 'Dismiss',
  'nav.openMenu': 'Open menu',
  'theme.light': 'Theme: light',
  'theme.dark': 'Theme: dark',
  'theme.system': 'Theme: follow system',

  'common.confirm': 'Confirm',

  // ── 데이터를 못 가져왔을 때 ──────────────────────────────
  // '비었다' 와 **다른 말**이어야 한다. 못 가져온 것을 "질문이 없습니다" 로
  // 보여주면 사용자에게 거짓을 말하는 것이고, 다시 시도할 이유도 안 준다.
  'list.unavailable': 'Could not load questions',
  'list.unavailableHint': 'This is on our side, not yours. Reload in a moment.',

} satisfies Messages;
