"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
}

export function Pagination({ page, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function hrefFor(target: number): string {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(target));
    return `${pathname}?${params.toString()}`;
  }

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-neutral-500">
        Trang {page} / {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Link
          href={hrefFor(page - 1)}
          aria-disabled={prevDisabled}
          className={cn(
            "flex h-9 items-center gap-1 rounded-lg border border-neutral-200 px-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50",
            prevDisabled && "pointer-events-none opacity-40",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Trước
        </Link>
        <Link
          href={hrefFor(page + 1)}
          aria-disabled={nextDisabled}
          className={cn(
            "flex h-9 items-center gap-1 rounded-lg border border-neutral-200 px-3 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50",
            nextDisabled && "pointer-events-none opacity-40",
          )}
        >
          Sau
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
