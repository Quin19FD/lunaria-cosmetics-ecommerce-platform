import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <div className={cn("flex items-center justify-center gap-2.5", className)}>
      {/* Sparkle icon matching reference design */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        className="text-brand-500"
        aria-hidden="true"
      >
        <path
          d="M14 0L15.8 10.2L26 14L15.8 17.8L14 28L12.2 17.8L2 14L12.2 10.2L14 0Z"
          fill="currentColor"
        />
        <path
          d="M14 6L15 11.5L20 14L15 16.5L14 22L13 16.5L8 14L13 11.5L14 6Z"
          fill="currentColor"
          opacity="0.4"
        />
      </svg>
      <span className="text-lg font-bold tracking-[0.15em] text-neutral-800 uppercase">
        Lunaria Beauty
      </span>
    </div>
  );
}
