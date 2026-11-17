export interface InfoPage {
  slug: string;
  title: string;
  summary: string;
  sections: { heading: string; body: string }[];
}

const DEMO_NOTE =
  "Lunaria là dự án demo: đơn hàng không được giao thật và thẻ chỉ chạy ở chế độ thử nghiệm của Stripe.";

/** Static pages linked from the footer. */
export const INFO_PAGES: InfoPage[] = [
  {
    slug: "about",
    title: "Câu chuyện thương hiệu",
    summary:
      "Lunaria là cửa hàng mỹ phẩm mẫu, dựng để trình bày một nền tảng thương mại điện tử hoàn chỉnh.",
    sections: [
      {
        heading: "Lunaria là gì",
        body: "Một storefront mỹ phẩm với danh mục, bộ sưu tập, giỏ hàng, thanh toán, theo dõi đơn và trang quản trị.",
      },
      { heading: "Lưu ý", body: DEMO_NOTE },
    ],
  },
  {
    slug: "faq",
    title: "Câu hỏi thường gặp",
    summary: "Những điều hay được hỏi khi dùng bản demo Lunaria.",
    sections: [
      {
        heading: "Tôi có nhận được hàng không?",
        body: DEMO_NOTE,
      },
      {
        heading: "Tôi theo dõi đơn ở đâu?",
        body: "Vào trang Theo dõi đơn hàng và nhập mã đơn, hoặc xem trong mục Tài khoản sau khi đăng nhập.",
      },
      {
        heading: "Mã giảm giá dùng thế nào?",
        body: "Nhập mã ở bước thanh toán. Các mã đang chạy được liệt kê ở trang Khuyến mãi.",
      },
    ],
  },
  {
    slug: "privacy",
    title: "Chính sách bảo mật",
    summary: "Dữ liệu nào được lưu khi bạn dùng bản demo.",
    sections: [
      {
        heading: "Dữ liệu được lưu",
        body: "Tên, email, địa chỉ giao hàng và lịch sử đơn bạn nhập vào. Mật khẩu được băm, không lưu dạng gốc.",
      },
      {
        heading: "Thanh toán",
        body: "Thông tin thẻ do Stripe xử lý và không đi qua máy chủ của Lunaria.",
      },
      {
        heading: "Lưu ý",
        body: "Đây là bản demo công khai: đừng nhập thông tin cá nhân thật.",
      },
    ],
  },
  {
    slug: "terms",
    title: "Điều khoản dịch vụ",
    summary: "Điều kiện sử dụng bản demo Lunaria.",
    sections: [
      { heading: "Phạm vi", body: DEMO_NOTE },
      {
        heading: "Tài khoản",
        body: "Tài khoản demo dùng chung, dữ liệu có thể được đặt lại bất cứ lúc nào.",
      },
    ],
  },
  {
    slug: "shipping",
    title: "Chính sách vận chuyển",
    summary: "Phí vận chuyển được tính và hiển thị ở bước thanh toán.",
    sections: [
      {
        heading: "Phí vận chuyển",
        body: "Phí hiển thị trong phần tóm tắt đơn trước khi bạn xác nhận đặt hàng.",
      },
      { heading: "Lưu ý", body: DEMO_NOTE },
    ],
  },
  {
    slug: "returns",
    title: "Chính sách đổi trả",
    summary: "Cách huỷ đơn trong bản demo.",
    sections: [
      {
        heading: "Huỷ đơn",
        body: "Khi đơn bị huỷ, tồn kho và lượt dùng mã giảm giá được trả lại tự động.",
      },
      { heading: "Lưu ý", body: DEMO_NOTE },
    ],
  },
];

export function findInfoPage(slug: string): InfoPage | undefined {
  return INFO_PAGES.find((page) => page.slug === slug);
}
