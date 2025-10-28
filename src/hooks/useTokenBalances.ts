import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { getTokenBalancesAlchemy, getTokenBalancesMoralis, TokenBalance } from '@/services/token.service';

/**
 * Hook to get token balances from EVM chains
 * 
 * Usage:
 * const { tokens, assetCount, isLoading, refetch } = useTokenBalances();
 */

export const useTokenBalances = (provider: 'alchemy' | 'moralis' = 'alchemy') => {
  const { address, isConnected, chain } = useAccount();
  
  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch token balances
   */
  const fetchTokens = useCallback(async () => {
    if (!address || !isConnected) {
      setTokens([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const chainId = chain?.id || 1;
      let tokenBalances: TokenBalance[] = [];

      if (provider === 'alchemy') {
        tokenBalances = await getTokenBalancesAlchemy(address, chainId);
      } else if (provider === 'moralis') {
        tokenBalances = await getTokenBalancesMoralis(address, chainId);
      }

      setTokens(tokenBalances);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch tokens';
      setError(errorMsg);
      console.error('Error fetching tokens:', err);
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected, chain, provider]);

  /**
   * Get total asset count (tokens + native)
   */
  const assetCount = tokens.length + (isConnected ? 1 : 0); // +1 for native token (ETH/MATIC/etc)

  /**
   * Get unique chains count
   * (This is simplified - you'd track multiple chains separately for multi-chain support)
   */
  const chainsCount = isConnected ? 1 : 0;

  // Fetch on mount and when wallet changes
  useEffect(() => {
    if (isConnected) {
      fetchTokens();
    }
  }, [isConnected, fetchTokens]);

  return {
    tokens,
    assetCount,
    chainsCount,
    isLoading,
    error,
    refetch: fetchTokens,
  };
};

export default useTokenBalances;

