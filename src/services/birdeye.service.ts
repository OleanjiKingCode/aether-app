/**
 * BirdEye API Service - Fetches token insights and trending data
 * Documentation: https://docs.birdeye.so
 */

const BIRDEYE_API_KEY = '10e706e7e81d44a5a8bca5542f42caa4';
const BIRDEYE_BASE_URL = 'https://public-api.birdeye.so';

export interface TrendingToken {
  address: string;
  symbol: string;
  name: string;
  logoURI?: string;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  marketCap?: number;
  rank?: number;
}

export interface TokenOverview {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  holder: number;
  logoURI?: string;
}

export interface TokenMarket {
  address: string;
  name: string;
  liquidity: number;
  volume24h: number;
  trade24h: number;
  uniqueWallet24h: number;
  base: {
    address: string;
    symbol: string;
    decimals: number;
    icon?: string;
  };
  quote: {
    address: string;
    symbol: string;
    decimals: number;
    icon?: string;
  };
  source: string;
}

class BirdEyeService {
  private static instance: BirdEyeService;

  private constructor() {}

  static getInstance(): BirdEyeService {
    if (!BirdEyeService.instance) {
      BirdEyeService.instance = new BirdEyeService();
    }
    return BirdEyeService.instance;
  }


  /**
   * Get trending tokens on Solana
   */
  async getTrendingTokens(
    limit: number = 10,
    sortBy: 'rank' | 'volume24hUSD' | 'liquidity' = 'rank'
  ): Promise<TrendingToken[]> {
    try {
      // Limit must be between 1-20 according to API docs
      const validLimit = Math.min(Math.max(1, limit), 20);
      
      // Use correct endpoint: /defi/token_trending
      const response = await fetch(
        `${BIRDEYE_BASE_URL}/defi/token_trending?sort_by=${sortBy}&sort_type=desc&offset=0&limit=${validLimit}`,
        {
          headers: {
            'X-API-KEY': BIRDEYE_API_KEY,
            'x-chain': 'solana', // Required header
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.warn(`BirdEye API returned ${response.status}`);
        return [];
      }

      const data = await response.json();
      console.log('BirdEye trending tokens response:', data);

      // Parse response structure from API docs
      if (data.data?.tokens && Array.isArray(data.data.tokens)) {
        return data.data.tokens.slice(0, limit).map((item: any) => ({
          address: item.address,
          symbol: item.symbol,
          name: item.name,
          logoURI: item.logoURI,
          price: item.price || 0,
          priceChange24h: item.price24hChangePercent || 0, // Correct field name
          volume24h: item.volume24hUSD || 0, // Correct field name
          liquidity: item.liquidity || 0,
          marketCap: item.marketcap || item.fdv || 0,
          rank: item.rank,
        })).filter((token: TrendingToken) => token.price > 0); // Filter out invalid tokens
      }

      console.warn('Unexpected API response structure');
      return [];
    } catch (error) {
      console.error('Failed to fetch trending tokens:', error);
      return [];
    }
  }

  /**
   * Get token overview/details
   */
  async getTokenOverview(tokenAddress: string): Promise<TokenOverview | null> {
    try {
      const response = await fetch(
        `${BIRDEYE_BASE_URL}/defi/token_overview?address=${tokenAddress}`,
        {
          headers: {
            'X-API-KEY': BIRDEYE_API_KEY,
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`BirdEye API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('BirdEye token overview:', data);

      if (data.data) {
        return {
          address: data.data.address,
          symbol: data.data.symbol,
          name: data.data.name,
          decimals: data.data.decimals,
          price: data.data.price || 0,
          priceChange24h: data.data.priceChange24hPercent || 0,
          volume24h: data.data.v24hUSD || 0,
          liquidity: data.data.liquidity || 0,
          marketCap: data.data.mc || 0,
          holder: data.data.holder || 0,
          logoURI: data.data.logoURI,
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch token overview:', error);
      return null;
    }
  }

  /**
   * Get top gainers (tokens with highest 24h price increase)
   */
  async getTopGainers(limit: number = 5): Promise<TrendingToken[]> {
    try {
      // Fetch trending tokens (max 20 per API limit)
      const trending = await this.getTrendingTokens(20, 'rank');
      
      if (trending.length === 0) {
        return [];
      }
      
      return trending
        .filter(token => token.priceChange24h > 0)
        .sort((a, b) => b.priceChange24h - a.priceChange24h)
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch top gainers:', error);
      return [];
    }
  }

  /**
   * Get tokens by volume
   */
  async getTopVolumeTokens(limit: number = 5): Promise<TrendingToken[]> {
    try {
      const trending = await this.getTrendingTokens(limit, 'volume24hUSD');
      return trending;
    } catch (error) {
      console.error('Failed to fetch top volume tokens:', error);
      return [];
    }
  }

  /**
   * Get all markets for a specific token
   */
  async getTokenMarkets(
    tokenAddress: string,
    sortBy: 'liquidity' | 'volume24h' = 'liquidity',
    limit: number = 10
  ): Promise<TokenMarket[]> {
    try {
      const validLimit = Math.min(Math.max(1, limit), 20);
      
      const response = await fetch(
        `${BIRDEYE_BASE_URL}/defi/v2/markets?address=${tokenAddress}&time_frame=24h&sort_type=desc&sort_by=${sortBy}&offset=0&limit=${validLimit}`,
        {
          headers: {
            'X-API-KEY': BIRDEYE_API_KEY,
            'x-chain': 'solana',
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        console.warn(`BirdEye Markets API returned ${response.status}`);
        return [];
      }

      const data = await response.json();
      console.log('BirdEye markets response:', data);

      if (data.data?.items && Array.isArray(data.data.items)) {
        return data.data.items.map((item: any) => ({
          address: item.address,
          name: item.name,
          liquidity: item.liquidity || 0,
          volume24h: item.volume24h || 0,
          trade24h: item.trade24h || 0,
          uniqueWallet24h: item.uniqueWallet24h || 0,
          base: {
            address: item.base?.address || '',
            symbol: item.base?.symbol || '',
            decimals: item.base?.decimals || 9,
            icon: item.base?.icon,
          },
          quote: {
            address: item.quote?.address || '',
            symbol: item.quote?.symbol || '',
            decimals: item.quote?.decimals || 9,
            icon: item.quote?.icon,
          },
          source: item.source || '',
        }));
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch token markets:', error);
      return [];
    }
  }

  /**
   * Get high opportunity tokens (high liquidity and volume)
   */
  async getHighOpportunityTokens(limit: number = 3): Promise<TrendingToken[]> {
    try {
      const trending = await this.getTrendingTokens(20, 'liquidity');
      
      // Filter for tokens with both high liquidity (>$100k) and volume (>$50k)
      return trending
        .filter(token => token.liquidity >= 100000 && token.volume24h >= 50000)
        .slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch high opportunity tokens:', error);
      return [];
    }
  }

  /**
   * Format large numbers for display
   */
  formatNumber(num: number): string {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  }

  /**
   * Format percentage
   */
  formatPercentage(percent: number): string {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  }
}

// Export singleton instance
export const birdeyeService = BirdEyeService.getInstance();
export default birdeyeService;

