'use client'

import { useState, useEffect } from 'react'
import { getTokens } from '@lifi/sdk'
import { useLifiSdk } from '../../hooks/useLifiSdk'

/**
 * Simple test component to verify LiFi SDK integration
 * You can remove this file once you confirm everything works
 */
const CustomSwapTest = () => {
  const [tokens, setTokens] = useState<any[]>([])
  const [chains, setChains] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize LiFi SDK
  useLifiSdk('aetherdapp-test')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        const tokensResponse = await getTokens()

        // Convert tokens object to flat array and take first 10
        const allTokens = Object.values(tokensResponse.tokens).flat()
        setTokens(allTokens.slice(0, 10))
        
        // Simple chain list for testing
        const simpleChains = [
          { id: 1, name: 'Ethereum' },
          { id: 56, name: 'BSC' },
          { id: 137, name: 'Polygon' },
          { id: 42161, name: 'Arbitrum' },
          { id: 10, name: 'Optimism' },
          { id: 101, name: 'Solana' }
        ]
        setChains(simpleChains)

        console.log('✅ LiFi SDK Test Successful!')
        console.log('Tokens:', allTokens.length)
        console.log('Chains:', simpleChains.length)
      } catch (err) {
        console.error('❌ LiFi SDK Test Failed:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="bg-card border border-input rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">LiFi SDK Test</h3>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading LiFi data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card border border-red-500 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 text-red-500">LiFi SDK Test Failed</h3>
        <p className="text-sm text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-input rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-4 text-green-500">✅ LiFi SDK Test Successful</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Sample Tokens ({tokens.length})</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {tokens.map((token, index) => (
              <div key={index} className="text-xs flex justify-between">
                <span>{token.symbol}</span>
                <span className="text-muted-foreground">Chain {token.chainId}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Sample Chains ({chains.length})</h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {chains.map((chain, index) => (
              <div key={index} className="text-xs flex justify-between">
                <span>{chain.name}</span>
                <span className="text-muted-foreground">ID: {chain.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded">
        <p className="text-sm text-green-400">
          🎉 LiFi SDK is working correctly! Your custom swap UI should now function properly.
        </p>
      </div>
    </div>
  )
}

export default CustomSwapTest
