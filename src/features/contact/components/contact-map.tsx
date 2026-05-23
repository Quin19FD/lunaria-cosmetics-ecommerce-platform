import { MapPin } from "lucide-react";

export function ContactMap() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-neutral-200">
      <div className="flex aspect-[16/7] items-center justify-center">
        <div className="text-center">
          <MapPin className="mx-auto h-10 w-10 text-brand-500" />
          <p className="mt-2 text-sm font-medium text-neutral-600">
            123 Đường Tiên Lụa, Quận Bình Tân
          </p>
          <p className="text-xs text-neutral-400">TP. Hồ Chí Minh, Việt Nam</p>
        </div>
      </div>
    </div>
  );
}
