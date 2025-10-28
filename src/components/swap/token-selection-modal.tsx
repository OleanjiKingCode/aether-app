'use client'

import { useState, useEffect, useMemo } from 'react'
import type { Token, ExtendedChain } from '@lifi/sdk'
import Modal from 'react-modal'
import { IoSearch, IoClose } from 'react-icons/io5'
import Bar from '../common/skeleton/bar'

interface TokenSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onTokenSelect: (token: Token) => void
  availableTokens: Token[]
  availableChains: ExtendedChain[]
  selectedChainId?: number
  title?: string
}

const TokenSelectionModal = ({
  isOpen,
  onClose,
  onTokenSelect,
  availableTokens,
  availableChains,
  selectedChainId,
  title = 'Select Token'
}: TokenSelectionModalProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChain, setSelectedChain] = useState<number | null>(selectedChainId || null)

  // Filter tokens based on search and chain
  const filteredTokens = useMemo(() => {
    let tokens = availableTokens

    // Filter by chain if selected
    if (selectedChain) {
      tokens = tokens.filter(token => token.chainId === selectedChain)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      tokens = tokens.filter(token => 
        token.name.toLowerCase().includes(query) ||
        token.symbol.toLowerCase().includes(query) ||
        token.address.toLowerCase().includes(query)
      )
    }

    // Sort by popularity/balance (you can implement your own sorting logic)
    return tokens.sort((a, b) => {
      // Sort by symbol alphabetically
      return a.symbol.localeCompare(b.symbol)
    })
  }, [availableTokens, selectedChain, searchQuery])

  // Popular tokens (you can customize this list)
  const popularTokens = useMemo(() => {
    const popularSymbols = ['ETH', 'USDC', 'USDT', 'WETH', 'DAI', 'WBTC']
    return filteredTokens.filter(token => popularSymbols.includes(token.symbol))
  }, [filteredTokens])

  const handleTokenClick = (token: Token) => {
    onTokenSelect(token)
    onClose()
  }

  const getChainName = (chainId: number) => {
    const chain = availableChains.find(c => c.id === chainId)
    return chain?.name || `Chain ${chainId}`
  }

  const getChainIcon = (chainId: number) => {
    const icons: { [key: number]: string } = {
      1: '🔷', // Ethereum
      56: '🟡', // BSC
      137: '🟣', // Polygon
      42161: '🔵', // Arbitrum
      10: '🔴', // Optimism
      250: '🟠', // Fantom
      43114: '🟢', // Avalanche
    }
    return icons[chainId] || '⛓️'
  }

  // Get unique chains from available tokens
  const uniqueChains = useMemo(() => {
    const chainIds = [...new Set(availableTokens.map(token => token.chainId))]
    return chainIds.map(chainId => {
      const chain = availableChains.find(c => c.id === chainId)
      return {
        id: chainId,
        name: chain?.name || `Chain ${chainId}`,
        icon: getChainIcon(chainId)
      }
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [availableTokens, availableChains])

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      overlayClassName="fixed inset-0 bg-black/50"
      contentLabel={title}
    >
      <div className="bg-card border border-input rounded-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-input">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded transition-colors"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Search and Chain Filter */}
        <div className="p-4 space-y-3">
          <div className="relative">
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-background border border-input rounded-lg text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Chain Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedChain(null)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                selectedChain === null
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-input bg-background text-muted-foreground hover:bg-accent'
              }`}
            >
              All Chains
            </button>
            {uniqueChains.map(chain => (
              <button
                key={chain.id}
                onClick={() => setSelectedChain(chain.id)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  selectedChain === chain.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-input bg-background text-muted-foreground hover:bg-accent'
                }`}
              >
                <span className="mr-1">{chain.icon}</span>
                {chain.name}
              </button>
            ))}
          </div>
        </div>

        {/* Token List */}
        <div className="flex-1 overflow-y-auto">
          {filteredTokens.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {searchQuery ? 'No tokens found matching your search' : 'No tokens available'}
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {/* Popular Tokens */}
              {popularTokens.length > 0 && !searchQuery && (
                <>
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                    Popular
                  </div>
                  {popularTokens.map(token => (
                    <TokenItem
                      key={`${token.chainId}-${token.address}`}
                      token={token}
                      onClick={() => handleTokenClick(token)}
                      chainName={getChainName(token.chainId)}
                      chainIcon={getChainIcon(token.chainId)}
                    />
                  ))}
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                    All Tokens
                  </div>
                </>
              )}

              {/* All Tokens */}
              {filteredTokens.map(token => (
                <TokenItem
                  key={`${token.chainId}-${token.address}`}
                  token={token}
                  onClick={() => handleTokenClick(token)}
                  chainName={getChainName(token.chainId)}
                  chainIcon={getChainIcon(token.chainId)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  )
}

interface TokenItemProps {
  token: Token
  onClick: () => void
  chainName: string
  chainIcon: string
}

const TokenItem = ({ token, onClick, chainName, chainIcon }: TokenItemProps) => {
  return (
    <button
      onClick={onClick}
      className="w-full p-3 flex items-center gap-3 hover:bg-accent transition-colors rounded-lg text-left"
    >
      <div className="flex-shrink-0">
        {token.logoURI ? (
          <img
            src={token.logoURI}
            alt={token.symbol}
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <div className={`w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-medium ${token.logoURI ? 'hidden' : ''}`}>
          {token.symbol.charAt(0)}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{token.symbol}</span>
          <span className="text-xs text-muted-foreground">{chainIcon}</span>
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {token.name}
        </div>
      </div>

      <div className="text-right">
        <div className="text-xs text-muted-foreground">
          {chainName}
        </div>
        {token.priceUSD && (
          <div className="text-xs text-muted-foreground">
            ${Number(token.priceUSD).toFixed(4)}
          </div>
        )}
      </div>
    </button>
  )
}

export default TokenSelectionModal
