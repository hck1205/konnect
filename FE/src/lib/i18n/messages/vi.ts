import type { Messages } from '../translate';

/**
 * 베트남어.
 *
 * ⚠️ **원어민 검수 전이다.** zh 와 같은 이유로 행정 용어가 특히 위험하다.
 * 베트남어에도 복수 구분이 없어 `other` 하나만 둔다.
 */
export const vi = {
  'common.cancel': 'Huỷ',
  'common.save': 'Lưu',
  'common.delete': 'Xoá',
  'common.edit': 'Sửa',
  'common.submit': 'Gửi',
  'common.close': 'Đóng',
  'common.more': 'Thêm',
  'common.loading': 'Đang tải',
  'common.retry': 'Thử lại',
  'common.previous': 'Trước',
  'common.next': 'Tiếp',
  'common.signIn': 'Đăng nhập',
  'common.justNow': 'vừa xong',

  'post.title.label': 'Tiêu đề',
  'post.body.label': 'Nội dung',
  'post.tags.label': 'Thẻ',
  'post.publish': 'Đăng',
  'post.preview': 'Xem trước',
  'post.write': 'Viết',

  'comment.count': { other: '{count} bình luận' },
  'comment.reply': 'Trả lời',
  'comment.replyCount': { other: '{count} trả lời' },
  'comment.showReplies': 'Xem trả lời',
  'comment.hideReplies': 'Ẩn trả lời',
  'comment.post': 'Bình luận',
  'comment.empty': 'Chưa có bình luận nào.',

  'reaction.like': 'Thích',
  'reaction.helpful': 'Hữu ích',
  'reaction.support': 'Ủng hộ',
  'reaction.celebrate': 'Chúc mừng',
  'reaction.insightful': 'Sâu sắc',
  'reaction.add': 'Thêm cảm xúc',
  'reaction.count': { other: '{count} cảm xúc' },

  'report.title': 'Báo cáo nội dung này',
  'report.submit': 'Gửi báo cáo',

  'message.title': 'Tin nhắn',
  'message.send': 'Gửi',
  'message.safety': 'Đừng bao giờ gửi tiền, ảnh hộ chiếu hoặc thẻ cư trú. Nhân viên konnect sẽ không bao giờ yêu cầu chúng.',

  'locale.label': 'Ngôn ngữ',
  'locale.change': 'Đổi ngôn ngữ',
  'locale.machineTranslated': 'Một phần trang này được dịch máy và có thể không chính xác.',
} satisfies Messages;
