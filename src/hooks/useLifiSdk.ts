import { useEffect } from 'react'
import { config, EVM, Solana } from '@lifi/sdk'
import { useConfig, useWalletClient } from 'wagmi'
import { getWalletClient, switchChain } from '@wagmi/core'
import { useWallet } from '@solana/wallet-adapter-react'
import type { SignerWalletAdapter } from '@solana/wallet-adapter-base'

export const useLifiSdk = (integrator: string = 'aetherdapp') => {
  const wagmiConfig = useConfig()
  const { wallet } = useWallet()
  
  useEffect(() => {
    // Initialize LI.FI SDK configuration with both EVM and Solana providers
    const providers = [
      EVM({
        getWalletClient: () => getWalletClient(wagmiConfig),
        switchChain: async (chainId) => {
          const chain = await switchChain(wagmiConfig, { chainId })
          return getWalletClient(wagmiConfig, { chainId: chain.id })
        },
      }),
    ]

    // Add Solana provider if wallet is connected
    if (wallet?.adapter) {
      console.log('Configuring Solana provider for LI.FI SDK')
      providers.push(
        Solana({
          async getWalletAdapter() {
            return wallet.adapter as SignerWalletAdapter
          },
        })
      )
    }

    config.set({
      integrator,
      apiUrl: 'https://li.quest/v1',
      debug: process.env.NODE_ENV === 'development',
    })

    // Set providers
    config.setProviders(providers)
    
    console.log('LI.FI SDK configured with providers:', providers.map(p => p.constructor.name))
  }, [integrator, wagmiConfig, wallet?.adapter])
}
