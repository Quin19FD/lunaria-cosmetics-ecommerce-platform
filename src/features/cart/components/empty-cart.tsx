import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
        <ShoppingBag className="h-10 w-10 text-neutral-400" />
      </div>
      <h2 className="mt-6 font-serif text-2xl font-bold text-neutral-900">
        Giỏ hàng trống
      </h2>
      <p className="mt-2 text-sm text-neutral-500">
        Bạn chưa thêm sản phẩm nào vào giỏ hàng
      </p>
      <Button asChild className="mt-6" size="lg">
        <Link href="/products">Khám phá sản phẩm</Link>
      </Button>
    </div>
  );
}
