export default function StorefrontLoading() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center"
      role="status"
      aria-label="Đang tải"
    >
      <div className="border-brand-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent motion-reduce:animate-[spin_3s_linear_infinite]" />
    </div>
  );
}
