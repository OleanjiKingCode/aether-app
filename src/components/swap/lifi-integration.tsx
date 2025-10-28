'use client'

import { LiFiWidget } from '@lifi/widget'
import { useCallback, useRef, useState, useEffect } from 'react'
import type { WidgetConfig, WidgetDrawer } from '@lifi/widget'
import { lifiService } from '../../services/lifi.service'

interface LiFiIntegrationProps {
  variant?: 'compact' | 'wide' | 'drawer'
  isLoading?: boolean
  className?: string
  onRouteUpdate?: (route: any) => void
  onExecutionStart?: () => void
  onExecutionComplete?: (result: any) => void
  customTheme?: any
}

const LiFiIntegration = ({ 
  variant = 'compact',
  isLoading = false,
  className = '',
  onRouteUpdate,
  onExecutionStart,
  onExecutionComplete,
  customTheme
}: LiFiIntegrationProps) => {
  const widgetRef = useRef<WidgetDrawer>(null)
  const elementRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<any>(null)
  const [isWidgetReady, setIsWidgetReady] = useState(false)

  // Initialize LiFi service
  const lifiServiceInstance = lifiService

  // Create widget configuration with AetherDex branding
  const widgetConfig: WidgetConfig = {
    integrator: 'aetherdapp',
    variant,
    appearance: 'dark',
    theme: {
      container: {
        borderRadius: '12px',
        boxShadow: 'none',
        background: 'transparent',
        border: 'none',
      },
      colorSchemes: {
        dark: {
          palette: {
            primary: {
              main: '#bb3eff',
              contrastText: '#ffffff',
            },
            secondary: {
              main: '#1a1a1a',
              contrastText: '#ffffff',
            },
            background: {
              default: '#0a0a0a',
              paper: '#1a1a1a',
            },
            surface: {
              main: '#1a1a1a',
            },
            text: {
              primary: '#ffffff',
              secondary: '#a0a0a0',
            },
            divider: '#2a2a2a',
          },
        },
      },
      shape: {
        borderRadius: 12,
      },
      typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontSize: '1.5rem',
          fontWeight: 600,
        },
        h2: {
          fontSize: '1.25rem',
          fontWeight: 600,
        },
        body1: {
          fontSize: '0.875rem',
          lineHeight: 1.5,
        },
        body2: {
          fontSize: '0.75rem',
          lineHeight: 1.4,
        },
      },
      ...customTheme,
    },
    // Hide UI elements for cleaner integration
    hiddenUI: [
      'poweredBy',
      'history',
      'language',
      'appearance',
      'drawerCloseButton',
    ],
    // Configure default UI behavior
    defaultUI: {
      transactionDetailsExpanded: false,
      navigationHeaderTitleNoWrap: true,
    },
    // Wallet configuration
    walletConfig: {
      onConnect: () => {
        console.log('AetherDex: Wallet connection initiated')
      },
    },
    // Chain and token configuration
    chains: {
      allow: [
        1,     // Ethereum
        56,    // BSC
        137,   // Polygon
        42161, // Arbitrum
        10,    // Optimism
        250,   // Fantom
        43114, // Avalanche
        25,    // Cronos
        100,   // Gnosis
      ],
    },
    // Swap settings
    slippage: 0.5, // 0.5% default slippage
    routePriority: 'RECOMMENDED',
    useRecommendedRoute: true,
    minFromAmountUSD: 1, // Minimum $1 swap
  }

  // Handle widget events
  const handleWidgetEvents = useCallback(() => {
    const cleanup = lifiServiceInstance.setupEventListeners({
      onRouteExecutionStarted: () => {
        console.log('AetherDex: Route execution started')
        setIsWidgetReady(false)
        onExecutionStart?.()
      },
      onRouteExecutionCompleted: (event) => {
        console.log('AetherDex: Route execution completed:', event)
        setIsWidgetReady(true)
        onExecutionComplete?.(event)
      },
      onRouteExecutionFailed: (event) => {
        console.log('AetherDex: Route execution failed:', event)
        setIsWidgetReady(true)
      },
      onRouteUpdate: (event) => {
        console.log('AetherDex: Route updated:', event)
        onRouteUpdate?.(event)
      },
    })

    return cleanup
  }, [lifiServiceInstance, onRouteUpdate, onExecutionStart, onExecutionComplete])

  // Set widget reference in service
  const handleWidgetRef = useCallback((ref: WidgetDrawer | null) => {
    if (ref) {
      lifiServiceInstance.setWidgetRef(ref)
      widgetRef.current = ref
      setIsWidgetReady(true)
    }
  }, [lifiServiceInstance])

  // Setup event listeners on mount
  useEffect(() => {
    const cleanup = handleWidgetEvents()
    return cleanup
  }, [handleWidgetEvents])

  // Loading state
  if (isLoading) {
    return (
      <div className={`bg-card border border-input rounded-xl p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-card border border-input rounded-xl overflow-hidden ${className}`}>
      <div className="relative">
        <LiFiWidget
          ref={handleWidgetRef}
          config={widgetConfig}
          integrator="aetherdapp"
          elementRef={elementRef as React.RefObject<HTMLDivElement>}
          formRef={formRef}
        />
        {!isWidgetReady && (
          <div className="absolute inset-0 bg-card/80 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading swap interface...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LiFiIntegration
