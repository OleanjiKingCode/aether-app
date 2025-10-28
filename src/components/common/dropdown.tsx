import React, { useState, useRef, useEffect } from "react";

interface SelectProps {
    data: string[];
    value: number;
    onChange?: (value: number) => void;
    className?: string;
    placeholder?: string;
    textClassName?: string
}

const Dropdown = ({ data, value, onChange, className, placeholder, textClassName }: SelectProps) => {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Close dropdown on outside click
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

    const selected = data[value] || placeholder;

    return (
        <div className={`relative w-full 2xl:w-full ${className || ""}`}>
            <button
                ref={buttonRef}
                type="button"
                className="flex items-center justify-between w-full border border-input px-3 py-2 bg-transparent text-foreground text-sm"
                onClick={() => setOpen((v) => !v)}
            >
                <span>
                    <span className={`text-foreground ${textClassName}`}>{selected}</span>
                </span>
                <svg
                    className="w-4 h-4 text-muted-foreground ml-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open && (
                <ul
                    ref={listRef}
                    className="absolute z-10 mt-1 w-full bg-background border border-input shadow-lg max-h-60 overflow-auto"
                >
                    {data.map((row, index) => (
                        <li
                            key={row}
                            className={`flex items-center px-3 py-2 cursor-pointer `}
                            onClick={() => {
                                setOpen(false);
                                onChange?.(index);
                            }}
                        >
                            <span className="text-foreground">{row}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;