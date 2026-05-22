export const metadata = { title: "Lỗi xác thực" };

export default function AuthErrorPage() {
  return (
    <div className="rounded-lg bg-white p-8 text-center shadow-sm">
      <h1 className="font-serif text-2xl font-bold">Lỗi xác thực</h1>
      <p className="mt-2 text-neutral-500">
        Đã xảy ra lỗi trong quá trình xác thực.
      </p>
    </div>
  );
}
