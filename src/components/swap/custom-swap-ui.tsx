'use client'

import { useState, useEffect, useCallback } from 'react'
import { getTokens, getRoutes, getChains, ChainType, getQuote } from '@lifi/sdk'
import type { Route, Token, ExtendedChain, QuoteRequest } from '@lifi/sdk'
import { useAccount, useSwitchChain, useWalletClient, usePublicClient } from 'wagmi'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { Transaction, VersionedTransaction } from '@solana/web3.js'
import { lifiService } from '../../services/lifi.service'
import { jupiterService } from '../../services/jupiter.service'
import { useLifiSdk } from '../../hooks/useLifiSdk'
import { useWalletContext } from '../../context/WalletContext'
import SwitchButton from '../common/switch-button'
import EnhancedTokenPanel from './enhanced-token-panel'
import RouteDisplay from './route-display'
import TokenSelectionModal from './token-selection-modal'
import PrivacyMode from './privacy-mode'
import DetailAccordion from './detail-accordion'
import SwapTransactionDetail from './swap-transaction-detail'
import SwapAIRoute from './swap-ai-route'
import { IoSwapVertical } from 'react-icons/io5'
import SettingIcon from 'public/icon/settings.svg'
import { Progressbar } from '../common/progresbar'
import Bar from '../common/skeleton/bar'

interface CustomSwapUIProps {
  isLoading?: boolean
  onRouteUpdate?: (route: Route | null) => void
  onChainUpdate?: (fromChain: any, toChain: any) => void
  onTokenUpdate?: (fromToken: any, toToken: any) => void
  onExecutionComplete?: (result: any) => void
}

interface SwapFormData {
  fromToken: Token | null
  toToken: Token | null
  fromAmount: string
  toAmount: string
  fromChainId: number
  toChainId: number
  toAddress: string
  slippage: number
  manualToAddress?: string  // For manual destination address input
}

// Validate address format
const validateAddress = (address: string, isSolana: boolean): boolean => {
  if (!address) return false
  
  if (isSolana) {
    // Solana address: 32-44 characters, base58
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
  } else {
    // EVM address: 0x + 40 hex characters
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }
}

// Helper function to normalize token addresses for Jupiter
// Jupiter requires the wrapped SOL mint address, not the System Program address
const normalizeTokenAddressForJupiter = (address: string, symbol?: string): string => {
  // System Program address (32 ones) should be converted to wrapped SOL
  if (address === '11111111111111111111111111111111' || 
      (symbol && (symbol === 'SOL' || symbol === 'WSOL'))) {
    return 'So11111111111111111111111111111111111111112' // Wrapped SOL mint
  }
  return address
}

