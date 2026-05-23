"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Add ellipsis and pages before current if needed
      if (currentPage > 3) {
        pages.push("...");
      }

      // Add pages around current
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }

      // Add ellipsis and last page if needed
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isPrevDisabled}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg border border-neutral-200 transition-colors",
          isPrevDisabled
            ? "text-neutral-400 cursor-not-allowed"
            : "text-neutral-700 hover:bg-neutral-100"
        )}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="flex items-center justify-center w-10 h-10 text-neutral-400"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-colors",
                isActive
                  ? "bg-brand-500 text-white"
                  : "text-neutral-700 hover:bg-neutral-100"
              )}
              aria-label={`Page ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isNextDisabled}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg border border-neutral-200 transition-colors",
          isNextDisabled
            ? "text-neutral-400 cursor-not-allowed"
            : "text-neutral-700 hover:bg-neutral-100"
        )}
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
