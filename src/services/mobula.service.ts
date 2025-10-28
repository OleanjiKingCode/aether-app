/**
 * Mobula API Service - Fetches wallet portfolio and activity data
 * Documentation: https://docs.mobula.io
 */

const MOBULA_API_KEY = '232d6e6d-c1cf-45be-b5d7-49e473d2c7f5';
const MOBULA_BASE_URL = 'https://production-api.mobula.io/api/1';
const MOBULA_EXPLORER_URL = 'https://explorer-api.mobula.io/api/2';

export interface WalletPortfolio {
  total_wallet_balance: number;
  wallets: string[];
  assets?: Array<{
    allocation: number;
    asset: {
      id: number;
      name: string;
      symbol: string;
      logo?: string;
    };
    estimated_balance: number;
    token_balance: number;
    price: number;
    price_change_24h?: number;
    contracts_balances?: any[];
    cross_chain_balances?: any;
  }>;
  balances_length?: number;
  backfill_status?: 'processed' | 'processing' | 'pending';
}

export interface WalletActivity {
  chainId: string;
  txHash: string;
  txDateMs: number;
  txDateIso: string;
  txFeesNativeUsd: number;
  actions: Array<{
    model: 'swap' | 'transfer';
    swapType?: string;
    swapAmountIn?: number;
    swapAmountOut?: number;
    swapAmountUsd?: number;
    swapAssetIn?: any;
    swapAssetOut?: any;
    transferType?: string;
    transferAmount?: number;
    transferAmountUsd?: number;
    transferAsset?: any;
  }>;
}

class MobulaService {
  private static instance: MobulaService;

  private constructor() {}

  static getInstance(): MobulaService {
    if (!MobulaService.instance) {
      MobulaService.instance = new MobulaService();
    }
    return MobulaService.instance;
  }

