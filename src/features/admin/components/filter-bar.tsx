import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui";

interface FilterBarProps {
  children: ReactNode;
  basePath: string;
  hasActiveFilters?: boolean;
}

/**
 * GET-form filter row. Children are the field controls (Select/Input with a
 * `name`). Submitting reloads the current route with the chosen query params;
 * "Đặt lại" clears them by linking back to `basePath`.
 */
export function FilterBar({
  children,
  basePath,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <form
      method="get"
      className="mb-5 flex flex-wrap items-end gap-3 rounded-2xl border border-neutral-200 bg-white p-4"
    >
      {children}
      <div className="flex items-end gap-2">
        <Button type="submit" size="sm" variant="outline">
          Lọc
        </Button>
        {hasActiveFilters && (
          <Button asChild size="sm" variant="ghost">
            <Link href={basePath}>Đặt lại</Link>
          </Button>
        )}
      </div>
    </form>
  );
}
