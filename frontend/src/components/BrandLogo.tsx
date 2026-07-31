interface BrandLogoProps {
  showTagline?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export default function BrandLogo({
  showTagline = false,
  compact = false,
  onClick,
}: BrandLogoProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-3 text-left cursor-pointer"
      aria-label="Go to DevTrayck dashboard"
    >
      <img
        src="/brand/devtrayck-mark.svg"
        alt=""
        aria-hidden="true"
        className={
          compact
            ? "h-9 w-9 shrink-0"
            : "h-12 w-12 shrink-0"
        }
      />

      <span>
        <span
          className={
            compact
              ? "block text-xl font-bold tracking-tight text-white"
              : "block text-2xl font-bold tracking-tight text-white"
          }
        >
          DevT
          <span className="text-indigo-500">
            ray
          </span>
          ck
        </span>

        {showTagline && (
          <span className="mt-0.5 block text-sm text-zinc-400">
            Built for developers.
          </span>
        )}
      </span>
    </button>
  );
}