  /**
   * Get wallet portfolio (holdings and total balance)
   */
  async getWalletPortfolio(
    walletAddress: string,
    options?: {
      blockchains?: string; // e.g., "ethereum,bsc,polygon"
      cache?: boolean;
      stale?: number;
    }
  ): Promise<WalletPortfolio> {
    try {
      const params = new URLSearchParams({
        wallet: walletAddress,
      });

      if (options?.blockchains) {
        params.append('blockchains', options.blockchains);
      }
      if (options?.cache !== undefined) {
        params.append('cache', String(options.cache));
      }
      if (options?.stale !== undefined) {
        params.append('stale', String(options.stale));
      }

      const response = await fetch(
        `${MOBULA_BASE_URL}/wallet/portfolio?${params.toString()}`,
        {
          headers: {
            'Authorization': MOBULA_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Mobula API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Mobula portfolio API response:', data);
      
      // Return the data object which contains the portfolio info
      if (data.data) {
        return data.data;
      }
      
      return data;
    } catch (error) {
      console.error('Failed to fetch wallet portfolio:', error);
      throw error;
    }
  }

  /**
   * Get wallet total USD balance
   */
  async getWalletBalance(
    walletAddress: string,
    blockchains?: string
  ): Promise<number> {
    try {
      const portfolio = await this.getWalletPortfolio(walletAddress, {
        blockchains,
        cache: true,
        stale: 60, // Cache for 1 minute
      });
      return portfolio.total_wallet_balance || 0;
    } catch (error) {
      console.error('Failed to fetch wallet balance:', error);
      return 0;
    }
  }

  /**
   * Get wallet historical net worth
   */
  async getWalletHistory(
    walletAddress: string,
    options?: {
      from?: number | string;
      to?: number | string;
      period?: '5min' | '15min' | '1h' | '6h' | '1d' | '7d';
      blockchains?: string;
      cache?: boolean;
      stale?: number;
    }
  ): Promise<{
    balance_usd: number;
    balance_history: number[][];
    backfill_status: string;
    all_time_high?: number;
  }> {
    try {
      const params = new URLSearchParams({
        wallet: walletAddress,
      });

      if (options?.from !== undefined) {
        params.append('from', String(options.from));
      }
      if (options?.to !== undefined) {
        params.append('to', String(options.to));
      }
      if (options?.period) {
        params.append('period', options.period);
      }
      if (options?.blockchains) {
        params.append('blockchains', options.blockchains);
      }
      if (options?.cache !== undefined) {
        params.append('cache', String(options.cache));
      }
      if (options?.stale !== undefined) {
        params.append('stale', String(options.stale));
      }

      const response = await fetch(
        `https://explorer-api.mobula.io/api/1/wallet/history?${params.toString()}`,
        {
          headers: {
            'Authorization': MOBULA_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Mobula API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Wallet history API response:', result);

      const data = result.data || result;
      
      // Calculate all-time high from balance history
      let allTimeHigh = data.balance_usd || 0;
      if (data.balance_history && Array.isArray(data.balance_history)) {
        data.balance_history.forEach((entry: number[]) => {
          const balance = entry[1]; // [timestamp, balance]
          if (balance > allTimeHigh) {
            allTimeHigh = balance;
          }
        });
      }

      return {
        balance_usd: data.balance_usd || 0,
        balance_history: data.balance_history || [],
        backfill_status: data.backfill_status || 'pending',
        all_time_high: allTimeHigh,
      };
    } catch (error) {
      console.error('Failed to fetch wallet history:', error);
      return {
        balance_usd: 0,
        balance_history: [],
        backfill_status: 'failed',
        all_time_high: 0,
      };
    }
  }

  /**
   * Get wallet activity (transactions, swaps, transfers)
   */
  async getWalletActivity(
    walletAddress: string,
    options?: {
      limit?: number;
      page?: number;
      offset?: number;
      order?: 'asc' | 'desc';
      filterSpam?: boolean;
      unlistedAssets?: boolean;
    }
  ): Promise<{ data: WalletActivity[]; pagination: any }> {
    try {
      const params = new URLSearchParams({
        wallet: walletAddress,
        limit: String(options?.limit || 10),
      });

      if (options?.page !== undefined) {
        params.append('page', String(options.page));
      }
      if (options?.offset !== undefined) {
        params.append('offset', String(options.offset));
      }
      if (options?.order) {
        params.append('order', options.order);
      }
      if (options?.filterSpam !== undefined) {
        params.append('filterSpam', String(options.filterSpam));
      }
      if (options?.unlistedAssets !== undefined) {
        params.append('unlistedAssets', String(options.unlistedAssets));
      }

      const response = await fetch(
        `${MOBULA_EXPLORER_URL}/wallet/activity?${params.toString()}`,
        {
          headers: {
            'Authorization': MOBULA_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Mobula API error: ${response.status}`);
      }

      const result = await response.json();
      return {
        data: result.data || [],
        pagination: result.pagination || {},
      };
    } catch (error) {
      console.error('Failed to fetch wallet activity:', error);
      return { data: [], pagination: {} };
    }
  }

  /**
   * Format chain ID from Mobula format (evm:1) to number (1)
   */
  formatChainId(mobulaChainId: string): number {
    const parts = mobulaChainId.split(':');
    return parseInt(parts[parts.length - 1]);
  }

  /**
   * Get explorer URL for transaction
   */
  getExplorerUrl(chainId: number, txHash: string): string {
    const explorers: { [key: number]: string } = {
      1: `https://etherscan.io/tx/${txHash}`,
      56: `https://bscscan.com/tx/${txHash}`,
      137: `https://polygonscan.com/tx/${txHash}`,
      42161: `https://arbiscan.io/tx/${txHash}`,
      10: `https://optimistic.etherscan.io/tx/${txHash}`,
      8453: `https://basescan.org/tx/${txHash}`,
      43114: `https://snowtrace.io/tx/${txHash}`,
    };
    return explorers[chainId] || '#';
  }
}

// Export singleton instance
export const mobulaService = MobulaService.getInstance();
export default mobulaService;

