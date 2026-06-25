import { forwardRef, type SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-[11px] font-semibold tracking-widest text-neutral-400 uppercase"
          >
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref}
          className={cn(
            "focus:border-brand-500 focus:ring-brand-500/20 flex h-11 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 transition-colors focus:ring-2 focus:outline-none",
            error && "border-red-400 focus:border-red-500",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);
Select.displayName = "Select";

export { Select };
export type { SelectProps };
