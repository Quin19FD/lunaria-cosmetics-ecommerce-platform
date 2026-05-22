"use client";

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">Đã xảy ra lỗi</h2>
      <p className="text-neutral-500">{error.message}</p>
      <button
        onClick={reset}
        className="bg-brand-500 hover:bg-brand-600 rounded-md px-4 py-2 text-sm text-white"
      >
        Thử lại
      </button>
    </div>
  );
}
