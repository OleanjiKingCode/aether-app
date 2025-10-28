import React, { useState, useRef, useEffect } from "react";

interface NetworkOption {
  name: string;
  logoURI?: string | null;
  icon?: string | null;
}

interface NetworkSelectProps {
  data: NetworkOption[];
  value?: NetworkOption;
  onChange?: (value: string) => void;
  className?: string;
}

const NetworkSelect = ({
  data,
  value,
  onChange,
  className,
}: NetworkSelectProps) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        !buttonRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selected = value || data[0];
  console.log("selected => ", selected);

  return (
    <div className={`relative w-full md:w-[220px] ${className || ""}`}>
      <button
        ref={buttonRef}
        type="button"
        className={`flex items-center justify-between w-full border border-input px-3 py-2 bg-transparent text-foreground text-sm ${
          data.length === 0
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:bg-accent"
        }`}
        onClick={() => data.length > 0 && setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2">
          {selected && (
            <>
              {selected.logoURI || selected.icon ? (
                <img
                  src={(selected.logoURI || selected.icon) as string}
                  alt={selected.name}
                  width={20}
                  height={20}
                  className="w-5 h-5 rounded-full object-cover"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                  {selected.name.charAt(0)}
                </div>
              )}
              <span className="text-foreground font-medium">
                {selected.name}
              </span>
            </>
          )}
          {!selected && (
            <span className="text-foreground font-medium">Loading ...</span>
          )}
        </span>
        <svg
          className="w-4 h-4 text-muted-foreground ml-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {open && (
        <ul
          ref={listRef}
          className="absolute z-10 mt-1 w-full bg-background border border-input shadow-lg max-h-60 overflow-auto"
        >
          {data.map((row: NetworkOption) => (
            <li
              key={row.name}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent`}
              onClick={() => {
                setOpen(false);
                onChange?.(row.name);
              }}
            >
              {row.logoURI || row.icon ? (
                <img
                  src={(row.logoURI || row.icon) as string}
                  alt={row.name}
                  width={20}
                  height={20}
                  className="w-5 h-5 rounded-full object-cover"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                  {row.name.charAt(0)}
                </div>
              )}
              <span className="text-foreground font-medium">{row.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NetworkSelect;
