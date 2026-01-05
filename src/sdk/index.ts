/**
 * AetherDex Partner SDK
 * 
 * Integrate AetherDex aggregation into your application.
 * All fees (2%) go to AetherDex, partner volume is tracked via integrator tag.
 * 
 * @example
 * ```typescript
 * import { AetherDexSDK } from '@aetherdex/sdk';
 * 
 * const sdk = new AetherDexSDK({ partnerId: 'your-app-name' });
 * 
 * const quote = await sdk.getQuote({
 *   fromChainId: 1,
 *   toChainId: 137,
 *   fromToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
 *   toToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on Polygon
 *   fromAmount: '1000000000', // 1000 USDC (6 decimals)
 *   fromAddress: '0x...'
 * });
 * 
 * console.log('You will receive:', quote.estimate.toAmount);
 * ```
 */

import type {
    AetherDexConfig,
    QuoteRequest,
    QuoteResponse,
    TransactionRequest,
    TokenInfo,
} from './types';

// Re-export types for convenience
export * from './types';

// LI.FI API Configuration
const LIFI_API_URL = 'https://li.quest/v1';
const LIFI_API_KEY = '3b6d01c6-9d28-4de0-9df9-8bcabecb4be3.4fa6781c-0d9f-4dce-8793-6a953f224edc';
const AETHERDEX_FEE = 0.02; // 2% fee

/**
 * AetherDex Partner SDK
 * 
 * Provides cross-chain swap aggregation powered by LI.FI
 */
export class AetherDexSDK {
    private partnerId: string;
    private apiKey: string;
    private debug: boolean;
    private integrator: string;

    constructor(config: AetherDexConfig) {
        if (!config.partnerId) {
            throw new Error('partnerId is required');
        }

        this.partnerId = config.partnerId;
        this.apiKey = config.apiKey || LIFI_API_KEY;
        this.debug = config.debug || false;

        // Use registered integrator tag (partner ID stored separately for internal tracking)
        this.integrator = 'aetherDex';

        if (this.debug) {
            console.log(`[AetherDexSDK] Initialized with integrator: ${this.integrator}`);
        }
    }

