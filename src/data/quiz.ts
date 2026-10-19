// "Real or fake?" practice items. Messages are written from public police and
// bank warnings (2025-2026); numbers, names and links are made up. Each item
// teaches one sign, so people can spot it next time without the app.

export interface QuizItem {
  id: string;
  channel: string;
  message: string;
  scam: boolean;
  sign: string;
  explanation: string;
}

export const QUIZ: QuizItem[] = [
  {
    id: 'vneid',
    channel: 'Tin nhắn Zalo',
    message:
      'Công an phường thông báo: tài khoản định danh mức 2 của bạn bị lỗi. Vui lòng tải ứng dụng VNeID mới tại link vneid-capnhat.online để cập nhật trong 24 giờ.',
    scam: true,
    sign: 'Cơ quan nhà nước gửi link cài ứng dụng',
    explanation:
      'Công an không gửi link cài app qua tin nhắn. Ứng dụng VNeID thật chỉ tải từ App Store, Google Play. Trang dịch vụ công thật luôn có đuôi .gov.vn.',
  },
  {
    id: 'otp-bank',
    channel: 'Tin nhắn SMS',
    message: 'Mã OTP của Quý khách là 482913, hiệu lực 3 phút. Tuyệt đối KHÔNG cung cấp mã OTP cho bất kỳ ai, kể cả nhân viên ngân hàng.',
    scam: false,
    sign: 'Tin OTP thật dặn bạn không đưa mã cho ai',
    explanation: 'Đây là tin OTP bình thường khi chính bạn đang giao dịch. Nguy hiểm là khi có người gọi xin bạn đọc mã này.',
  },
  {
    id: 'safe-account',
    channel: 'Cuộc gọi',
    message:
      '"Chị có liên quan đến đường dây rửa tiền. Để chứng minh trong sạch, chị chuyển toàn bộ tiền vào tài khoản tạm giữ của cơ quan điều tra, xác minh xong sẽ trả lại. Không được kể với ai."',
    scam: true,
    sign: '"Tài khoản an toàn", dặn giữ bí mật',
    explanation:
      'Không cơ quan nào yêu cầu chuyển tiền để "xác minh". Công an làm việc trực tiếp, có giấy mời. Bị dặn giữ bí mật là dấu hiệu để cô lập bạn: hãy cúp máy và gọi người thân.',
  },
  {
    id: 'salary',
    channel: 'Tin nhắn SMS',
    message: 'TK 0011xxx456 +12,000,000VND lúc 09:12 25/10. SD: 15,350,000VND. ND: LUONG THANG 10.',
    scam: false,
    sign: 'Biến động số dư, không đòi bạn làm gì',
    explanation: 'Tin báo biến động số dư không kèm link, không đòi thao tác. Muốn chắc, mở ứng dụng ngân hàng để xem.',
  },
  {
    id: 'task',
    channel: 'Tin nhắn Telegram',
    message:
      'Tuyển CTV làm tại nhà, chỉ cần thả tim, đánh giá sản phẩm, hoa hồng 10-30% mỗi đơn. Đơn đầu được trả ngay. Từ đơn thứ 3 cần nạp tiền để nhận nhiệm vụ lớn.',
    scam: true,
    sign: 'Việc làm bắt nạp tiền',
    explanation:
      'Lừa đảo "làm nhiệm vụ" trả thưởng nhỏ lúc đầu để tạo niềm tin, rồi bắt nạp tiền ngày càng lớn và không cho rút. Việc làm thật không bắt bạn đưa tiền.',
  },
  {
    id: 'delivery-ok',
    channel: 'Thông báo ứng dụng mua sắm',
    message: 'Đơn hàng #240915ABC đang được giao. Shipper sẽ liên hệ bạn trong hôm nay. Theo dõi đơn trong mục Đơn mua.',
    scam: false,
    sign: 'Thông báo trong chính ứng dụng, không đòi tiền',
    explanation: 'Thông báo nằm trong ứng dụng bạn đã đặt hàng và không đòi phí. Tin nhắn ngoài ứng dụng đòi phí giao lại mới đáng ngờ.',
  },
  {
    id: 'delivery-fee',
    channel: 'Tin nhắn SMS',
    message: 'Bưu phẩm của bạn giao thất bại do sai địa chỉ. Cập nhật địa chỉ và thanh toán phí 15.000đ tại ghn-giaohang.top để giao lại.',
    scam: true,
    sign: 'Link lạ đòi phí nhỏ',
    explanation:
      'Phí nhỏ khiến bạn mất cảnh giác, nhưng trang giả sẽ lấy thông tin thẻ, OTP. Hãy kiểm tra đơn trong ứng dụng mua sắm hoặc ứng dụng của hãng giao hàng.',
  },
  {
    id: 'recovery',
    channel: 'Bình luận Facebook',
    message: 'Văn phòng luật sư hỗ trợ lấy lại tiền bị lừa đảo qua mạng, cam kết 100%, phí hồ sơ chỉ 1.500.000đ. Inbox ngay.',
    scam: true,
    sign: 'Hứa lấy lại tiền đã bị lừa',
    explanation:
      'Đây là "lừa đảo lần hai" nhắm vào người vừa mất tiền. Không ai lấy lại tiền giúp bạn qua mạng. Hãy trình báo công an nơi cư trú hoặc qua VNeID.',
  },
  {
    id: 'relative',
    channel: 'Tin nhắn Zalo từ tài khoản người thân',
    message: 'Mẹ ơi con đang kẹt ở ngoài, điện thoại sắp hết pin, mẹ chuyển giúp con 5 triệu vào số tài khoản này của bạn con nhé, tối con gửi lại.',
    scam: true,
    sign: 'Người thân nhờ chuyển tiền gấp vào tài khoản lạ',
    explanation:
      'Tài khoản Zalo, Facebook của người thân có thể đã bị chiếm. Hãy gọi lại cho con bằng số điện thoại đã lưu từ trước, không gọi số trong tin nhắn.',
  },
  {
    id: 'meeting',
    channel: 'Tin nhắn Zalo nhóm lớp',
    message: 'Kính gửi phụ huynh: họp phụ huynh lớp 5A lúc 8h sáng thứ Bảy tại phòng 201. Mong quý phụ huynh tham dự đầy đủ.',
    scam: false,
    sign: 'Thông tin, không đòi tiền hay link',
    explanation: 'Tin thông báo không đòi tiền, không gửi link, không yêu cầu thông tin cá nhân.',
  },
  {
    id: 'invest',
    channel: 'Tin nhắn Facebook',
    message: 'Anh ơi em đang đầu tư sàn này, lợi nhuận 3%/ngày, cam kết không lỗ, rút tiền trong 5 phút. Em gửi link đăng ký anh làm cùng em nhé.',
    scam: true,
    sign: 'Lãi cao mỗi ngày, cam kết không lỗ',
    explanation: 'Không khoản đầu tư hợp pháp nào cam kết 3%/ngày hay "không lỗ". Tiền nạp vào các sàn này thường không rút ra được.',
  },
  {
    id: 'electricity',
    channel: 'Cuộc gọi',
    message:
      '"Bên em là điện lực. Nhà mình nợ tiền điện, tối nay sẽ bị cắt. Anh cài giúp em ứng dụng theo link em gửi qua Zalo để thanh toán và bật quyền trợ năng cho ứng dụng nhé."',
    scam: true,
    sign: 'Đòi cài app và bật Trợ năng',
    explanation:
      'Bật Trợ năng cho ứng dụng lạ cho phép kẻ gian điều khiển điện thoại và chuyển tiền. Hãy cúp máy và tự gọi tổng đài in trên hoá đơn tiền điện.',
  },
];

export const QUIZ_ROUND = 8;
