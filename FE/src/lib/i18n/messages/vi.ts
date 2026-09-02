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

  // ── 질문 상세 ────────────────────────────────────────────
  'question.writtenIn': 'Viết bằng {language}',
  'question.translate': 'Dịch sang {language}',
  'question.freshness': 'Cập nhật {when}.',
  'question.freshnessWarning': 'Quy định xuất nhập cảnh thay đổi thường xuyên — hãy kiểm tra lại ở trang chính thức bên dưới.',
  'question.officialSource': 'Trang chính thức',
  'question.disclaimer': 'Câu trả lời từ cộng đồng là kinh nghiệm cá nhân, không phải tư vấn pháp lý. konnect không nộp hồ sơ thay bạn.',
  'question.acceptedBy': 'Được người hỏi chấp nhận',
  'question.answers': { one: '{count} câu trả lời', other: '{count} câu trả lời' },
  'question.noAnswers': 'Chưa có câu trả lời. Hãy là người đầu tiên giúp đỡ.',
  'question.follow': 'Theo dõi {tag}',
  'question.askedBy': 'Câu hỏi của {name}',
  'question.hidden': 'Câu hỏi này đang bị ẩn. Chỉ bạn nhìn thấy.',
  'question.notFound': 'Câu hỏi không tồn tại hoặc đã bị ẩn.',
  'question.backToList': 'Quay lại danh sách câu hỏi',
  'question.yearsInKorea': { one: '{count} năm ở Hàn Quốc', other: '{count} năm ở Hàn Quốc' },
  'question.koreanTerm': 'Thuật ngữ tiếng Hàn — sao chép để tìm kiếm',


  // ── 질문 목록 ────────────────────────────────────────────
  'list.title': 'Câu hỏi',
  'list.description': 'Câu hỏi từ những người đang sống, học tập và làm việc tại Hàn Quốc.',
  'list.empty': 'Chưa có câu hỏi nào.',
  'list.emptyHint': 'Hãy là người hỏi đầu tiên — người từng trải sẽ biết câu trả lời.',
  'list.emptyFiltered': 'Không có câu hỏi nào khớp với bộ lọc này.',
  'list.emptyFilteredHint': 'Thử chủ đề khác, hoặc xoá bộ lọc.',
  'list.answers': { zero: 'Chưa có trả lời', other: '{count} trả lời' },
  'list.accepted': 'Đã chọn',
  'list.loadMore': 'Xem thêm',
  'list.filterTopic': 'Chủ đề',
  'list.allTopics': 'Tất cả',
  'list.clearFilter': 'Xoá bộ lọc',
  'topic.residency': 'Cư trú',
  'topic.work': 'Việc làm',
  'topic.housing': 'Nhà ở',
  'topic.admin': 'Giấy tờ',
  'topic.language': 'Ngôn ngữ',
  'topic.social': 'Cộng đồng',

  // ── 척추 페이지 ──────────────────────────────────────────
  'spine.officialSources': 'Nguồn chính thức',
  'spine.sourcesNote': 'Chúng tôi dẫn liên kết và trích dẫn, không diễn giải — quy định thay đổi và câu trả lời sai có thể khiến bạn mất tư cách lưu trú.',
  'spine.viewOriginal': 'Xem bản gốc',
  'spine.relatedQuestions': 'Câu hỏi về mục này',
  'spine.noQuestions': 'Chưa có câu hỏi nào về mục này.',
  'spine.askFirst': 'Đặt câu hỏi đầu tiên',
  'spine.statute': 'Văn bản luật',
  'spine.notice': 'Thông báo',
  'spine.guide': 'Hướng dẫn',
  'spine.missing': 'Chưa có',
  'spine.missingNote': 'Ngày kiểm tra gần nhất và dấu thay đổi chưa có trên trang này — trình theo dõi chạy hằng ngày trên máy chủ nhưng ứng dụng chưa đọc được kết quả.',
  'spine.basisDecree': 'Tên gọi theo Nghị định thi hành Luật Xuất nhập cảnh, Phụ lục 1-2.',
  'spine.basisNationalityAct': 'Thủ tục nhập quốc tịch theo Luật Quốc tịch.',
  'spine.topicIntro': 'Câu hỏi, và các nguồn chính thức đằng sau.',

  // ── 네비게이션 ───────────────────────────────────────────
  'nav.questions': 'Câu hỏi',
  'nav.guides': 'Hướng dẫn',
  'nav.meetups': 'Gặp gỡ',

} satisfies Messages;
