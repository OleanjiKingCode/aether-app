/**
 * AetherDex Partner SDK Types
 * TypeScript interfaces for the SDK
 */

/**
 * SDK Configuration
 */
export interface AetherDexConfig {
  /** Partner identifier for tracking */
  partnerId: string;
  /** Optional: Override default API key */
  apiKey?: string;
  /** Optional: Enable debug logging */
  debug?: boolean;
}

/**
 * Quote Request Parameters
 */
export interface QuoteRequest {
  /** Source chain ID (e.g., 1 for Ethereum) */
  fromChainId: number;
  /** Destination chain ID */
  toChainId: number;
  /** Source token address */
  fromToken: string;
  /** Destination token address */
  toToken: string;
  /** Amount in wei/smallest unit */
  fromAmount: string;
  /** User's wallet address */
  fromAddress: string;
  /** Optional: Destination address (defaults to fromAddress) */
  toAddress?: string;
  /** Optional: Slippage in percentage (default 0.5) */
  slippage?: number;
}

/**
 * Token Info
 */
export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  chainId: number;
  logoURI?: string;
  priceUSD?: string;
}

/**
 * Quote Response
 */
export interface QuoteResponse {
  id: string;
  type: string;
  tool: string;
  action: {
    fromChainId: number;
    toChainId: number;
    fromToken: TokenInfo;
    toToken: TokenInfo;
    fromAmount: string;
    slippage: number;
    fromAddress: string;
    toAddress: string;
  };
  estimate: {
    fromAmount: string;
    toAmount: string;
    toAmountMin: string;
    approvalAddress: string;
    executionDuration: number;
    feeCosts: FeeCost[];
    gasCosts: GasCost[];
  };
  transactionRequest?: TransactionRequest;
}

/**
 * Fee Cost Info
 */
export interface FeeCost {
  name: string;
  description: string;
  percentage: string;
  token: TokenInfo;
  amount: string;
  amountUSD: string;
}

/**
 * Gas Cost Info
 */
export interface GasCost {
  type: string;
  estimate: string;
  limit: string;
  amount: string;
  amountUSD: string;
  price: string;
  token: TokenInfo;
}

/**
 * Transaction Request
 */
export interface TransactionRequest {
  from: string;
  to: string;
  data: string;
  value: string;
  gasLimit: string;
  gasPrice?: string;
  chainId: number;
}

/**
 * Swap Result
 */
export interface SwapResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

/**
 * Supported Chains
 */
export type ChainId = 
  | 1      // Ethereum
  | 10     // Optimism
  | 56     // BSC
  | 100    // Gnosis
  | 137    // Polygon
  | 250    // Fantom
  | 42161  // Arbitrum
  | 43114  // Avalanche
  | 1151111081099710; // Solana
