"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";

import { cn } from "@/lib/utils";

interface DeleteButtonProps {
  action: () => Promise<void>;
  confirmMessage?: string;
  label?: string;
  className?: string;
}

export function DeleteButton({
  action,
  confirmMessage = "Bạn chắc chắn muốn xóa? Hành động không thể hoàn tác.",
  label,
  className,
}: DeleteButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(confirmMessage)) return;
    startTransition(() => {
      void action();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50",
        className,
      )}
    >
      <Trash2 className="h-4 w-4" />
      {label}
    </button>
  );
}
