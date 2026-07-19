"use client";

interface OptionButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionButton({ label, selected, onClick }: OptionButtonProps) {
  return (
    <button
      type="button"
      className="option-button"
      aria-pressed={selected}
      onClick={onClick}
    >
      <span className="flex items-center justify-between gap-3">
        {label}
        {selected && (
          <span
            aria-hidden="true"
            className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-700 text-white"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
              <path
                fillRule="evenodd"
                d="M16.704 5.29a1 1 0 010 1.415l-7.5 7.5a1 1 0 01-1.415 0l-3.5-3.5a1 1 0 111.415-1.414L8.5 12.086l6.79-6.796a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </span>
    </button>
  );
}
