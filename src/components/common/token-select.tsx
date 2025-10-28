import React, { useState, useRef, useEffect } from "react";

interface SelectProps {
    data: any[];
    value?: any;
    onChange?: (value: string) => void;
    className?: string;
}

const TokenSelect = ({ data, value, onChange, className }: SelectProps) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (
                !buttonRef.current?.contains(e.target as Node) &&
                !listRef.current?.contains(e.target as Node)
            ) {
                setOpen(false);
                setSearchQuery(""); // Clear search when closing
            }
        }
        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (open && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [open]);

    // Filter tokens by search query (symbol, name, or address)
    const filteredData = data.filter((token) => {
        if (!searchQuery) return true;
        
        const query = searchQuery.toLowerCase();
        const matchSymbol = token.symbol?.toLowerCase().includes(query);
        const matchName = token.name?.toLowerCase().includes(query);
        const matchAddress = token.address?.toLowerCase().includes(query);
        
        return matchSymbol || matchName || matchAddress;
    });

    const selected = value || data[0] || { symbol: 'Select Token', name: 'Select a token' };

    return (
        <div className={`relative w-full 2xl:w-full ${className || ""}`}>
            <button
                ref={buttonRef}
                type="button"
                className={`flex items-center justify-between w-full border border-input px-3 py-2 bg-transparent text-foreground text-sm ${
                    data.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={() => data.length > 0 && setOpen((v) => !v)}
            >
                <span className="flex items-center gap-2">
                    {selected && (<>
                        {selected.logoURI ? (
                            <img 
                                src={selected.logoURI} 
                                alt={selected.symbol} 
                                width={20} 
                                height={20} 
                                className="w-5 h-5 rounded-full object-cover"
                                onError={(e) => {
                                    // Fallback to a placeholder if image fails to load
                                    e.currentTarget.style.display = 'none'
                                }}
                            />
                        ) : (
                            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                                {selected.symbol.charAt(0)}
                            </div>
                        )}
                        <span>
                            <span className="text-foreground font-medium">{selected.symbol}</span>
                            <span className="mx-1 text-muted-foreground">·</span>
                            <span className="text-muted-foreground opacity-50">{selected.name}</span>
                        </span>
                    </>)}
                    {!selected && <span className="text-foreground font-medium">Loading ...</span>}
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
                <div
                    ref={listRef}
                    className="absolute z-10 mt-1 w-full bg-background border border-input shadow-lg max-h-80 overflow-hidden flex flex-col"
                >
                    {/* Search Input */}
                    <div className="p-2 border-b border-input sticky top-0 bg-background">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search by name, symbol, or address..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-background border border-input px-3 py-2 text-sm outline-none rounded focus:border-primary transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    
                    {/* Token List */}
                    <ul className="overflow-auto max-h-60">
                        {filteredData.length === 0 && (
                            <li className="px-3 py-4 text-center text-muted-foreground text-sm">
                                No tokens found
                            </li>
                        )}
                        {filteredData.map((row, index) => (
                        <li
                            key={row.symbol + '_' + index}
                            className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-accent`}
                            onClick={() => {
                                setOpen(false);
                                setSearchQuery("");
                                onChange?.(row.name);
                            }}
                        >
                            {row.logoURI ? (
                                <img 
                                    src={row.logoURI} 
                                    alt={row.symbol} 
                                    width={20} 
                                    height={20} 
                                    className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                                    onError={(e) => {
                                        // Fallback to a placeholder if image fails to load
                                        e.currentTarget.style.display = 'none'
                                    }}
                                />
                            ) : (
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs flex-shrink-0">
                                    {row.symbol.charAt(0)}
                                </div>
                            )}
                            <div className="flex flex-col flex-1 min-w-0">
                                <div>
                                    <span className="text-foreground font-medium">{row.symbol}</span>
                                    <span className="mx-1 text-muted-foreground">·</span>
                                    <span className="text-muted-foreground opacity-50">{row.name}</span>
                                </div>
                                {searchQuery && row.address && (
                                    <div className="text-[10px] text-muted-foreground opacity-50 truncate">
                                        {row.address}
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default TokenSelect;