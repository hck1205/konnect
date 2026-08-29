import type { Messages } from '../translate';

/**
 * 중국어(간체).
 *
 * ⚠️ **원어민 검수 전이다.** 행정·법률 용어가 특히 위험하다 —
 * 오역이 곧 피해가 되는 영역이라(R1) 출시 전에 반드시 검수한다.
 * → docs/10-domain/10-visa-immigration/03-content-and-risk-policy.md
 *
 * 중국어에도 복수 구분이 없어 `other` 하나만 둔다.
 */
export const zh = {
  'common.cancel': '取消',
  'common.save': '保存',
  'common.delete': '删除',
  'common.edit': '编辑',
  'common.submit': '提交',
  'common.close': '关闭',
  'common.more': '更多',
  'common.loading': '加载中',
  'common.retry': '重试',
  'common.previous': '上一页',
  'common.next': '下一页',
  'common.signIn': '登录',
  'common.justNow': '刚刚',

  'post.title.label': '标题',
  'post.body.label': '正文',
  'post.tags.label': '标签',
  'post.publish': '发布',
  'post.preview': '预览',
  'post.write': '编写',

  'comment.count': { other: '{count} 条评论' },
  'comment.reply': '回复',
  'comment.replyCount': { other: '{count} 条回复' },
  'comment.showReplies': '显示回复',
  'comment.hideReplies': '收起回复',
  'comment.post': '发表评论',
  'comment.empty': '还没有评论。',

  'reaction.like': '赞',
  'reaction.helpful': '有帮助',
  'reaction.support': '支持',
  'reaction.celebrate': '祝贺',
  'reaction.insightful': '有启发',
  'reaction.add': '添加反应',
  'reaction.count': { other: '{count} 个反应' },

  'report.title': '举报此内容',
  'report.submit': '提交举报',

  'message.title': '私信',
  'message.send': '发送',
  'message.safety': '请勿发送金钱、护照照片或外国人登录证。konnect 工作人员绝不会索要这些。',

  'locale.label': '语言',
  'locale.change': '更改语言',
  'locale.machineTranslated': '本页部分内容为机器翻译，可能不准确。',

  // ── 질문 상세 ────────────────────────────────────────────
  'question.writtenIn': '以{language}撰写',
  'question.translate': '翻译成{language}',
  'question.freshness': '更新于{when}。',
  'question.freshnessWarning': '出入境规定经常变动 — 请务必在下方官方页面确认。',
  'question.officialSource': '官方页面',
  'question.disclaimer': '社区回答是个人经验，不是法律意见。konnect 不代办申请。',
  'question.acceptedBy': '提问者已采纳',
  'question.answers': { one: '{count} 个回答', other: '{count} 个回答' },
  'question.noAnswers': '还没有回答。来做第一个帮忙的人吧。',
  'question.follow': '关注 {tag}',
  'question.askedBy': '{name} 提问',
  'question.hidden': '此问题已隐藏，只有你能看到。',
  'question.notFound': '该问题不存在，或已被隐藏。',
  'question.backToList': '返回问题列表',
  'question.yearsInKorea': { one: '在韩 {count} 年', other: '在韩 {count} 年' },
  'question.koreanTerm': '韩语词条 — 复制后可用于搜索',


  // ── 네비게이션 ───────────────────────────────────────────
  'nav.questions': '问题',
  'nav.guides': '指南',
  'nav.meetups': '聚会',

} satisfies Messages;