    /**
     * Get a quote for a swap
     * 
     * @param request - Quote request parameters
     * @returns Quote response with estimated amounts and transaction data
     */
    async getQuote(request: QuoteRequest): Promise<QuoteResponse> {
        const params = new URLSearchParams({
            fromChain: request.fromChainId.toString(),
            toChain: request.toChainId.toString(),
            fromToken: request.fromToken,
            toToken: request.toToken,
            fromAmount: request.fromAmount,
            fromAddress: request.fromAddress,
            toAddress: request.toAddress || request.fromAddress,
            slippage: (request.slippage || 0.005).toString(),
            integrator: this.integrator,
            fee: AETHERDEX_FEE.toString(),
        });

        if (this.debug) {
            console.log(`[AetherDexSDK] Getting quote with params:`, Object.fromEntries(params));
        }

        const response = await fetch(`${LIFI_API_URL}/quote?${params.toString()}`, {
            method: 'GET',
            headers: {
                'x-lifi-api-key': this.apiKey,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`Quote failed: ${error.message || response.statusText}`);
        }

        const quote = await response.json();

        if (this.debug) {
            console.log(`[AetherDexSDK] Quote received:`, quote);
        }

        return quote;
    }

    /**
     * Get swap transaction data from a quote
     * 
     * @param quote - Quote response from getQuote()
     * @returns Transaction request ready to be sent
     */
    getSwapTransaction(quote: QuoteResponse): TransactionRequest | null {
        if (!quote.transactionRequest) {
            if (this.debug) {
                console.log(`[AetherDexSDK] No transaction in quote, may need approval first`);
            }
            return null;
        }

        return quote.transactionRequest;
    }

    /**
     * Get token approval transaction if needed
     * 
     * @param tokenAddress - Token to approve
     * @param approvalAddress - Spender address (from quote.estimate.approvalAddress)
     * @param amount - Amount to approve (use max uint256 for unlimited)
     * @param chainId - Chain ID
     * @returns Transaction request for approval
     */
    async getApprovalTransaction(
        tokenAddress: string,
        approvalAddress: string,
        amount: string,
        chainId: number
    ): Promise<TransactionRequest> {
        // Standard ERC20 approve function signature
        const approveAbi = '0x095ea7b3'; // approve(address,uint256)

        // Encode the approval data
        const paddedSpender = approvalAddress.slice(2).padStart(64, '0');
        const paddedAmount = BigInt(amount).toString(16).padStart(64, '0');
        const data = `${approveAbi}${paddedSpender}${paddedAmount}`;

        return {
            from: '', // Will be filled by the signer
            to: tokenAddress,
            data,
            value: '0',
            gasLimit: '100000',
            chainId,
        };
    }

    /**
     * Check if a token needs approval
     * 
     * @param quote - Quote response
     * @returns True if approval is needed
     */
    needsApproval(quote: QuoteResponse): boolean {
        // Native tokens don't need approval
        const nativeAddresses = [
            '0x0000000000000000000000000000000000000000',
            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        ];

        const fromToken = quote.action.fromToken.address.toLowerCase();
        return !nativeAddresses.includes(fromToken);
    }

    /**
     * Get available routes for a swap (multiple options)
     * 
     * @param request - Quote request parameters
     * @returns Array of possible routes
     */
    async getRoutes(request: QuoteRequest): Promise<QuoteResponse[]> {
        const params = new URLSearchParams({
            fromChainId: request.fromChainId.toString(),
            toChainId: request.toChainId.toString(),
            fromTokenAddress: request.fromToken,
            toTokenAddress: request.toToken,
            fromAmount: request.fromAmount,
            fromAddress: request.fromAddress,
            toAddress: request.toAddress || request.fromAddress,
            options: JSON.stringify({
                slippage: request.slippage || 0.005,
                integrator: this.integrator,
                fee: AETHERDEX_FEE,
            }),
        });

        const response = await fetch(`${LIFI_API_URL}/advanced/routes`, {
            method: 'POST',
            headers: {
                'x-lifi-api-key': this.apiKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fromChainId: request.fromChainId,
                toChainId: request.toChainId,
                fromTokenAddress: request.fromToken,
                toTokenAddress: request.toToken,
                fromAmount: request.fromAmount,
                fromAddress: request.fromAddress,
                toAddress: request.toAddress || request.fromAddress,
                options: {
                    slippage: request.slippage || 0.005,
                    integrator: this.integrator,
                    fee: AETHERDEX_FEE,
                },
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`Routes failed: ${error.message || response.statusText}`);
        }

        const data = await response.json();
        return data.routes || [];
    }

    /**
     * Get supported chains
     * 
     * @returns List of supported chain IDs
     */
    async getChains(): Promise<number[]> {
        const response = await fetch(`${LIFI_API_URL}/chains`, {
            headers: {
                'x-lifi-api-key': this.apiKey,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch chains');
        }

        const data = await response.json();
        return data.chains.map((chain: any) => chain.id);
    }

    /**
     * Get all supported tokens organized by chain
     * 
     * @returns Object with chain IDs as keys and token arrays as values
     * @example
     * ```typescript
     * const tokens = await sdk.getTokens();
     * console.log(tokens[1]); // All Ethereum tokens
     * console.log(tokens[137]); // All Polygon tokens
     * ```
     */
    async getTokens(): Promise<{ [chainId: number]: TokenInfo[] }> {
        const response = await fetch(`${LIFI_API_URL}/tokens`, {
            headers: {
                'x-lifi-api-key': this.apiKey,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tokens');
        }

        const data = await response.json();

        if (this.debug) {
            const chainCount = Object.keys(data.tokens).length;
            const tokenCount = Object.values(data.tokens).reduce((sum: number, tokens: any) => sum + tokens.length, 0);
            console.log(`[AetherDexSDK] Fetched ${tokenCount} tokens across ${chainCount} chains`);
        }

        return data.tokens;
    }

    /**
     * Get tokens for a specific chain
     * 
     * @param chainId - Chain ID (e.g., 1 for Ethereum, 137 for Polygon)
     * @returns List of tokens on that chain
     * @example
     * ```typescript
     * const ethTokens = await sdk.getTokensByChain(1);
     * const polygonTokens = await sdk.getTokensByChain(137);
     * ```
     */
    async getTokensByChain(chainId: number): Promise<TokenInfo[]> {
        const response = await fetch(`${LIFI_API_URL}/tokens?chains=${chainId}`, {
            headers: {
                'x-lifi-api-key': this.apiKey,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch tokens for chain ${chainId}`);
        }

        const data = await response.json();
        const tokens = data.tokens[chainId] || [];

        if (this.debug) {
            console.log(`[AetherDexSDK] Fetched ${tokens.length} tokens for chain ${chainId}`);
        }

        return tokens;
    }

    /**
     * Get all tokens as a flat array (useful for search/filtering)
     * 
     * @returns Flat array of all tokens from all chains
     * @example
     * ```typescript
     * const allTokens = await sdk.getAllTokens();
     * const usdcTokens = allTokens.filter(t => t.symbol === 'USDC');
     * ```
     */
    async getAllTokens(): Promise<TokenInfo[]> {
        const tokensByChain = await this.getTokens();
        const allTokens: TokenInfo[] = [];

        for (const tokens of Object.values(tokensByChain)) {
            allTokens.push(...tokens);
        }

        if (this.debug) {
            console.log(`[AetherDexSDK] Total tokens across all chains: ${allTokens.length}`);
        }

        return allTokens;
    }

    /**
     * Search for a token by symbol across all chains
     * 
     * @param symbol - Token symbol (e.g., 'USDC', 'ETH')
     * @param chainId - Optional: limit search to specific chain
     * @returns Array of matching tokens
     * @example
     * ```typescript
     * const usdcTokens = await sdk.searchToken('USDC');
     * const ethUSDC = await sdk.searchToken('USDC', 1); // Only on Ethereum
     * ```
     */
    async searchToken(symbol: string, chainId?: number): Promise<TokenInfo[]> {
        const tokens = chainId 
            ? await this.getTokensByChain(chainId)
            : await this.getAllTokens();

        const matches = tokens.filter(
            token => token.symbol.toLowerCase() === symbol.toLowerCase()
        );

        if (this.debug) {
            console.log(`[AetherDexSDK] Found ${matches.length} tokens matching '${symbol}'`);
        }

        return matches;
    }

    /**
     * Get the integrator tag being used
     * Useful for tracking in LI.FI dashboard
     */
    getIntegrator(): string {
        return this.integrator;
    }

    /**
     * Get partner ID
     */
    getPartnerId(): string {
        return this.partnerId;
    }

    /**
     * Format token amount for display
     * 
     * @param amount - Amount in wei/smallest unit
     * @param decimals - Token decimals
     * @param displayDecimals - Decimals to show (default 6)
     */
    static formatAmount(amount: string, decimals: number, displayDecimals: number = 6): string {
        const value = parseFloat(amount) / Math.pow(10, decimals);
        return value.toFixed(displayDecimals);
    }

    /**
     * Parse token amount to wei
     * 
     * @param amount - Human readable amount
     * @param decimals - Token decimals
     */
    static parseAmount(amount: string, decimals: number): string {
        const value = parseFloat(amount) * Math.pow(10, decimals);
        return Math.floor(value).toString();
    }

    /**
     * Get status of a swap transaction
     * 
     * @param txHash - Transaction hash
     * @param fromChainId - Source chain ID
     * @param toChainId - Destination chain ID (optional, defaults to fromChainId)
     * @returns Swap status with details
     * @example
     * ```typescript
     * const status = await sdk.getSwapStatus('0x123...', 1, 137);
     * console.log(status.status); // 'PENDING' | 'DONE' | 'FAILED'
     * ```
     */
    async getSwapStatus(
        txHash: string,
        fromChainId: number,
        toChainId?: number
    ): Promise<{
        status: 'NOT_FOUND' | 'PENDING' | 'DONE' | 'FAILED';
        substatus?: string;
        substatusMessage?: string;
        sending?: any;
        receiving?: any;
        lifiExplorerLink?: string;
        fromAddress?: string;
        toAddress?: string;
        tool?: string;
    }> {
        const params = new URLSearchParams({
            txHash,
            fromChain: fromChainId.toString(),
            toChain: (toChainId || fromChainId).toString(),
        });

        const response = await fetch(`${LIFI_API_URL}/status?${params.toString()}`, {
            headers: {
                'x-lifi-api-key': this.apiKey,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return { status: 'NOT_FOUND' };
            }
            throw new Error('Failed to fetch swap status');
        }

        const data = await response.json();

        if (this.debug) {
            console.log(`[AetherDexSDK] Swap status for ${txHash}:`, data.status);
        }

        return {
            status: data.status || 'PENDING',
            substatus: data.substatus,
            substatusMessage: data.substatusMessage,
            sending: data.sending,
            receiving: data.receiving,
            lifiExplorerLink: data.lifiExplorerLink,
            fromAddress: data.fromAddress,
            toAddress: data.toAddress,
            tool: data.tool,
        };
    }

    /**
     * Get recent swap/transaction history for a wallet
     * 
     * @param walletAddress - Wallet address to check
     * @param options - Optional filters
     * @returns Array of recent swaps and transfers
     * @example
     * ```typescript
     * const history = await sdk.getWalletSwaps('0x123...', { limit: 10 });
     * history.forEach(swap => {
     *   console.log(swap.type, swap.amountUsd, swap.timestamp);
     * });
     * ```
     */
    async getWalletSwaps(
        walletAddress: string,
        options?: {
            limit?: number;
            offset?: number;
            order?: 'asc' | 'desc';
        }
    ): Promise<Array<{
        txHash: string;
        chainId: number;
        timestamp: string;
        timestampMs: number;
        type: 'swap' | 'transfer';
        tokenIn?: { symbol: string; name: string; amount: number; amountUsd: number; logo?: string };
        tokenOut?: { symbol: string; name: string; amount: number; amountUsd: number; logo?: string };
        amountUsd: number;
        explorerUrl: string;
    }>> {
        const params = new URLSearchParams({
            wallet: walletAddress,
            limit: String(options?.limit || 10),
        });

        if (options?.offset !== undefined) {
            params.append('offset', String(options.offset));
        }
        if (options?.order) {
            params.append('order', options.order);
        }

        const response = await fetch(
            `https://explorer-api.mobula.io/api/2/wallet/activity?${params.toString()}`,
            {
                headers: {
                    'Authorization': '232d6e6d-c1cf-45be-b5d7-49e473d2c7f5',
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch wallet activity');
        }

        const result = await response.json();
        const activities = result.data || [];

        // Format the response
        const swaps = activities.map((activity: any) => {
            const action = activity.actions?.[0];
            const chainId = this.parseChainId(activity.chainId);
            
            const formatted: any = {
                txHash: activity.txHash,
                chainId,
                timestamp: activity.txDateIso,
                timestampMs: activity.txDateMs,
                type: action?.model || 'transfer',
                amountUsd: action?.swapAmountUsd || action?.transferAmountUsd || 0,
                explorerUrl: this.getExplorerUrl(chainId, activity.txHash),
            };

            if (action?.model === 'swap') {
                formatted.tokenIn = {
                    symbol: action.swapAssetIn?.symbol,
                    name: action.swapAssetIn?.name,
                    amount: action.swapAmountIn,
                    amountUsd: action.swapAmountUsd,
                    logo: action.swapAssetIn?.logo,
                };
                formatted.tokenOut = {
                    symbol: action.swapAssetOut?.symbol,
                    name: action.swapAssetOut?.name,
                    amount: action.swapAmountOut,
                    amountUsd: action.swapAmountUsd,
                    logo: action.swapAssetOut?.logo,
                };
            }

            return formatted;
        });

        if (this.debug) {
            console.log(`[AetherDexSDK] Found ${swaps.length} swaps for ${walletAddress}`);
        }

        return swaps;
    }

    /**
     * Parse chain ID from various formats
     */
    private parseChainId(chainId: string | number): number {
        if (typeof chainId === 'number') return chainId;
        // Handle formats like "evm:1" or "1"
        const parts = chainId.split(':');
        return parseInt(parts[parts.length - 1]);
    }

    /**
     * Get explorer URL for a transaction
     */
    private getExplorerUrl(chainId: number, txHash: string): string {
        const explorers: { [key: number]: string } = {
            1: `https://etherscan.io/tx/${txHash}`,
            56: `https://bscscan.com/tx/${txHash}`,
            137: `https://polygonscan.com/tx/${txHash}`,
            42161: `https://arbiscan.io/tx/${txHash}`,
            10: `https://optimistic.etherscan.io/tx/${txHash}`,
            8453: `https://basescan.org/tx/${txHash}`,
            43114: `https://snowtrace.io/tx/${txHash}`,
            250: `https://ftmscan.com/tx/${txHash}`,
        };
        return explorers[chainId] || `https://blockscan.com/tx/${txHash}`;
    }

    /**
     * Get balance of a specific token for a wallet
     * 
     * @param walletAddress - Wallet address
     * @param tokenAddress - Token contract address (use native address for ETH)
     * @param chainId - Chain ID
     * @returns Token balance with USD value
     * @example
     * ```typescript
     * // Get USDC balance on Base
     * const balance = await sdk.getTokenBalance(
     *   '0x123...',
     *   '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
     *   8453
     * );
     * console.log(balance.formatted, balance.usd);
     * ```
     */
    async getTokenBalance(
        walletAddress: string,
        tokenAddress: string,
        chainId: number
    ): Promise<{
        balance: string;
        formatted: string;
        usd: number;
        decimals: number;
        symbol: string;
        name: string;
        logo?: string;
    }> {
        // Get wallet portfolio and find the specific token
        const portfolio = await this.getWalletBalances(walletAddress, this.getChainName(chainId));
        
        const normalizedAddress = tokenAddress.toLowerCase();
        const isNative = normalizedAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' ||
                         normalizedAddress === '0x0000000000000000000000000000000000000000';

        const token = portfolio.tokens.find(t => {
            if (isNative) {
                // For native tokens, match by checking if contract is native
                return t.symbol.toUpperCase() === 'ETH' || 
                       t.address?.toLowerCase() === normalizedAddress;
            }
            return t.address?.toLowerCase() === normalizedAddress;
        });

        if (!token) {
            return {
                balance: '0',
                formatted: '0',
                usd: 0,
                decimals: 18,
                symbol: 'UNKNOWN',
                name: 'Unknown Token',
            };
        }

        return {
            balance: token.balance,
            formatted: token.formatted,
            usd: token.usd,
            decimals: token.decimals,
            symbol: token.symbol,
            name: token.name,
            logo: token.logo,
        };
    }

    /**
     * Get all token balances for a wallet
     * 
     * @param walletAddress - Wallet address
     * @param blockchain - Optional: Filter by blockchain (e.g., 'base', 'ethereum')
     * @returns Total USD value and list of tokens
     * @example
     * ```typescript
     * const portfolio = await sdk.getWalletBalances('0x123...');
     * console.log('Total:', portfolio.totalUsd);
     * portfolio.tokens.forEach(t => {
     *   console.log(t.symbol, t.formatted, t.usd);
     * });
     * ```
     */
    async getWalletBalances(
        walletAddress: string,
        blockchain?: string
    ): Promise<{
        totalUsd: number;
        tokens: Array<{
            address: string;
            symbol: string;
            name: string;
            balance: string;
            formatted: string;
            usd: number;
            decimals: number;
            logo?: string;
            chainId?: number;
            priceChange24h?: number;
        }>;
    }> {
        const params = new URLSearchParams({
            wallet: walletAddress,
        });

        if (blockchain) {
            params.append('blockchains', blockchain);
        }

        const response = await fetch(
            `https://production-api.mobula.io/api/1/wallet/portfolio?${params.toString()}`,
            {
                headers: {
                    'Authorization': '232d6e6d-c1cf-45be-b5d7-49e473d2c7f5',
                    'Content-Type': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch wallet balances');
        }

        const result = await response.json();
        const data = result.data || result;

        const tokens = (data.assets || []).map((asset: any) => ({
            address: asset.asset?.contracts?.[0]?.address || '',
            symbol: asset.asset?.symbol || 'UNKNOWN',
            name: asset.asset?.name || 'Unknown',
            balance: String(asset.token_balance || 0),
            formatted: this.formatBalance(asset.token_balance, asset.asset?.contracts?.[0]?.decimals || 18),
            usd: asset.estimated_balance || 0,
            decimals: asset.asset?.contracts?.[0]?.decimals || 18,
            logo: asset.asset?.logo,
            chainId: this.getChainIdFromBlockchain(asset.asset?.contracts?.[0]?.blockchain),
            priceChange24h: asset.price_change_24h,
        }));

        if (this.debug) {
            console.log(`[AetherDexSDK] Found ${tokens.length} tokens for ${walletAddress}, total: $${data.total_wallet_balance}`);
        }

        return {
            totalUsd: data.total_wallet_balance || 0,
            tokens,
        };
    }

    /**
     * Format balance with appropriate decimals
     */
    private formatBalance(balance: number, decimals: number): string {
        if (!balance) return '0';
        // For display, show up to 6 decimal places
        return balance.toFixed(Math.min(decimals, 6));
    }

    /**
     * Get chain name from chain ID
     */
    private getChainName(chainId: number): string {
        const chains: { [key: number]: string } = {
            1: 'ethereum',
            56: 'bsc',
            137: 'polygon',
            42161: 'arbitrum',
            10: 'optimism',
            8453: 'base',
            43114: 'avalanche',
            250: 'fantom',
        };
        return chains[chainId] || 'ethereum';
    }

    /**
     * Get chain ID from blockchain name
     */
    private getChainIdFromBlockchain(blockchain: string): number {
        if (!blockchain) return 1;
        const chains: { [key: string]: number } = {
            'ethereum': 1,
            'eth': 1,
            'bsc': 56,
            'bnb': 56,
            'polygon': 137,
            'matic': 137,
            'arbitrum': 42161,
            'optimism': 10,
            'base': 8453,
            'avalanche': 43114,
            'fantom': 250,
        };
        return chains[blockchain.toLowerCase()] || 1;
    }
}

// Default export
export default AetherDexSDK;
