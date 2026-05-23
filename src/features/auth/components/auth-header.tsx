interface AuthHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
}

export function AuthHeader({ badge, title, subtitle }: AuthHeaderProps) {
  return (
    <div className="mb-8 text-center">
      {badge && (
        <p className="mb-3 text-[11px] font-semibold tracking-[0.2em] text-brand-500 uppercase">
          {badge}
        </p>
      )}
      <h1 className="font-serif text-3xl font-bold text-neutral-900 sm:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm text-neutral-400">{subtitle}</p>
      )}
    </div>
  );
}
