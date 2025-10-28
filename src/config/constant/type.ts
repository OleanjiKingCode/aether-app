export interface TokenType {
    name: string;
    symbol: string;
    logoURI?: string;
    address?: string;
    chainId?: number;
    decimals?: number;
}


export interface NetworkType {
    name: string;
    icon?: string | null;
    logoURI?: string | null;  // Added for compatibility with NetworkSelect component
    chainId?: number;
}