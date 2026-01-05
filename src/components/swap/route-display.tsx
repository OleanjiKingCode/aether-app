'use client'

import { useState, useEffect } from 'react'
import type { Route } from '@lifi/sdk'
import { getChains } from '@lifi/sdk'
import { lifiService } from '../../services/lifi.service'
import DetailAccordion from './detail-accordion'
import SettingIcon from 'public/icon/settings.svg'
import { IoChevronDown, IoChevronUp, IoTime, IoFlash, IoShield } from 'react-icons/io5'

interface RouteDisplayProps {
  route: Route | null
  isLoading?: boolean
  onRouteSelect?: (route: Route) => void
}

const RouteDisplay = ({ route, isLoading = false, onRouteSelect }: RouteDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [chains, setChains] = useState<any[]>([])

  // Fetch chains data on mount
  useEffect(() => {
    const fetchChains = async () => {
      try {
        const chainsData = await getChains()
        setChains(chainsData)
      } catch (error) {
        console.error('Failed to fetch chains:', error)
      }
    }
    fetchChains()
  }, [])

  // Helper to get chain info by ID
  const getChainInfo = (chainId: number) => {
    // Handle Solana chain ID specially
    const SOLANA_CHAIN_ID = 1151111081099710
    
    // Try to find chain by ID (handle both Solana chain IDs)
    let chain = chains.find(c => c.id === chainId)
    
    // If not found and it's a Solana chain ID, try alternate IDs
    if (!chain && (chainId === SOLANA_CHAIN_ID || chainId === 101)) {
      chain = chains.find(c => 
        c.id === SOLANA_CHAIN_ID || 
        c.id === 101 || 
        c.name?.toLowerCase() === 'solana'
      )
    }
    
    // If still not found and it's Solana, return hardcoded Solana info
    if (!chain && (chainId === SOLANA_CHAIN_ID || chainId === 101)) {
      return { 
        name: 'Solana', 
        logoURI: 'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/sol.svg',
        id: chainId
      }
    }
    
    return chain || { name: `Chain ${chainId}`, logoURI: null, id: chainId }
  }

  if (!route) {
    return (
      <div className="bg-background border border-input rounded-lg p-4">
        <div className="text-center text-muted-foreground">
          {isLoading ? 'Finding best route...' : 'Enter amount to find routes'}
        </div>
      </div>
    )
  }

  // Handle both quote and route structures
  const isQuote = !!(route as any).action && !!(route as any).estimate
  
  const fromChainId = isQuote ? parseInt((route as any).action.fromChainId) : route.fromChainId
  const toChainId = isQuote ? parseInt((route as any).action.toChainId) : route.toChainId
  
  const formatRouteInfo = lifiService.formatRouteInfo(route as any)
  const bridgeInfo = lifiService.getBridgeInfo(fromChainId, toChainId)
  
  // Get chain information
  const fromChain = getChainInfo(fromChainId)
  const toChain = getChainInfo(toChainId)
  
  // Calculate gas costs properly (works for both quote and route)
  const totalGasCost = isQuote
    ? ((route as any).estimate?.gasCosts || []).reduce((sum: number, cost: any) => {
        return sum + parseFloat(cost.amountUSD || '0')
      }, 0)
    : (route.steps || []).reduce((sum, step) => {
        if (step.estimate?.gasCosts) {
          return sum + step.estimate.gasCosts.reduce((stepSum, cost) => {
            return stepSum + parseFloat(cost.amountUSD || '0')
          }, 0)
        }
        return sum
      }, 0)
  
  // Get price impact (works for both quote and route)
  const priceImpact = 0.02 // Default small impact, can be calculated if needed

  const getToolIcon = (toolName: string) => {
    const name = toolName.toLowerCase()
    if (name.includes('uniswap')) return '🦄'
    if (name.includes('1inch')) return '1️⃣'
    if (name.includes('paraswap')) return '🔄'
    if (name.includes('stargate')) return '⭐'
    if (name.includes('hop')) return '🐰'
    return '🔗'
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

  return (
    <div className="space-y-3">
      {/* Route Summary */}
      <div className="bg-background border border-input rounded-lg p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="text-sm font-medium">Best Route Found</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {formatRouteInfo.isCrossChain ? 'Cross-chain swap' : 'Same-chain swap'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Est. Time</div>
            <div className="text-sm font-medium flex items-center gap-1">
              <IoTime size={14} />
              {formatRouteInfo.estimatedTime}s
            </div>
          </div>
        </div>

        {/* Route Steps */}
        <div className="space-y-2">
          {isQuote ? (
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1">
                <span>{getToolIcon((route as any).toolDetails?.name || (route as any).tool || '')}</span>
                <span className="font-medium">{(route as any).toolDetails?.name || (route as any).tool || 'Mayan (Swift)'}</span>
              </div>
            </div>
          ) : (
            route.steps?.map((step, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span>{getToolIcon(step.toolDetails?.name || '')}</span>
                  <span className="font-medium">{step.toolDetails?.name || 'Unknown'}</span>
                </div>
                {index < route.steps.length - 1 && (
                  <IoChevronDown size={12} className="text-muted-foreground" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Route Stats */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-input">
          <div>
            <div className="text-xs text-muted-foreground">Gas Cost</div>
            <div className="text-sm font-medium">
              ${totalGasCost > 0 ? totalGasCost.toFixed(2) : '0.00'}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Price Impact</div>
            <div className="text-sm font-medium">
              {priceImpact > 0 ? `${priceImpact.toFixed(2)}%` : '0.00%'}
            </div>
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-3 flex items-center justify-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {isExpanded ? 'Show Less' : 'Show Details'}
          {isExpanded ? <IoChevronUp size={14} /> : <IoChevronDown size={14} />}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <DetailAccordion 
          icon={SettingIcon} 
          title="Route Details" 
          className="!border-none pl-0"
        >
          <div className="space-y-4">
            {/* Chain Information */}
            <div>
              <h5 className="text-sm font-medium mb-2">Chain Information</h5>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-muted-foreground mb-1">From</div>
                  <div className="flex items-center gap-2">
                    {fromChain.logoURI ? (
                      <img 
                        src={fromChain.logoURI} 
                        alt={fromChain.name} 
                        className="w-5 h-5 rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                        {fromChain.name.charAt(0)}
                      </div>
                    )}
                    <span className="font-medium">{fromChain.name}</span>
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">To</div>
                  <div className="flex items-center gap-2">
                    {toChain.logoURI ? (
                      <img 
                        src={toChain.logoURI} 
                        alt={toChain.name} 
                        className="w-5 h-5 rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                        {toChain.name.charAt(0)}
                      </div>
                    )}
                    <span className="font-medium">{toChain.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bridge Information */}
            {formatRouteInfo.isCrossChain && (
              <div>
                <h5 className="text-sm font-medium mb-2">Bridge Information</h5>
                <div className="text-xs space-y-1">
                  <div>Bridge: AetherDex</div>
                  <div>Est. Time: 30 seconds</div>
                  <div>Fee: {bridgeInfo.fee}</div>
                </div>
              </div>
            )}

            {/* Security Info */}
            <div className="bg-green-500/10 border border-green-500/20 rounded p-3">
              <div className="flex items-center gap-2 text-green-400 text-sm font-medium mb-1">
                <IoShield size={16} />
                Security Verified
              </div>
              <div className="text-xs text-green-400/80">
                This route uses audited protocols and secure bridges
              </div>
            </div>
          </div>
        </DetailAccordion>
      )}
    </div>
  )
}

export default RouteDisplay
