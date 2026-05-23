import { Clock, Mail, MapPin, Phone } from "lucide-react";

const INFO_ITEMS = [
  {
    icon: MapPin,
    title: "Địa chỉ",
    lines: ["123 Đường Tiên Lụa", "Quận Bình Tân, TP. Hồ Chí Minh"],
  },
  {
    icon: Phone,
    title: "Điện thoại",
    lines: ["1900 1234", "Hotline hỗ trợ 24/7"],
  },
  {
    icon: Mail,
    title: "Email",
    lines: ["contact@lunaria.beauty", "support@lunaria.beauty"],
  },
  {
    icon: Clock,
    title: "Giờ làm việc",
    lines: ["Thứ 2 - Thứ 7: 8:00 - 21:00", "Chủ nhật: 9:00 - 18:00"],
  },
];

export function ContactInfo() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {INFO_ITEMS.map((item) => (
        <div
          key={item.title}
          className="flex gap-4 rounded-xl border border-neutral-100 bg-white p-5 shadow-sm"
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-50">
            <item.icon className="h-5 w-5 text-brand-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              {item.title}
            </h3>
            {item.lines.map((line) => (
              <p key={line} className="mt-0.5 text-sm text-neutral-500">
                {line}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
