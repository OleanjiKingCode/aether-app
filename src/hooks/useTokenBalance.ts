import { useState, useEffect, useCallback } from 'react'
import { useAccount, useBalance, usePublicClient } from 'wagmi'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { useWalletContext } from '@/context/WalletContext'
import type { Token } from '@lifi/sdk'
import { PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { formatUnits, createPublicClient, http } from 'viem'
import { mainnet, bsc, polygon, arbitrum, optimism, avalanche } from 'viem/chains'
import { mobulaService } from '@/services/mobula.service'

interface TokenBalance {
  balance: string
  isLoading: boolean
  error: string | null
}

export const useTokenBalance = (token: Token | null) => {
  const [balance, setBalance] = useState<TokenBalance>({
    balance: '0',
    isLoading: false,
    error: null
  })

  const { activeWalletType } = useWalletContext()
  const { address: evmAddress, isConnected: evmConnected } = useAccount()
  const defaultPublicClient = usePublicClient()
  const { publicKey: solanaPublicKey, connected: solanaConnected } = useWallet()
  const { connection } = useConnection()

  // Get the correct public client for the token's chain
  const getPublicClientForChain = useCallback((chainId: number) => {
    const chainMap: { [key: number]: any } = {
      1: mainnet,
      56: bsc,
      137: polygon,
      42161: arbitrum,
      10: optimism,
      43114: avalanche,
    };

    const chain = chainMap[chainId];
    if (!chain) {
      console.warn(`No chain config found for chainId ${chainId}, using default`);
      return defaultPublicClient;
    }

    // Create a public client for the specific chain
    return createPublicClient({
      chain,
      transport: http()
    });
  }, [defaultPublicClient]);

  const fetchBalance = useCallback(async () => {
    if (!token) {
      setBalance({ balance: '0', isLoading: false, error: null })
      return
    }

    // Check if wallet is connected for the token's chain
    // Solana chain ID according to LI.FI docs: 1151111081099710
    const SOLANA_CHAIN_ID = 1151111081099710;
    const chainId = Number(token.chainId)
    const isSolanaChain = chainId === SOLANA_CHAIN_ID || 
                         chainId === 101 || 
                         String(token.chainId) === String(SOLANA_CHAIN_ID) ||
                         String(token.chainId).toUpperCase() === 'SOL'
    const isWalletConnected = 
      (isSolanaChain && solanaConnected) || // Solana
      (!isSolanaChain && evmConnected) // EVM chains

    if (!isWalletConnected) {
      setBalance({ balance: '0', isLoading: false, error: null })
      return
    }

    setBalance(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Check if it's a Solana chain
      const SOLANA_CHAIN_ID = 1151111081099710;
      const chainId = Number(token.chainId)
      const isSolanaChain = chainId === SOLANA_CHAIN_ID || 
                           chainId === 101 || 
                           String(token.chainId) === String(SOLANA_CHAIN_ID) ||
                           String(token.chainId).toUpperCase() === 'SOL'
      
      if (isSolanaChain) {
        // Solana token balance using Mobula API
        if (!solanaPublicKey) {
          throw new Error('Solana wallet not connected')
        }

        try {
          const walletAddress = solanaPublicKey.toBase58()
          console.log('Fetching Solana balance for:', walletAddress, 'Token:', token.symbol)
          
          // Check if it's native SOL or an SPL token
          const isNativeSOL = !token.address || 
            token.address === 'So11111111111111111111111111111111111111112' || // Wrapped SOL
            token.address === '11111111111111111111111111111111' || // System Program
            token.symbol === 'SOL'
          
          if (isNativeSOL) {
            // Get SOL balance from Mobula API
            try {
              const portfolio = await mobulaService.getWalletPortfolio(walletAddress, {
                blockchains: 'Solana',
                cache: true,
                stale: 30,
              })
              
              console.log('Mobula portfolio response:', portfolio)
              
              // Find SOL in the assets
              const solAsset = portfolio.assets?.find(
                (asset) => asset.asset.symbol === 'SOL' || asset.asset.name === 'Solana'
              )
              
              if (solAsset) {
                setBalance({
                  balance: solAsset.token_balance.toFixed(6),
                  isLoading: false,
                  error: null
                })
              } else {
                // Fallback to direct RPC call
                const balanceInLamports = await connection.getBalance(new PublicKey(walletAddress))
                const balanceInSOL = balanceInLamports / 1e9
                setBalance({
                  balance: balanceInSOL.toFixed(6),
                  isLoading: false,
                  error: null
                })
              }
            } catch (mobulaError) {
              console.warn('Mobula API failed, using fallback:', mobulaError)
              // Fallback to direct RPC call
              const balanceInLamports = await connection.getBalance(new PublicKey(walletAddress))
              const balanceInSOL = balanceInLamports / 1e9
              setBalance({
                balance: balanceInSOL.toFixed(6),
                isLoading: false,
                error: null
              })
            }
          } else {
            // Get SPL token balance from Mobula API
            try {
              const portfolio = await mobulaService.getWalletPortfolio(walletAddress, {
                blockchains: 'Solana',
                cache: true,
                stale: 30,
              })
              
              console.log('Fetching SPL token balance for:', token.symbol, token.address)
              
              // Find the token in the assets by symbol or address
              const tokenAsset = portfolio.assets?.find(
                (asset) => 
                  asset.asset.symbol?.toLowerCase() === token.symbol?.toLowerCase() ||
                  asset.contracts_balances?.some((contract: any) => 
                    contract.address?.toLowerCase() === token.address?.toLowerCase()
                  )
              )
              
              if (tokenAsset && tokenAsset.token_balance) {
                console.log('Found token balance:', tokenAsset.token_balance)
                setBalance({
                  balance: tokenAsset.token_balance.toFixed(6),
                  isLoading: false,
                  error: null
                })
              } else {
                console.log('Token not found in portfolio, showing 0')
                setBalance({
                  balance: '0',
                  isLoading: false,
                  error: null
                })
              }
            } catch (splError) {
              console.error('Error fetching SPL token balance from Mobula:', splError)
              setBalance({
                balance: '0',
                isLoading: false,
                error: null
              })
            }
          }
        } catch (err) {
          console.error('Error fetching Solana balance:', err)
          setBalance({
            balance: '0',
            isLoading: false,
            error: 'Failed to fetch balance'
          })
        }
      } else {
        // EVM token balance using viem/wagmi
        if (!evmAddress) {
          throw new Error('EVM wallet not connected')
        }

        try {
          // Get public client for the token's specific chain (not the connected chain)
          const chainPublicClient = getPublicClientForChain(Number(token.chainId));
          
          if (!chainPublicClient) {
            console.error('Failed to get public client for chain:', token.chainId);
            setBalance({
              balance: '0',
              isLoading: false,
              error: null
            })
            return;
          }
          
          const isNativeToken = !token.address || 
            token.address === '0x0000000000000000000000000000000000000000' ||
            token.address.toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

          if (isNativeToken) {
            // Fetch native token balance (ETH, MATIC, BNB, etc.) from token's chain
            try {
              const balance = await chainPublicClient.getBalance({
                address: evmAddress as `0x${string}`
              })
              
              if (balance !== undefined) {
                const formatted = formatUnits(balance, token.decimals)
                setBalance({
                  balance: parseFloat(formatted).toFixed(6),
                  isLoading: false,
                  error: null
                })
              } else {
                setBalance({
                  balance: '0',
                  isLoading: false,
                  error: null
                })
              }
            } catch (err) {
              console.error('Error fetching native balance:', err)
              setBalance({
                balance: '0',
                isLoading: false,
                error: null
              })
            }
          } else {
            // Fetch ERC20 token balance from token's chain
            const ERC20_ABI = [
              {
                name: 'balanceOf',
                inputs: [{ name: 'account', type: 'address' }],
                outputs: [{ name: '', type: 'uint256' }],
                stateMutability: 'view',
                type: 'function'
              }
            ] as const

            try {
              const balance = await chainPublicClient.readContract({
                address: token.address as `0x${string}`,
                abi: ERC20_ABI,
                functionName: 'balanceOf',
                args: [evmAddress as `0x${string}`]
              })

              if (balance !== undefined) {
                const formatted = formatUnits(balance as bigint, token.decimals)
                setBalance({
                  balance: parseFloat(formatted).toFixed(6),
                  isLoading: false,
                  error: null
                })
              } else {
                setBalance({
                  balance: '0',
                  isLoading: false,
                  error: null
                })
              }
            } catch (err) {
              console.error('Error fetching ERC20 balance:', err)
              setBalance({
                balance: '0',
                isLoading: false,
                error: null
              })
            }
          }
        } catch (err) {
          console.error('Error fetching EVM balance:', err)
          // Fallback: show zero balance
          setBalance({
            balance: '0',
            isLoading: false,
            error: null
          })
        }
      }
    } catch (error: any) {
      console.error('Failed to fetch token balance:', error)
      setBalance({
        balance: '0',
        isLoading: false,
        error: error.message || 'Failed to fetch balance'
      })
    }
  }, [token, evmAddress, evmConnected, getPublicClientForChain, solanaPublicKey, solanaConnected, connection])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

  return {
    ...balance,
    refetch: fetchBalance
  }
}
