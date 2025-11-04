'use client'

import { LiFiWidget } from '@lifi/widget'
import { useCallback, useRef, useState } from 'react'
import type { WidgetConfig, WidgetDrawer } from '@lifi/widget'
import { lifiService } from '../../services/lifi.service'

interface CustomLiFiWidgetProps {
  isOpen?: boolean
  onClose?: () => void
  variant?: 'compact' | 'wide' | 'drawer'
  isLoading?: boolean
  className?: string
}

const CustomLiFiWidget = ({ 
  isOpen = false, 
  onClose,
  variant = 'compact',
  isLoading = false,
  className = ''
}: CustomLiFiWidgetProps) => {
  const widgetRef = useRef<WidgetDrawer>(null)
  const elementRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<any>(null)
  const [isWidgetLoading, setIsWidgetLoading] = useState(true)

  // Initialize LiFi service
  const lifiServiceInstance = lifiService

  // Create widget configuration
  const widgetConfig: WidgetConfig = {
    integrator: 'aetherDex',
    fee: 0.02, // 2% fee
    variant,
    appearance: 'dark',
    theme: {
      container: {
        borderRadius: '12px',
        boxShadow: 'none',
        background: 'transparent',
      },
      colorSchemes: {
        dark: {
          palette: {
            primary: {
              main: '#bb3eff',
            },
            secondary: {
              main: '#1a1a1a',
            },
            background: {
              default: '#0a0a0a',
              paper: '#1a1a1a',
            },
            text: {
              primary: '#ffffff',
              secondary: '#a0a0a0',
            },
          },
        },
      },
      shape: {
        borderRadius: 12,
      },
    },
    // Hide unnecessary UI elements for cleaner look
    hiddenUI: [
      'poweredBy',
      'history',
      'language',
      'appearance',
    ],
    // Enable specific features
    defaultUI: {
      transactionDetailsExpanded: false,
    },
    // Wallet configuration
    walletConfig: {
      onConnect: () => {
        console.log('Wallet connection initiated')
      },
    },
    // Chain and token restrictions (optional)
    chains: {
      allow: [1, 56, 137, 42161, 10, 250, 43114], // Popular chains
    },
    // Slippage settings
    slippage: 0.5, // 0.5% default slippage
    // Route settings
    routePriority: 'RECOMMENDED',
    useRecommendedRoute: true,
  }

  // Handle widget events
  const handleWidgetEvents = useCallback(() => {
    const cleanup = lifiServiceInstance.setupEventListeners({
      onRouteExecutionStarted: () => {
        console.log('Route execution started')
        setIsWidgetLoading(true)
      },
      onRouteExecutionCompleted: (event) => {
        console.log('Route execution completed:', event)
        setIsWidgetLoading(false)
      },
      onRouteExecutionFailed: (event) => {
        console.log('Route execution failed:', event)
        setIsWidgetLoading(false)
      },
      onRouteUpdate: (event) => {
        console.log('Route updated:', event)
      },
    })

    return cleanup
  }, [lifiServiceInstance])

  // Set widget reference in service
  const handleWidgetRef = useCallback((ref: WidgetDrawer | null) => {
    if (ref) {
      lifiServiceInstance.setWidgetRef(ref)
      widgetRef.current = ref
    }
  }, [lifiServiceInstance])

  // Handle widget close
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose()
    }
  }, [onClose])

  if (isLoading) {
    return (
      <div className={`bg-card border border-input rounded-xl p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-4"></div>
          <div className="h-32 bg-gray-700 rounded mb-4"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-card border border-input rounded-xl overflow-hidden ${className}`}>
      <LiFiWidget
        ref={handleWidgetRef}
        config={widgetConfig}
        integrator="aetherDex"
        open={isOpen}
        onClose={handleClose}
        elementRef={elementRef as React.RefObject<HTMLDivElement>}
        formRef={formRef}
      />
    </div>
  )
}

export default CustomLiFiWidget
