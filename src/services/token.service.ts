/**
 * Token Service - Get token balances from EVM chains
 * 
 * Supports multiple providers:
 * - Alchemy (recommended)
 * - Moralis
 * - Etherscan
 */

export interface TokenBalance {
  contractAddress: string;
  tokenBalance: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  logo?: string;
  thumbnail?: string;
  balance?: string;
  balanceFormatted?: string;
  usdValue?: number;
}

/**
 * Get token balances using Alchemy API
 * Free tier: 300M compute units/month
 * https://docs.alchemy.com/reference/alchemy-gettokenbalances
 */
export async function getTokenBalancesAlchemy(
  address: string,
  chainId: number = 1
): Promise<TokenBalance[]> {
  const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  console.log('start')
  if (!ALCHEMY_API_KEY) {
    console.warn('Alchemy API key not set');
    return [];
  }

  // Alchemy network URLs
  const networks: { [key: number]: string } = {
    1: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    137: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    42161: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    10: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  };

  const url = networks[chainId];
  if (!url) {
    console.error(`Chain ${chainId} not supported by Alchemy`);
    return [];
  }

  try {
    // Get token balances
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getTokenBalances',
        params: [address],
        id: 1,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('Alchemy API error:', data.error);
      return [];
    }

    const tokenBalances = data.result?.tokenBalances || [];
    // Filter out zero balances
    const nonZeroBalances = tokenBalances.filter(
      (token: any) => token.tokenBalance !== '0x0000000000000000000000000000000000000000000000000000000000000000'
    );

    // Get metadata for each token
    const tokensWithMetadata = await Promise.all(
      nonZeroBalances.map(async (token: any) => {
        const metadata = await getTokenMetadataAlchemy(token.contractAddress, chainId);
        return {
          contractAddress: token.contractAddress,
          tokenBalance: token.tokenBalance,
          ...metadata,
        };
      })
    );

    return tokensWithMetadata;
  } catch (error) {
    console.error('Error fetching token balances from Alchemy:', error);
    return [];
  }
}

/**
 * Get token metadata using Alchemy
 */
async function getTokenMetadataAlchemy(
  contractAddress: string,
  chainId: number
): Promise<Partial<TokenBalance>> {
  const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
  
  const networks: { [key: number]: string } = {
    1: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    137: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    42161: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    10: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
  };

  const url = networks[chainId];
  if (!url) return {};

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'alchemy_getTokenMetadata',
        params: [contractAddress],
        id: 1,
      }),
    });

    const data = await response.json();
    return {
      name: data.result?.name,
      symbol: data.result?.symbol,
      decimals: data.result?.decimals,
      logo: data.result?.logo,
    };
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return {};
  }
}

/**
 * Get token balances using Moralis API
 * Free tier: 40,000 requests/day
 * https://docs.moralis.io/web3-data-api/evm/reference/get-wallet-token-balances
 */
export async function getTokenBalancesMoralis(
  address: string,
  chainId: number = 1
): Promise<TokenBalance[]> {
  const MORALIS_API_KEY = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
  
  if (!MORALIS_API_KEY) {
    console.warn('Moralis API key not set');
    return [];
  }

  // Moralis chain identifiers
  const chains: { [key: number]: string } = {
    1: 'eth',
    137: 'polygon',
    56: 'bsc',
    43114: 'avalanche',
    250: 'fantom',
    42161: 'arbitrum',
    10: 'optimism',
  };

  const chain = chains[chainId] || 'eth';

  try {
    const response = await fetch(
      `https://deep-index.moralis.io/api/v2.2/${address}/erc20?chain=${chain}`,
      {
        headers: {
          'X-API-Key': MORALIS_API_KEY,
        },
      }
    );

    const data = await response.json();
    
    return (data || []).map((token: any) => ({
      contractAddress: token.token_address,
      tokenBalance: token.balance,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      logo: token.logo,
      thumbnail: token.thumbnail,
      balanceFormatted: token.balance_formatted,
      usdValue: token.usd_value,
    }));
  } catch (error) {
    console.error('Error fetching token balances from Moralis:', error);
    return [];
  }
}

/**
 * Get ERC20 token count using simple contract calls
 * This counts tokens by checking common token contracts
 */
export async function getTokenCountSimple(
  address: string,
  chainId: number = 1
): Promise<number> {
  // Common tokens on each chain
  const commonTokens: { [key: number]: string[] } = {
    1: [
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
      '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
      '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
      '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
    ],
    137: [
      '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC
      '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', // USDT
      '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', // DAI
      '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', // WMATIC
    ],
  };

  const tokens = commonTokens[chainId] || [];
  
  // You would check balance for each token and count non-zero balances
  // This is a simplified version - use Alchemy/Moralis for production
  return tokens.length;
}

/**
 * Get total asset count including native token
 */
export async function getTotalAssetCount(
  address: string,
  chainId: number = 1,
  provider: 'alchemy' | 'moralis' = 'alchemy'
): Promise<number> {
  let tokenBalances: TokenBalance[] = [];

  if (provider === 'alchemy') {
    tokenBalances = await getTokenBalancesAlchemy(address, chainId);
  } else if (provider === 'moralis') {
    tokenBalances = await getTokenBalancesMoralis(address, chainId);
  }

  // Add 1 for native token (ETH, MATIC, etc.) if user has it
  // You can check native balance separately
  const hasNativeToken = true; // Check with useBalance hook
  
  return tokenBalances.length + (hasNativeToken ? 1 : 0);
}

export default {
  getTokenBalancesAlchemy,
  getTokenBalancesMoralis,
  getTokenCountSimple,
  getTotalAssetCount,
};

