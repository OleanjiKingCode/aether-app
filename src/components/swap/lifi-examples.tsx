'use client'

import { useState } from 'react'
import CustomLiFiWidget from './custom-lifi-widget'
import LiFiIntegration from './lifi-integration'
import HybridSwap from './hybrid-swap'

/**
 * Example component demonstrating different ways to use LiFi widgets
 * This is for demonstration purposes - you can remove this file if not needed
 */
const LiFiExamples = () => {
  const [activeExample, setActiveExample] = useState<'basic' | 'advanced' | 'hybrid'>('basic')
  const [isLoading, setIsLoading] = useState(false)

  const handleRouteUpdate = (route: any) => {
    console.log('Route updated in example:', route)
  }

  const handleExecutionComplete = (result: any) => {
    console.log('Execution completed in example:', result)
    setIsLoading(false)
  }

  const handleExecutionStart = () => {
    console.log('Execution started in example')
    setIsLoading(true)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">LiFi Widget Examples</h1>
        <p className="text-muted-foreground mb-6">
          Choose an example to see different ways to integrate the LiFi widget
        </p>
      </div>

      {/* Example Selector */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveExample('basic')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeExample === 'basic'
              ? 'bg-primary text-white'
              : 'bg-card border border-input text-foreground hover:bg-accent'
          }`}
        >
          Basic Widget
        </button>
        <button
          onClick={() => setActiveExample('advanced')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeExample === 'advanced'
              ? 'bg-primary text-white'
              : 'bg-card border border-input text-foreground hover:bg-accent'
          }`}
        >
          Advanced Integration
        </button>
        <button
          onClick={() => setActiveExample('hybrid')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeExample === 'hybrid'
              ? 'bg-primary text-white'
              : 'bg-card border border-input text-foreground hover:bg-accent'
          }`}
        >
          Hybrid Approach
        </button>
      </div>

      {/* Example Descriptions */}
      <div className="bg-card border border-input rounded-lg p-4 mb-6">
        <h3 className="font-semibold mb-2">
          {activeExample === 'basic' && 'Basic Widget'}
          {activeExample === 'advanced' && 'Advanced Integration'}
          {activeExample === 'hybrid' && 'Hybrid Approach'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {activeExample === 'basic' && 
            'Simple LiFi widget with basic configuration and AetherDex theming.'}
          {activeExample === 'advanced' && 
            'Advanced integration with custom event handling, theming options, and loading states.'}
          {activeExample === 'hybrid' && 
            'Combines your existing swap UI with LiFi widget functionality, allowing users to toggle between interfaces.'}
        </p>
      </div>

      {/* Example Components */}
      <div className="min-h-[500px]">
        {activeExample === 'basic' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic LiFi Widget</h3>
            <CustomLiFiWidget 
              variant="compact"
              isLoading={isLoading}
              className="min-h-[400px]"
            />
          </div>
        )}

        {activeExample === 'advanced' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Advanced Integration</h3>
            <LiFiIntegration
              variant="wide"
              isLoading={isLoading}
              onRouteUpdate={handleRouteUpdate}
              onExecutionStart={handleExecutionStart}
              onExecutionComplete={handleExecutionComplete}
              customTheme={{
                container: {
                  borderRadius: '16px',
                },
                colorSchemes: {
                  dark: {
                    palette: {
                      primary: {
                        main: '#bb3eff',
                      },
                    },
                  },
                },
              }}
              className="min-h-[500px]"
            />
          </div>
        )}

        {activeExample === 'hybrid' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hybrid Swap Component</h3>
            <HybridSwap
              isLoading={isLoading}
              useLiFiWidget={false}
              onSwapModeChange={(mode) => {
                console.log('Swap mode changed to:', mode)
              }}
              onRouteUpdate={handleRouteUpdate}
              onExecutionComplete={handleExecutionComplete}
            />
          </div>
        )}
      </div>

      {/* Code Examples */}
      <div className="bg-card border border-input rounded-lg p-4">
        <h3 className="font-semibold mb-2">Code Example</h3>
        <pre className="text-sm bg-background p-4 rounded-lg overflow-x-auto">
          <code>
{activeExample === 'basic' && `import CustomLiFiWidget from './custom-lifi-widget'

<CustomLiFiWidget 
  variant="compact"
  isLoading={false}
  className="my-custom-class"
/>`}

{activeExample === 'advanced' && `import LiFiIntegration from './lifi-integration'

<LiFiIntegration
  variant="wide"
  onRouteUpdate={(route) => {
    console.log('New route found:', route)
  }}
  onExecutionComplete={(result) => {
    console.log('Swap completed:', result)
  }}
  customTheme={{
    container: { borderRadius: '16px' }
  }}
/>`}

{activeExample === 'hybrid' && `import HybridSwap from './hybrid-swap'

<HybridSwap
  useLiFiWidget={false}
  onSwapModeChange={(mode) => {
    console.log('Swap mode changed to:', mode)
  }}
  onRouteUpdate={(route) => {
    // Handle route updates
  }}
  onExecutionComplete={(result) => {
    // Handle swap completion
  }}
/>`}
          </code>
        </pre>
      </div>
    </div>
  )
}

export default LiFiExamples
