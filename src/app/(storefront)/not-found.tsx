import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="font-serif text-3xl font-bold">404</h2>
      <p className="text-neutral-500">Trang bạn tìm kiếm không tồn tại.</p>
      <Link
        href="/"
        className="bg-brand-500 hover:bg-brand-600 rounded-md px-4 py-2 text-sm text-white"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