const CustomSwapUI = ({ 
  isLoading = false,
  onRouteUpdate,
  onChainUpdate,
  onTokenUpdate,
  onExecutionComplete
}: CustomSwapUIProps) => {
  const [isPrivacy, setIsPrivacy] = useState(false)
  const [mode, setMode] = useState<'market' | 'limit'>('market')
  const [limitValue, setLimitValue] = useState('')
  const [isFindingRoute, setIsFindingRoute] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionStatus, setExecutionStatus] = useState<string>('')
  const [executionStep, setExecutionStep] = useState<number>(0)
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null)
  const [txSignature, setTxSignature] = useState<string>('')
  const [availableTokens, setAvailableTokens] = useState<Token[]>([])
  const [availableChains, setAvailableChains] = useState<ExtendedChain[]>([])
  const [showTokenModal, setShowTokenModal] = useState<'from' | 'to' | null>(null)
  const [routeError, setRouteError] = useState<string | null>(null)
  const [useJupiter, setUseJupiter] = useState(false) // Track if using Jupiter for Solana swaps
  
  // Initialize LiFi SDK
  useLifiSdk('aetherdapp')
  
  // Wallet context
  const { isConnected, activeWalletType } = useWalletContext()
  const { address: evmAddress, chain } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { switchChainAsync } = useSwitchChain()
  const { publicKey, signTransaction, sendTransaction } = useWallet()
  const { connection } = useConnection()

  // Form data state - default based on wallet type
  // Solana chain ID according to LI.FI docs
  const SOLANA_CHAIN_ID = 1151111081099710;

  const getDefaultChains = () => {
    // If Solana wallet is connected, default to Solana
    if (activeWalletType === 'solana' && publicKey) {
      return { fromChainId: SOLANA_CHAIN_ID, toChainId: 1 } // Solana to Ethereum
    }
    // Otherwise default to EVM chains
    return { fromChainId: 1, toChainId: 56 } // Ethereum to BSC
  }

  const [formData, setFormData] = useState<SwapFormData>(() => {
    const { fromChainId, toChainId } = getDefaultChains()
    return {
    fromToken: null,
    toToken: null,
    fromAmount: '',
    toAmount: '',
      fromChainId,
      toChainId,
    toAddress: '',
      slippage: 0.5,
      manualToAddress: ''  // Initialize manual address
    }
  })

  // Load available tokens and chains on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch chains from LiFi SDK (both EVM and Solana)
        const chains = await getChains({ 
          chainTypes: [ChainType.EVM, ChainType.SVM] 
        })
        setAvailableChains(chains)
        
        // Fetch tokens from LiFi SDK (both EVM and Solana)
        const tokensResponse = await getTokens({
          chainTypes: [ChainType.EVM, ChainType.SVM]
        })
        
        console.log('Tokens response:', tokensResponse)
        
        // Convert tokens object to flat array
        const allTokens = Object.values(tokensResponse.tokens).flat()
        setAvailableTokens(allTokens)
        
        // Check for prefill data from dashboard "Take Action"
        const prefillData = localStorage.getItem('swapPrefill');
        let hasPrefill = false;
        
        if (prefillData) {
          try {
            const prefill = JSON.parse(prefillData);
            console.log('Found swap prefill data:', prefill);
            
            const SOLANA_CHAIN_ID = 1151111081099710;
            
            // Find SOL token (from token)
            const solToken = allTokens.find(t => {
              const chainIdMatch = Number(t.chainId) === SOLANA_CHAIN_ID || 
                                   Number(t.chainId) === 101 ||
                                   String(t.chainId) === String(SOLANA_CHAIN_ID);
              const symbolMatch = t.symbol === 'SOL' || t.symbol === 'WSOL';
              return chainIdMatch && symbolMatch;
            });
            
            // Find destination token by address or symbol
            let toToken = allTokens.find(t => 
              t.address === prefill.toTokenAddress && 
              (Number(t.chainId) === SOLANA_CHAIN_ID || Number(t.chainId) === 101)
            );
            
            // If not found by address, try by symbol
            if (!toToken && prefill.toTokenSymbol) {
              toToken = allTokens.find(t => 
                t.symbol === prefill.toTokenSymbol && 
                (Number(t.chainId) === SOLANA_CHAIN_ID || Number(t.chainId) === 101)
              );
              console.log('Token found by symbol:', toToken);
            }
            
            // If still not found, create a basic token object
            if (!toToken && prefill.toTokenAddress) {
              console.warn('Token not in LI.FI list, creating basic token object');
              toToken = {
                address: prefill.toTokenAddress,
                symbol: prefill.toTokenSymbol || 'Unknown',
                name: prefill.toTokenSymbol || 'Unknown Token',
                chainId: SOLANA_CHAIN_ID,
                decimals: 9, // Standard Solana token decimals
                priceUSD: '0',
                logoURI: undefined,
              };
            }
            
            console.log('Prefill SOL token:', solToken);
            console.log('Prefill destination token:', toToken);
            
            if (solToken && toToken) {
              setFormData(prev => ({
                ...prev,
                fromToken: solToken,
                toToken: toToken,
                fromChainId: solToken.chainId as number,
                toChainId: toToken.chainId as number,
              }));
              console.log('Swap prefilled: SOL →', toToken.symbol);
              hasPrefill = true; // Mark that we have prefill data
              
              // Set Jupiter flag if specified
              if (prefill.useJupiter) {
                setUseJupiter(true);
                console.log('Using Jupiter for this Solana swap');
              }
            }
            
            // Clear prefill data after using it
            localStorage.removeItem('swapPrefill');
          } catch (err) {
            console.error('Failed to parse prefill data:', err);
            localStorage.removeItem('swapPrefill');
          }
        }
        
        // Set default tokens based on wallet type (only if no prefill)
        if (!hasPrefill && (!formData.fromToken || !formData.toToken)) {
          // If Solana wallet is connected, default to SOL
          if (activeWalletType === 'solana' && publicKey) {
            console.log('Looking for Solana tokens with chain ID:', SOLANA_CHAIN_ID)
            
            // Find SOL token (Solana native) - check multiple possible chain ID formats
            const solToken = allTokens.find(t => {
              const chainIdMatch = Number(t.chainId) === SOLANA_CHAIN_ID || 
                                   Number(t.chainId) === 101 ||
                                   String(t.chainId) === String(SOLANA_CHAIN_ID) ||
                                   String(t.chainId).toUpperCase() === 'SOL';
              const symbolMatch = t.symbol === 'SOL' || t.symbol === 'WSOL';
              return chainIdMatch && symbolMatch;
            })
            
            console.log('Found SOL token:', solToken)
            
            // Find ETH token for destination
            const ethToken = allTokens.find(t => 
              t.chainId === 1 && 
              (t.symbol === 'ETH' || t.address === '0x0000000000000000000000000000000000000000')
            )
            
            console.log('Found ETH token:', ethToken)
            
            if (solToken && ethToken) {
              console.log('Setting default: SOL -> ETH for Solana wallet')
              setFormData(prev => ({
                ...prev,
                fromToken: solToken,
                toToken: ethToken,
                fromChainId: solToken.chainId as number,
                toChainId: 1
              }))
            } else if (solToken) {
              // Just set SOL as from token
              console.log('Setting SOL as from token only')
            setFormData(prev => ({
              ...prev,
                fromToken: solToken,
                fromChainId: solToken.chainId as number,
              }))
            } else {
              console.warn('No SOL token found in available tokens')
            }
          } else {
            // EVM wallet - default to ETH
            const ethToken = allTokens.find(t => 
              t.chainId === 1 && 
              (t.symbol === 'ETH' || t.address === '0x0000000000000000000000000000000000000000')
            )
            const bscToken = allTokens.find(t => 
              t.chainId === 56 && 
              (t.symbol === 'BNB' || t.address === '0x0000000000000000000000000000000000000000')
            )
            
            if (ethToken && bscToken) {
              console.log('Setting default: ETH -> BNB for EVM wallet')
            setFormData(prev => ({
              ...prev,
              fromToken: ethToken,
                toToken: bscToken,
              fromChainId: 1,
                toChainId: 56
            }))
          } else if (ethToken) {
              setFormData(prev => ({
                ...prev,
                fromToken: ethToken,
                fromChainId: 1,
              }))
            }
          }
        }
      } catch (error) {
        console.error('Failed to load tokens and chains:', error)
      }
    }

    loadData()
  }, [activeWalletType, publicKey, evmAddress])

  // Update chains when form data changes
  useEffect(() => {
    if (onChainUpdate && availableChains.length > 0) {
      const fromChain = availableChains.find(c => c.id === formData.fromChainId);
      const toChain = availableChains.find(c => c.id === formData.toChainId);
      onChainUpdate(fromChain, toChain);
    }
  }, [formData.fromChainId, formData.toChainId, availableChains, onChainUpdate]);

  // Update tokens when they change
  useEffect(() => {
    if (onTokenUpdate) {
      onTokenUpdate(formData.fromToken, formData.toToken);
    }
  }, [formData.fromToken, formData.toToken, onTokenUpdate]);

  // Find routes when form data changes
  useEffect(() => {
    if (formData.fromToken && formData.toToken && formData.fromAmount && parseFloat(formData.fromAmount) > 0) {
      findRoutes()
    }
  }, [formData.fromToken, formData.toToken, formData.fromAmount, formData.fromChainId, formData.toChainId])

  const findRoutes = useCallback(async () => {
    if (!formData.fromToken || !formData.toToken || !formData.fromAmount) return

    // Validate tokens before making API call
    if (!formData.fromToken.address || !formData.toToken.address) {
      console.warn('Token addresses are missing')
      return
    }

    // Prevent using the same token for both source and destination
    if (formData.fromToken.address === formData.toToken.address && formData.fromChainId === formData.toChainId) {
      setRouteError('Cannot swap the same token. Please select different tokens.')
      setCurrentRoute(null)
      onRouteUpdate?.(null)
      setIsFindingRoute(false)
      return
    }

    // Get the correct wallet addresses for cross-chain swaps
    const solanaAddress = publicKey?.toBase58()
    const evmWalletAddress = evmAddress
    
    if (!solanaAddress && !evmWalletAddress) {
      console.warn('No wallet connected, cannot fetch quote')
      return
    }

    setIsFindingRoute(true)
    setRouteError(null)
    
    try {
      // Handle Jupiter quotes for Solana swaps
      if (useJupiter && activeWalletType === 'solana' && publicKey) {
        console.log('Using Jupiter for Solana swap')
        
        // Validate amount
        const amountFloat = parseFloat(formData.fromAmount)
        if (isNaN(amountFloat) || amountFloat <= 0) {
          setRouteError('Please enter a valid amount greater than 0')
          setCurrentRoute(null)
          onRouteUpdate?.(null)
          setIsFindingRoute(false)
          return
        }

        // Calculate amount in base units (lamports/atomic units)
        const amount = Math.floor(amountFloat * Math.pow(10, formData.fromToken.decimals))
        if (amount <= 0) {
          setRouteError('Amount too small. Please enter a larger amount.')
          setCurrentRoute(null)
          onRouteUpdate?.(null)
          setIsFindingRoute(false)
          return
        }
        
        // Normalize token addresses for Jupiter (convert System Program to wrapped SOL)
        const inputMint = normalizeTokenAddressForJupiter(formData.fromToken.address, formData.fromToken.symbol)
        const outputMint = normalizeTokenAddressForJupiter(formData.toToken.address, formData.toToken.symbol)
        
        console.log('Jupiter quote request:', { inputMint, outputMint, amount, fromAmount: formData.fromAmount })
        
        const quote = await jupiterService.getQuote(
          inputMint,
          outputMint,
          amount,
          50 // 0.5% slippage
        )

        if (quote) {
          // Format Jupiter quote to match LiFi structure for compatibility
          const jupiterRoute = {
            type: 'jupiter',
            id: `jupiter-${Date.now()}`,
            tool: 'jupiter',
            toolDetails: {
              key: 'jupiter',
              name: 'Jupiter',
              logoURI: 'https://station.jup.ag/logo.png'
            },
            action: {
        fromChainId: formData.fromChainId,
        toChainId: formData.toChainId,
              fromToken: formData.fromToken,
              toToken: formData.toToken,
        fromAmount: amount.toString(),
              toAmount: quote.outAmount
            },
            estimate: {
              toAmount: quote.outAmount,
              priceImpact: quote.priceImpactPct,
              slippage: 0.5
            },
            jupiterQuote: quote // Store original Jupiter quote
          }
          
          setCurrentRoute(jupiterRoute as any)
          
          // Update toAmount with estimated output
          const toAmountFormatted = (parseInt(quote.outAmount) / Math.pow(10, formData.toToken.decimals)).toFixed(6)
          
          setFormData(prev => ({
            ...prev,
            toAmount: toAmountFormatted
          }))

          onRouteUpdate?.(jupiterRoute as any)
        } else {
          setCurrentRoute(null)
          onRouteUpdate?.(null)
          setRouteError('No route found for this token pair. The token may have insufficient liquidity or is not tradable on Solana DEXes. Please try a different token.')
        }
        
        setIsFindingRoute(false)
        return
      }

      const amount = BigInt(Math.floor(parseFloat(formData.fromAmount) * Math.pow(10, formData.fromToken.decimals)))
      
      // Determine source and destination addresses for cross-chain swaps
      // fromAddress should be the source chain's wallet address
      // toAddress (if different chain) should be the destination chain's wallet address
      const SOLANA_CHAIN_ID = 1151111081099710
      const isFromSolana = formData.fromChainId === SOLANA_CHAIN_ID || formData.fromChainId === 101
      const isToSolana = formData.toChainId === SOLANA_CHAIN_ID || formData.toChainId === 101
      
      let fromAddress: string
      let toAddress: string | undefined
      
      if (isFromSolana) {
        // Swapping FROM Solana
        if (!solanaAddress) {
          setRouteError('Solana wallet not connected')
          setIsFindingRoute(false)
          return
        }
        fromAddress = solanaAddress
        
        // If going to EVM chain, need EVM address
        if (!isToSolana) {
          toAddress = formData.manualToAddress || evmWalletAddress
          if (!toAddress) {
            setRouteError('Please provide a destination EVM address')
            setIsFindingRoute(false)
            return
          }
          // Validate EVM address
          if (!validateAddress(toAddress, false)) {
            setRouteError('Invalid destination EVM address. Please enter a valid Ethereum address (0x...)')
            setIsFindingRoute(false)
            return
          }
        }
      } else {
        // Swapping FROM EVM
        if (!evmWalletAddress) {
          setRouteError('EVM wallet not connected')
          setIsFindingRoute(false)
          return
        }
        fromAddress = evmWalletAddress
        
        // If going to Solana, need Solana address
        if (isToSolana) {
          toAddress = formData.manualToAddress || solanaAddress
          if (!toAddress) {
            setRouteError('Please provide a destination Solana address')
            setIsFindingRoute(false)
            return
          }
          // Validate Solana address
          if (!validateAddress(toAddress, true)) {
            setRouteError('Invalid destination Solana address. Please enter a valid Solana address')
            setIsFindingRoute(false)
            return
          }
        }
      }
      
      console.log('From chain:', formData.fromChainId, 'To chain:', formData.toChainId)
      console.log('From address:', fromAddress, 'To address:', toAddress)
      
      // Use getQuote instead of getRoutes - it includes transactionRequest (following LI.FI docs)
      const quoteRequest: QuoteRequest = {
        fromChain: formData.fromChainId.toString(),
        toChain: formData.toChainId.toString(),
        fromToken: formData.fromToken.address,
        toToken: formData.toToken.address,
        fromAmount: amount.toString(),
        fromAddress: fromAddress,
        toAddress: toAddress, // Only set if cross-chain to different ecosystem
          slippage: formData.slippage / 100,
      }

      console.log('Fetching quote with params:', quoteRequest)
      const quote = await getQuote(quoteRequest)

      console.log('Quote received:', quote)
      
      if (quote) {
        setCurrentRoute(quote as any)
        
        // Update toAmount with estimated output
        const toAmountFormatted = lifiService.formatTokenAmount(
          quote.estimate.toAmount,
          formData.toToken.decimals,
          6
        )
        
        setFormData(prev => ({
          ...prev,
          toAmount: toAmountFormatted
        }))

        onRouteUpdate?.(quote as any)
      } else {
        setCurrentRoute(null)
        onRouteUpdate?.(null)
      }
    } catch (error: any) {
      console.error('Failed to find quote:', error)
      
      // Handle specific LiFi SDK errors
      if (error.message && error.message.includes('invalid or in deny list')) {
        const errorMessage = 'Selected token is not supported for swapping. Please try different tokens.'
        setRouteError(errorMessage)
        console.warn(errorMessage)
        // Reset to amount to prevent confusion
        setFormData(prev => ({ ...prev, toAmount: '' }))
      } else if (error.message && error.message.includes('same token cannot be used as both')) {
        const errorMessage = 'Cannot swap the same token. Please select different tokens for source and destination.'
        setRouteError(errorMessage)
        console.warn(errorMessage)
        // Reset to amount to prevent confusion
        setFormData(prev => ({ ...prev, toAmount: '' }))
      } else {
        setRouteError('Failed to find swap route. Please check your inputs and try again.')
      }
      
      setCurrentRoute(null)
      onRouteUpdate?.(null)
    } finally {
      setIsFindingRoute(false)
    }
  }, [formData, onRouteUpdate, evmAddress, publicKey, activeWalletType, useJupiter])

  // Check and set token allowance (for ERC20 tokens)
  const checkAndSetAllowance = useCallback(async (tokenAddress: string, approvalAddress: string, amount: string) => {
    if (!walletClient || !publicClient) {
      throw new Error('Wallet client not available')
    }

    // Skip approval for native tokens (ETH, MATIC, etc.)
    if (tokenAddress === '0x0000000000000000000000000000000000000000') {
      return
    }

    try {
      const ERC20_ABI = [
        {
          name: 'approve',
          inputs: [
            { name: 'spender', type: 'address' },
            { name: 'amount', type: 'uint256' }
          ],
          outputs: [{ name: '', type: 'bool' }],
          stateMutability: 'nonpayable',
          type: 'function'
        },
        {
          name: 'allowance',
          inputs: [
            { name: 'owner', type: 'address' },
            { name: 'spender', type: 'address' }
          ],
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function'
        }
      ] as const

      // Check current allowance using public client
      const allowance = await publicClient.readContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [evmAddress as `0x${string}`, approvalAddress as `0x${string}`]
      })

      // Approve if allowance is insufficient
      if (BigInt(allowance as any) < BigInt(amount)) {
        console.log('Approving token spend...')
        const approveTx = await walletClient.writeContract({
          address: tokenAddress as `0x${string}`,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [approvalAddress as `0x${string}`, BigInt(amount)]
        })
        
        console.log('Approval transaction sent:', approveTx)
        // Wait a bit for approval to be mined
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
    } catch (error) {
      console.error('Approval error:', error)
      throw new Error('Failed to approve token spend')
    }
  }, [walletClient, publicClient, evmAddress])

  const executeSwap = useCallback(async () => {
    // Check wallet connection
    if (!isConnected) {
      setRouteError('Please connect your wallet to execute the swap.')
      return
    }

    // Verify wallet address
    const walletAddress = activeWalletType === 'solana' ? publicKey?.toBase58() : evmAddress
    if (!walletAddress) {
      setRouteError('Wallet address not found. Please reconnect your wallet.')
      return
    }

    // Check if we have a route or if we're using Jupiter
    if (!currentRoute && !useJupiter) {
      setRouteError('No route available. Please try again.')
      return
    }

    // Get source chain name for better error messages
    const fromChain = availableChains.find(c => c.id === formData.fromChainId)

    setIsExecuting(true)
    setRouteError(null)
    setExecutionStep(0)
    setExecutionStatus('Preparing swap...')

    try {
      console.log('Starting swap execution with route:', currentRoute)
      console.log('Current chain:', chain?.id, 'Required chain:', formData.fromChainId)
      console.log('Using Jupiter:', useJupiter)
      
      // Handle Jupiter swaps for Solana
      if (useJupiter && activeWalletType === 'solana' && publicKey) {
        setExecutionStatus('Executing Jupiter swap...')
        setExecutionStep(1)
        
        if (!formData.fromToken || !formData.toToken || !formData.fromAmount) {
          throw new Error('Missing token or amount information')
        }

        // Validate amount
        const amountFloat = parseFloat(formData.fromAmount)
        if (isNaN(amountFloat) || amountFloat <= 0) {
          throw new Error('Please enter a valid amount greater than 0')
        }

        // Calculate amount in base units (lamports/atomic units)
        const amount = Math.floor(amountFloat * Math.pow(10, formData.fromToken.decimals))
        if (amount <= 0) {
          throw new Error('Amount too small. Please enter a larger amount.')
        }

        // Normalize token addresses for Jupiter (convert System Program to wrapped SOL)
        const inputMint = normalizeTokenAddressForJupiter(formData.fromToken.address, formData.fromToken.symbol)
        const outputMint = normalizeTokenAddressForJupiter(formData.toToken.address, formData.toToken.symbol)
        
        console.log('Jupiter swap execution:', { inputMint, outputMint, amount, fromAmount: formData.fromAmount })
        
        // Get Jupiter quote
        const quote = await jupiterService.getQuote(
          inputMint,
          outputMint,
          amount,
          50 // 0.5% slippage
        )

        if (!quote) {
          throw new Error('Failed to get Jupiter quote')
        }

        setExecutionStatus('Getting swap transaction...')
        setExecutionStep(2)

        // Get swap transaction
        const swapResult = await jupiterService.getSwapTransaction(
          quote,
          publicKey.toString(),
          true, // wrapUnwrapSOL
          0 // prioritizationFeeLamports
        )

        if (!swapResult) {
          throw new Error('Failed to get Jupiter swap transaction')
        }

        setExecutionStatus('Signing transaction...')
        setExecutionStep(3)

        // Deserialize and sign transaction
        const transaction = VersionedTransaction.deserialize(
          Buffer.from(swapResult.swapTransaction, 'base64')
        )

        if (!signTransaction) {
          throw new Error('Sign transaction function not available')
        }
        const signedTransaction = await signTransaction(transaction)
        
        setExecutionStatus('Sending transaction...')
        setExecutionStep(4)

        // Send transaction
        const signature = await sendTransaction(signedTransaction, connection, {
          skipPreflight: false,
          preflightCommitment: 'confirmed',
        })

        console.log('✅ Transaction sent! Signature:', signature)
        console.log('🔗 View on Solscan:', `https://solscan.io/tx/${signature}`)
        
        // Store the signature for UI display
        setTxSignature(signature)
        
        // Store transaction in history immediately
        const historyEntry = {
          timestamp: new Date().toISOString(),
          fromToken: formData.fromToken.symbol,
          toToken: formData.toToken.symbol,
          fromAmount: formData.fromAmount,
          toAmount: formData.toAmount || '0',
          transactionHash: signature,
          status: 'completed',
          route: 'Jupiter',
          fromChain: formData.fromChainId,
          toChain: formData.toChainId,
          isProtected: isPrivacy,
        }
        
        const existingHistory = localStorage.getItem('swapHistory')
        const history = existingHistory ? JSON.parse(existingHistory) : []
        history.unshift(historyEntry)
        localStorage.setItem('swapHistory', JSON.stringify(history.slice(0, 50)))

        // Show swap done immediately with link
        setExecutionStatus('Swap done!')
        setExecutionStep(5)
        setIsExecuting(false)
        
        // Call completion callback with signature and explorer link
        onExecutionComplete?.({
          signature,
          success: true,
          type: 'jupiter',
          explorerUrl: `https://solscan.io/tx/${signature}`
        })

        // Note: We intentionally don't wait for confirmation to avoid timeout errors
        // The transaction is already submitted and will be confirmed by the network
        // Users can check status on Solscan using the link above

        setTimeout(() => {
          setExecutionStatus('')
          setExecutionStep(0)
          setTxSignature('')
        }, 5000)

        return
      }

      // Handle LiFi swaps for EVM chains
      if (!walletClient && activeWalletType !== 'solana') {
        throw new Error('Wallet client not available')
      }

      // IMPORTANT: Must be on the source chain to send the transaction
      // Only check chain for EVM wallets (not Solana)
      if (activeWalletType !== 'solana' && chain?.id !== formData.fromChainId) {
        setExecutionStatus('Please switch to the source network...')
        setExecutionStep(1)
        
        if (!switchChainAsync) {
          setRouteError(`Please manually switch your wallet to ${fromChain?.name || 'source chain'}`)
          setIsExecuting(false)
          setExecutionStatus('')
          return
        }

        try {
          console.log(`Switching chain from ${chain?.id} to ${formData.fromChainId}`)
          await switchChainAsync({ chainId: formData.fromChainId })
          console.log('Chain switch successful, waiting for confirmation...')
          // Wait longer for chain switch to fully complete
          await new Promise(resolve => setTimeout(resolve, 2000))
          setExecutionStep(2)
        } catch (switchError: any) {
          console.error('Failed to switch chain:', switchError)
          if (switchError.code === 4001) {
            setRouteError('Chain switch was rejected. Please switch to the source network manually.')
          } else {
            setRouteError(`Please switch your wallet to ${fromChain?.name || 'the source chain'} to continue.`)
          }
          setIsExecuting(false)
          setExecutionStatus('')
          return
        }
      }

      // Step 1: Check and set token allowance (following LI.FI docs)
      // Quote object has action.fromToken and estimate.approvalAddress
      // Skip for Solana as source chain (Solana doesn't use EVM approval system)
      const quote = currentRoute as any
      const tokenAddress = quote.action?.fromToken?.address || formData.fromToken?.address
      const approvalAddress = quote.estimate?.approvalAddress
      const amount = quote.action?.fromAmount || quote.estimate?.fromAmount
      
      const SOLANA_CHAIN_ID = 1151111081099710
      const isFromSolana = formData.fromChainId === SOLANA_CHAIN_ID || formData.fromChainId === 101

      // Only check allowance for EVM → EVM swaps (not Solana → EVM)
      if (approvalAddress && tokenAddress && amount && !isFromSolana) {
        setExecutionStatus('Checking token approval...')
        setExecutionStep(3)
        console.log('Checking token allowance...')
        await checkAndSetAllowance(tokenAddress, approvalAddress, amount)
      }

      // Step 2: Execute the transaction (following LI.FI docs)
      setExecutionStatus('Confirm transaction in wallet...')
      setExecutionStep(4)
      console.log('Sending transaction...')
      console.log('Wallet chain before transaction:', chain?.id)
      
      // Get transaction request from quote (as per LI.FI docs: quote.transactionRequest)
      const transactionRequest = quote.transactionRequest
      
      if (!transactionRequest) {
        console.error('Quote object:', quote)
        throw new Error('No transaction request found in quote. Make sure you are using getQuote() instead of getRoutes().')
      }

      console.log('Transaction request:', transactionRequest)

      // Handle Solana → EVM cross-chain swaps
      if (isFromSolana && activeWalletType === 'solana' && publicKey && sendTransaction) {
        console.log('Executing Solana → EVM cross-chain swap via LiFi')
        
        // For Solana transactions from LiFi, the transactionRequest contains serialized transaction
        const transaction = VersionedTransaction.deserialize(
          Buffer.from(transactionRequest.data, 'base64')
        )
        
        if (!signTransaction) {
          throw new Error('Sign transaction function not available')
        }
        
        const signedTransaction = await signTransaction(transaction)
        const signature = await sendTransaction(signedTransaction, connection, {
          skipPreflight: false,
          preflightCommitment: 'confirmed',
        })
        
        console.log('Solana transaction sent! Signature:', signature)
        
        // Wait for confirmation
        await connection.confirmTransaction(signature, 'confirmed')
        
        const txHash = signature
        
        // Continue with cross-chain monitoring...
        setExecutionStatus('Transaction submitted! Waiting for confirmation...')
        setExecutionStep(5)
        console.log('Waiting for transaction confirmation...')
        await new Promise(resolve => setTimeout(resolve, 5000))

        // Step 3: Check status for cross-chain transfers (following LI.FI docs)
        if (formData.fromChainId !== formData.toChainId) {
          setExecutionStatus('Bridging tokens to destination chain...')
          setExecutionStep(6)
          console.log('Cross-chain swap detected, monitoring status...')
      await new Promise(resolve => setTimeout(resolve, 3000))
        }

        setExecutionStatus('Swap completed!')
        setExecutionStep(formData.fromChainId !== formData.toChainId ? 7 : 5)
        console.log('Swap completed successfully!')
        
        // Store swap in history
        const swapRecord = {
          transactionHash: txHash,
          fromToken: formData.fromToken?.symbol || '',
          toToken: formData.toToken?.symbol || '',
          fromAmount: formData.fromAmount,
          toAmount: formData.toAmount,
          fromChain: formData.fromChainId,
          toChain: formData.toChainId,
          timestamp: new Date().toISOString(),
          status: 'completed',
          isProtected: isPrivacy
        }
        
        // Save to localStorage
        const existingHistory = JSON.parse(localStorage.getItem('swapHistory') || '[]')
        localStorage.setItem('swapHistory', JSON.stringify([swapRecord, ...existingHistory].slice(0, 10)))
        
        // Notify completion
      const result = {
          transactionHash: txHash,
        route: currentRoute,
          status: 'completed',
          swapRecord
        }
        onExecutionComplete?.(result)
        
        // Reset form after 2 seconds
        setTimeout(() => {
          setExecutionStatus('')
          setExecutionStep(0)
        }, 2000)

        return
      }

      // Handle EVM → EVM swaps
      // Verify we're on the correct chain before sending
      if (chain?.id !== formData.fromChainId) {
        throw new Error(`Wallet is on wrong chain. Expected ${formData.fromChainId}, got ${chain?.id}. Please switch networks.`)
      }

      // Send transaction using wallet client (following LI.FI docs)
      if (!walletClient) {
        throw new Error('Wallet client not available')
      }
      const txHash = await walletClient.sendTransaction({
        to: transactionRequest.to as `0x${string}`,
        data: transactionRequest.data as `0x${string}`,
        value: transactionRequest.value ? BigInt(transactionRequest.value) : BigInt(0),
        gas: transactionRequest.gasLimit ? BigInt(transactionRequest.gasLimit) : undefined,
        gasPrice: transactionRequest.gasPrice ? BigInt(transactionRequest.gasPrice) : undefined,
        chainId: formData.fromChainId, // Explicitly set the chain ID
      })

      console.log('Transaction sent! Hash:', txHash)

      // Wait for transaction to be mined
      setExecutionStatus('Transaction submitted! Waiting for confirmation...')
      setExecutionStep(5)
      console.log('Waiting for transaction confirmation...')
      await new Promise(resolve => setTimeout(resolve, 5000))

      // Step 3: Check status for cross-chain transfers (following LI.FI docs)
      if (formData.fromChainId !== formData.toChainId) {
        setExecutionStatus('Bridging tokens to destination chain...')
        setExecutionStep(6)
        console.log('Cross-chain swap detected, monitoring status...')
        // In production, you would poll the /status endpoint here
      await new Promise(resolve => setTimeout(resolve, 3000))
      }

      setExecutionStatus('Swap completed!')
      setExecutionStep(formData.fromChainId !== formData.toChainId ? 7 : 5)
      console.log('Swap completed successfully!')
      
      // Store swap in history
      const swapRecord = {
        transactionHash: txHash,
        fromToken: formData.fromToken?.symbol || '',
        toToken: formData.toToken?.symbol || '',
        fromAmount: formData.fromAmount,
        toAmount: formData.toAmount,
        fromChain: formData.fromChainId,
        toChain: formData.toChainId,
        timestamp: new Date().toISOString(),
        status: 'completed',
        isProtected: isPrivacy
      }
      
      // Save to localStorage
      const existingHistory = JSON.parse(localStorage.getItem('swapHistory') || '[]')
      localStorage.setItem('swapHistory', JSON.stringify([swapRecord, ...existingHistory].slice(0, 10)))
      
      // Notify completion
      const result = {
        transactionHash: txHash,
        route: currentRoute,
        status: 'completed',
        swapRecord
      }
      onExecutionComplete?.(result)
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setExecutionStatus('')
        setExecutionStep(0)
      }, 2000)

    } catch (error: any) {
      // Handle specific error cases
      const errorName = error.name || error.constructor?.name || ''
      const errorMessage = error.message?.toLowerCase() || ''
      
      if (
        error.code === 4001 || 
        errorName === 'WalletSendTransactionError' ||
        errorName === 'WalletSignTransactionError' ||
        errorMessage.includes('user rejected') ||
        errorMessage.includes('user cancelled')
      ) {
        // User rejection is not an error, just log as info
        console.log('User rejected the transaction')
        setRouteError('User rejected')
      } else if (error.message?.includes('insufficient funds')) {
      console.error('Failed to execute swap:', error)
        setRouteError('Insufficient funds for this transaction.')
      } else if (error.message?.includes('network')) {
        console.error('Failed to execute swap:', error)
        setRouteError('Network error. Please check your connection and try again.')
      } else if (error.message?.includes('approve') || error.message?.includes('allowance')) {
        console.error('Failed to execute swap:', error)
        setRouteError('Token approval failed. Please try again.')
      } else {
        console.error('Failed to execute swap:', error)
        setRouteError(error.message || 'Failed to execute swap. Please try again.')
      }
    } finally {
      setIsExecuting(false)
      setExecutionStatus('')
      setExecutionStep(0)
    }
  }, [
    currentRoute, 
    onExecutionComplete, 
    isConnected, 
    activeWalletType,
    evmAddress,
    publicKey,
    signTransaction,
    sendTransaction,
    walletClient,
    chain,
    formData,
    switchChainAsync,
    checkAndSetAllowance,
    isPrivacy,
    availableChains,
    useJupiter,
    connection
  ])

  const handleModeChange = useCallback((newMode: number) => {
    const modeType = newMode === 1 ? 'market' : 'limit'
    setMode(modeType)
  }, [])

  const handleFromAmountChange = useCallback((amount: string) => {
    setFormData(prev => ({ ...prev, fromAmount: amount }))
  }, [])

  const handleToAmountChange = useCallback((amount: string) => {
    setFormData(prev => ({ ...prev, toAmount: amount }))
  }, [])

  const handleTokenSelect = useCallback((token: Token, type: 'from' | 'to') => {
    // Clear any previous route errors when tokens change
    setRouteError(null)
    
    if (type === 'from') {
      // Check if selecting the same token as destination
      if (formData.toToken && token.address === formData.toToken.address && token.chainId === formData.toToken.chainId) {
        setRouteError('Cannot select the same token for both source and destination.')
        setShowTokenModal(null)
        return
      }
      
      setFormData(prev => ({
        ...prev,
        fromToken: token,
        fromChainId: token.chainId,
        fromAmount: '', // Clear amount when token changes
        toAmount: '' // Clear output amount too
      }))
    } else {
      // Check if selecting the same token as source
      if (formData.fromToken && token.address === formData.fromToken.address && token.chainId === formData.fromToken.chainId) {
        setRouteError('Cannot select the same token for both source and destination.')
        setShowTokenModal(null)
        return
      }
      
      setFormData(prev => ({
        ...prev,
        toToken: token,
        toChainId: token.chainId,
        toAmount: '' // Clear output amount when token changes
      }))
    }
    setShowTokenModal(null)
  }, [formData.fromToken, formData.toToken])

  const handleOpenTokenModal = useCallback((type: 'from' | 'to') => {
    setShowTokenModal(type)
  }, [])

  const handleSlippageChange = useCallback((slippage: number) => {
    setFormData(prev => ({ ...prev, slippage }))
  }, [])

  const swapTokens = useCallback(() => {
    // Clear any previous route errors when swapping tokens
    setRouteError(null)
    
    setFormData(prev => ({
      ...prev,
      fromToken: prev.toToken,
      toToken: prev.fromToken,
      fromAmount: prev.toAmount,
      toAmount: prev.fromAmount,
      fromChainId: prev.toChainId,
      toChainId: prev.fromChainId
    }))
  }, [])

  return (
    <div className="bg-card border-[1px] border-input p-6 flex flex-col gap-5">
      <div className="flex justify-between items-center">
      <SwitchButton 
        isLoading={isLoading} 
        value={mode === 'market' ? 1 : 2} 
        setValue={handleModeChange} 
        firstOptionName="Market" 
        secondOptionName="Limit"
      />
        {useJupiter && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <span>⚡</span>
            Powered by Aether
          </div>
        )}
      </div>

      <div className="relative">
        <EnhancedTokenPanel 
          title="From" 
          isLoading={isLoading}
          token={formData.fromToken}
          amount={formData.fromAmount}
          onAmountChange={handleFromAmountChange}
          onTokenSelect={(token) => handleTokenSelect(token, 'from')}
          availableTokens={availableTokens}
          availableChains={availableChains}
        />
        
        {mode === 'limit' && (
          <div className="flex flex-col gap-2.5 mt-2.5">
            <div className="text-sm text-muted-foreground font-medium">
              Limit price
            </div>
            <input 
              type="number" 
              className="bg-background border border-input px-3 py-2.5 w-full text-sm outline-none rounded" 
              placeholder={`Price in ${formData.toToken?.symbol || 'TOKEN'}`}
              value={limitValue} 
              onChange={(e) => setLimitValue(e.target.value)} 
            />
          </div>
        )}
        
        <div 
          className={`absolute ${mode === 'market' ? 'bottom-[-40.5px]' : 'bottom-[-70.5px]'} left-[calc(50%-22.5px)] bg-card border-[1px] border-input rounded-full p-2 flex justify-center items-center w-15 h-15 cursor-pointer hover:bg-accent transition-colors`}
          onClick={swapTokens}
        >
          <div className="w-[45px] h-[45px] flex items-center justify-center bg-background rounded-full">
            <IoSwapVertical size={20} />
          </div>
        </div>
      </div>

      <div className={`${mode === 'market' ? '' : 'mt-16'}`}>
        <EnhancedTokenPanel 
          title="To" 
          isLoading={isLoading}
          token={formData.toToken}
          amount={formData.toAmount}
          onAmountChange={handleToAmountChange}
          onTokenSelect={(token) => handleTokenSelect(token, 'to')}
          availableTokens={availableTokens}
          availableChains={availableChains}
          isOutput={true}
        />
      </div>

      {/* Manual Destination Address for Cross-Ecosystem Swaps */}
      {formData.fromToken && formData.toToken && (() => {
        const SOLANA_CHAIN_ID = 1151111081099710
        const isFromSolana = formData.fromChainId === SOLANA_CHAIN_ID || formData.fromChainId === 101
        const isToSolana = formData.toChainId === SOLANA_CHAIN_ID || formData.toChainId === 101
        const isCrossEcosystem = isFromSolana !== isToSolana
        
        // Always show address input for cross-ecosystem swaps
        const needsManualAddress = isCrossEcosystem

        if (!needsManualAddress) return null

        return (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-yellow-500 text-sm font-medium">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                </svg>
                Destination Wallet Required
              </div>
              <div className="text-xs text-muted-foreground">
                {isToSolana 
                  ? (publicKey 
                      ? `Sending to Solana wallet: ${publicKey.toBase58().substring(0, 6)}...${publicKey.toBase58().slice(-4)} (or enter a different address below):`
                      : "You're sending to Solana but don't have a Solana wallet connected. Please enter the destination Solana address:")
                  : (evmAddress
                      ? `Sending to EVM wallet: ${evmAddress.substring(0, 6)}...${evmAddress.slice(-4)} (or enter a different address below):`
                      : "You're sending to an EVM chain but don't have an EVM wallet connected. Please enter the destination address:")
                }
              </div>
              <input
                type="text"
                placeholder={
                  isToSolana 
                    ? (publicKey ? `Default: ${publicKey.toBase58().substring(0, 8)}...` : "Solana address (e.g., CTL...Aqu)")
                    : (evmAddress ? `Default: ${evmAddress.substring(0, 10)}...` : "EVM address (0x...)")
                }
                value={formData.manualToAddress || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, manualToAddress: e.target.value }))}
                className="w-full bg-background border border-input px-3 py-2.5 text-sm outline-none rounded focus:border-primary transition-colors"
              />
              {formData.manualToAddress && (
                <div className="text-xs">
                  {validateAddress(formData.manualToAddress, isToSolana) 
                    ? <span className="text-green-500">✓ Valid address</span>
                    : <span className="text-red-500">✗ Invalid address format</span>
                  }
                </div>
              )}
            </div>
          </div>
        )
      })()}

      {/* Route Information */}
      <RouteDisplay
        route={currentRoute}
        isLoading={isFindingRoute}
        onRouteSelect={(route) => setCurrentRoute(route)}
      />

      {/* Error Display */}
      {routeError && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="text-red-500 text-sm font-medium">
            {routeError}
          </div>
          <div className="text-red-400 text-xs mt-1">
            Try selecting different tokens or check if the tokens are supported.
          </div>
        </div>
      )}

      <PrivacyMode 
        isPrivacy={isPrivacy} 
        setIsPrivacy={setIsPrivacy} 
        isLoading={isLoading} 
      />

      {isPrivacy && <SwapAIRoute />}
      
      {isPrivacy && (
        <DetailAccordion 
          icon={SettingIcon} 
          title="Advanced Settings" 
          className="!border-none pl-0"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="text-xs text-foreground">
                Slippage Tolerance: {formData.slippage}%
              </div>
              <Progressbar 
                now={(formData.slippage / 5) * 100} 
                min={0} 
                max={100} 
                color="bg-primary rounded-full" 
                containerClass="bg-[#bb3eff26] !h-2 !border-none" 
              />
            </div>
            <div className="flex gap-2">
              {[0.1, 0.5, 1].map((slippage) => (
                <div 
                  key={slippage}
                  className={`cursor-pointer w-10 h-7 border flex items-center justify-center text-xs rounded transition-colors ${
                    formData.slippage === slippage
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-input bg-background text-muted-foreground hover:bg-accent'
                  }`}
                  onClick={() => handleSlippageChange(slippage)}
                >
                  {slippage}%
                </div>
              ))}
            </div>
          </div>
        </DetailAccordion>
      )}

      {isPrivacy && (
        <SwapTransactionDetail 
          route={currentRoute}
          fromToken={formData.fromToken}
          toToken={formData.toToken}
          fromAmount={formData.fromAmount}
          slippage={formData.slippage}
        />
      )}

      {/* Execution Progress Display */}
      {isExecuting && executionStatus && (
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">{executionStatus}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Step {executionStep} of {formData.fromChainId !== formData.toChainId ? '7' : '5'}
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 bg-background rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-500 ease-out"
              style={{ width: `${(executionStep / (formData.fromChainId !== formData.toChainId ? 7 : 5)) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {!isExecuting && (executionStatus === 'Swap completed!' || executionStatus === 'Swap done!') && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="text-green-500 text-2xl">✓</div>
            <div className="flex-1">
              <div className="text-sm font-medium text-green-500">Swap Done!</div>
              <div className="text-xs text-muted-foreground mt-1">
                Your transaction has been submitted to the network
              </div>
              {txSignature && (
                <a 
                  href={`https://solscan.io/tx/${txSignature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline mt-2 inline-flex items-center gap-1"
                >
                  View on Solscan →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <button 
        className={`w-full h-10 text-xs text-foreground cursor-pointer rounded transition-colors ${
          !currentRoute || isExecuting || isFindingRoute || !isConnected
            ? 'bg-gray-600 cursor-not-allowed'
            : 'gradient-bg hover:opacity-90'
        }`}
        onClick={executeSwap}
        disabled={!currentRoute || isExecuting || isFindingRoute || !isConnected}
      >
        {isLoading && <Bar barClassName="w-8 h-3 mx-auto"/>}
        {!isConnected && "Connect Wallet to Swap"}
        {isConnected && isFindingRoute && (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-foreground"></div>
            Finding Best Route...
          </span>
        )}
        {isConnected && isExecuting && (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-foreground"></div>
            {executionStatus || 'Executing Swap...'}
          </span>
        )}
        {isConnected && !isLoading && !isFindingRoute && !isExecuting && currentRoute && "Swap"}
        {isConnected && !isLoading && !isFindingRoute && !isExecuting && !currentRoute && "Select Tokens"}
      </button>

      {/* Token Selection Modals */}
      <TokenSelectionModal
        isOpen={showTokenModal === 'from'}
        onClose={() => setShowTokenModal(null)}
        onTokenSelect={(token) => handleTokenSelect(token, 'from')}
        availableTokens={availableTokens}
        availableChains={availableChains}
        selectedChainId={formData.fromChainId}
        title="Select Token to Send"
      />

      <TokenSelectionModal
        isOpen={showTokenModal === 'to'}
        onClose={() => setShowTokenModal(null)}
        onTokenSelect={(token) => handleTokenSelect(token, 'to')}
        availableTokens={availableTokens}
        availableChains={availableChains}
        selectedChainId={formData.toChainId}
        title="Select Token to Receive"
      />
    </div>
  )
}

export default CustomSwapUI
