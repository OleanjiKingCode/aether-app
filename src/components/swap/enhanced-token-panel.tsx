'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Token, ExtendedChain } from '@lifi/sdk'
import TokenSelect from '../common/token-select'
import NetworkSelect from '../common/network-select'
import Bar from '../common/skeleton/bar'
import { NetworkType, TokenType } from '@/config/constant/type'
import { useTokenBalance } from '../../hooks/useTokenBalance'

interface EnhancedTokenPanelProps {
  title: string
  isLoading?: boolean
  token?: Token | null
  amount: string
  onAmountChange: (amount: string) => void
  onTokenSelect: (token: Token) => void
  availableTokens: Token[]
  availableChains: ExtendedChain[]
  isOutput?: boolean
}

const EnhancedTokenPanel = ({
  title,
  isLoading = false,
  token,
  amount,
  onAmountChange,
  onTokenSelect,
  availableTokens,
  availableChains,
  isOutput = false
}: EnhancedTokenPanelProps) => {
  const { balance, isLoading: balanceLoading, error: balanceError } = useTokenBalance(token || null)
  // Initialize selectedNetwork with the token's chain if available
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkType | undefined>(() => {
    if (token) {
      const chain = availableChains.find(c => c.id === token.chainId)
      if (chain) {
        return {
          name: chain.name,
          icon: null,
          chainId: chain.id
        }
      }
    }
    return undefined
  })

  // Filter tokens based on selected network (or token's chain as fallback)
  const filterChainId = selectedNetwork?.chainId || token?.chainId || 1
  
  // Solana chain ID according to LI.FI docs
  const SOLANA_CHAIN_ID = 1151111081099710
  
  // Convert LiFi tokens to your TokenType format - filter by selected network
  const tokenData: TokenType[] = availableTokens
    .filter(t => {
      // Handle Solana chain ID matching (can be 101 or 1151111081099710)
      if (filterChainId === SOLANA_CHAIN_ID || filterChainId === 101) {
        return Number(t.chainId) === SOLANA_CHAIN_ID || 
               Number(t.chainId) === 101 ||
               String(t.chainId) === String(SOLANA_CHAIN_ID) ||
               String(t.chainId).toUpperCase() === 'SOL'
      }
      return t.chainId === filterChainId
    })
    .map(t => ({
      name: t.name,
      symbol: t.symbol,
      logoURI: t.logoURI,
      address: t.address,
      chainId: t.chainId,
      decimals: t.decimals
    }))

  // Show loading state if no tokens available yet
  const hasTokens = tokenData.length > 0

  // Helper function to get chain icon based on chain ID
  const getChainIcon = (chainId: number | string): string | null => {
    const chainIdNum = Number(chainId)
    const iconMap: { [key: number]: string } = {
      1: '/icon/swap/ethereum.svg',      // Ethereum
      56: '/icon/swap/bsc.svg',          // BSC
      137: '/icon/swap/polygon.svg',     // Polygon
      42161: '/icon/swap/arbitrum.svg',  // Arbitrum
      10: '/icon/swap/optimism.svg',     // Optimism
      250: '/icon/swap/fantom.svg',      // Fantom
      43114: '/icon/swap/avalanche.svg', // Avalanche
      101: '/icon/swap/solana.svg',      // Solana (legacy)
      1151111081099710: '/icon/swap/solana.svg', // Solana (LI.FI chain ID)
    }
    return iconMap[chainIdNum] || null
  }

  // Convert LiFi chains to your NetworkType format
  const networkData: NetworkType[] = availableChains.map(c => ({
    name: c.name,
    icon: (c as any).logoURI || getChainIcon(c.id), // Use LiFi chain logo first, fallback to local
    logoURI: (c as any).logoURI || getChainIcon(c.id), // Use LiFi chain logo first, fallback to local
    chainId: c.id
  }))

  const handleTokenChange = useCallback((value: string) => {
    const selectedTokenData = tokenData.find((t) => t.name === value)
    if (selectedTokenData) {
      // Find the corresponding LiFi token
      const lifiToken = availableTokens.find(t => 
        t.symbol === selectedTokenData.symbol && 
        t.chainId === selectedTokenData.chainId
      )
      if (lifiToken) {
        onTokenSelect(lifiToken)
      }
    }
  }, [tokenData, availableTokens, onTokenSelect])

  const handleNetworkChange = useCallback((value: string) => {
    const network = networkData.find((n) => n.name === value)
    setSelectedNetwork(network || undefined)
    
    // When network changes, select the first token from that chain
    if (network?.chainId) {
      const tokensForChain = availableTokens.filter(t => t.chainId === network.chainId)
      if (tokensForChain.length > 0) {
        const firstToken = tokensForChain[0]
        onTokenSelect(firstToken)
      }
    }
  }, [networkData, availableTokens, onTokenSelect])

  // Sync selectedNetwork with token's chain when token changes
  useEffect(() => {
    if (token && availableChains.length > 0) {
      const chain = availableChains.find(c => c.id === token.chainId)
      if (chain) {
        const chainIcon = (chain as any).logoURI || getChainIcon(chain.id)
        setSelectedNetwork({
          name: chain.name,
          icon: chainIcon,
          logoURI: chainIcon, // Use LiFi chain logo first, fallback to local
          chainId: chain.id
        })
      }
    }
  }, [token, availableChains])

  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isOutput) { // Only allow input changes for 'from' token
      onAmountChange(e.target.value)
    }
  }, [isOutput, onAmountChange])

  const setMaxAmount = useCallback(() => {
    if (!isOutput && balance && !balanceError) {
      onAmountChange(balance)
    }
  }, [isOutput, balance, balanceError, onAmountChange])

  // Calculate USD value (simplified)
  const usdValue = token && amount && token.priceUSD ? 
    (parseFloat(amount) * Number(token.priceUSD)).toFixed(2) : '0.00'

  return (
    <div className="bg-background border-[1px] border-input py-6 px-3 flex flex-col gap-2.5">
      <div className="flex justify-between">
        <div className="text-muted-foreground text-sm">{title}</div>
        <div className="flex gap-2.5 items-center">
          <div className="text-muted-foreground text-sm">Balance:</div>
          {balanceLoading && <Bar barClassName="w-10 h-3" />}
          {!balanceLoading && (
            <div className="text-muted-foreground text-sm">
              {balanceError ? '0.00' : balance}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between gap-5 flex-col md:flex-row md:items-center">
        <div className="w-full">
          {isLoading && <Bar barClassName="w-full md:w-100 h-3" />}
          {!isLoading && (
            <TokenSelect 
              data={tokenData} 
              value={token ? { 
                name: token.name, 
                symbol: token.symbol,
                logoURI: token.logoURI 
              } : undefined} 
              onChange={handleTokenChange}
              className={!hasTokens ? 'animate-pulse' : ''}
            />
          )}
        </div>
        <div>On</div>
        <div className="">
          {isLoading && <Bar barClassName="w-full md:w-100 h-3" />}
          {!isLoading && (
            <NetworkSelect 
              data={networkData} 
              value={selectedNetwork} 
              onChange={handleNetworkChange} 
            />
          )}
        </div>
      </div>

      <div className="text-foreground text-xl w-full">
        {isLoading && <Bar barClassName="w-full h-3" />}
        {!isLoading && (
          <input 
            className="w-full outline-0 bg-transparent" 
            placeholder={isOutput ? "Estimated amount" : "Input amount"} 
            value={amount}
            onChange={handleAmountChange}
            readOnly={isOutput}
            type="number"
            step="any"
          />
        )}
      </div>

      <div className="flex justify-between">
        {isLoading && <Bar barClassName="md:w-25 h-3" />}
        {!isLoading && (
          <div className="text-muted-foreground text-sm">
            ≈ ${usdValue}
          </div>
        )}

        {!isOutput && (
          <>
            {isLoading && <Bar barClassName="md:w-25 h-3" />}
            {!isLoading && (
              <div 
                className="text-lg text-primary cursor-pointer "
                onClick={setMaxAmount}
              >
                Max
              </div>
            )}
          </>
        )}
      </div>

      {/* Token Info */}
      {token && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {token.logoURI && (
            <img 
              src={token.logoURI} 
              alt={token.symbol} 
              className="w-4 h-4 rounded-full"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          )}
          <span>{token.symbol} • {token.name}</span>
          {token.priceUSD && (
            <span>• ${Number(token.priceUSD).toFixed(4)}</span>
          )}
        </div>
      )}

      {/* Loading State for Tokens */}
      {!hasTokens && !isLoading && (
        <div className="text-xs text-muted-foreground animate-pulse">
          Loading tokens...
        </div>
      )}
    </div>
  )
}

export default EnhancedTokenPanel
