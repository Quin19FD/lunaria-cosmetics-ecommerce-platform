import { forwardRef, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, rightElement, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {(label || rightElement) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={id}
                className="text-[11px] font-semibold tracking-widest text-neutral-400 uppercase"
              >
                {label}
              </label>
            )}
            {rightElement}
          </div>
        )}
        <input
          id={id}
          ref={ref}
          className={cn(
            "flex h-11 w-full border-b border-neutral-200 bg-transparent px-0 pb-2 text-sm text-neutral-900 transition-colors placeholder:text-neutral-400 focus:border-brand-500 focus:outline-none",
            error && "border-red-400 focus:border-red-500",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
export type { InputProps };
