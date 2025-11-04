/**
 * LI.FI Widget Service - Manages LI.FI widget integration
 *
 * This service provides utilities for working with the @lifi/widget package
 * and customizing its behavior to match your application's needs.
 */

export interface LifiWidgetConfig {
  integrator: string;
  fee?: number;
  theme?: {
    container?: {
      borderRadius?: string;
      boxShadow?: string;
    };
    colors?: {
      primary?: string;
      secondary?: string;
      background?: string;
      surface?: string;
      text?: string;
      textSecondary?: string;
    };
  };
}

export interface RouteInfo {
  fromToken: {
    symbol: string;
    name: string;
    address: string;
    chainId: number;
    decimals: number;
  };
  toToken: {
    symbol: string;
    name: string;
    address: string;
    chainId: number;
    decimals: number;
  };
  fromAmount: string;
  toAmount: string;
  fromChainId: number;
  toChainId: number;
  gasCosts?: Array<{
    type: string;
    amount: string;
    amountUSD: string;
  }>;
  estimate?: {
    executionDuration: number;
  };
}

class LifiService {
  private static instance: LifiService;
  private widgetRef: unknown = null;

  private constructor() {}

  static getInstance(): LifiService {
    if (!LifiService.instance) {
      LifiService.instance = new LifiService();
    }
    return LifiService.instance;
  }

  /**
   * Set widget reference
   */
  setWidgetRef(ref: unknown) {
    this.widgetRef = ref;
  }

  /**
   * Get widget reference
   */
  getWidgetRef() {
    return this.widgetRef;
  }

  /**
   * Create widget configuration
   */
  createWidgetConfig(integrator: string = "aetherDex"): LifiWidgetConfig {
    return {
      integrator,
      fee: 0.02, // 2% fee
      theme: {
        container: {
          borderRadius: "12px",
          boxShadow: "none",
        },
        colors: {
          primary: "#bb3eff",
          secondary: "#1a1a1a",
          background: "#0a0a0a",
          surface: "#1a1a1a",
          text: "#ffffff",
          textSecondary: "#a0a0a0",
        },
      },
    };
  }

  /**
   * Format route information for display (supports both quote and route structures)
   */
  formatRouteInfo(route: Record<string, unknown>): {
    fromAmountFormatted: string;
    toAmountFormatted: string;
    isCrossChain: boolean;
    estimatedTime: number;
    feeUSD: number;
  } {
    // Handle both quote and route structures
    const isQuote = !!route.action && !!route.estimate;

    const action = route.action as Record<string, unknown> | undefined;
    const estimate = route.estimate as Record<string, unknown> | undefined;

    const fromToken = isQuote ? action?.fromToken : route.fromToken;
    const toToken = isQuote ? action?.toToken : route.toToken;
    const fromAmount = isQuote ? action?.fromAmount : route.fromAmount;
    const toAmount = isQuote ? estimate?.toAmount : route.toAmount;
    const fromChainId = isQuote
      ? parseInt(action?.fromChainId as string)
      : route.fromChainId;
    const toChainId = isQuote
      ? parseInt(action?.toChainId as string)
      : route.toChainId;

    const fromTokenObj = fromToken as Record<string, unknown>;
    const toTokenObj = toToken as Record<string, unknown>;

    const fromAmountFormatted = (
      parseFloat(fromAmount as string) /
      Math.pow(10, fromTokenObj.decimals as number)
    ).toFixed(6);

    const toAmountFormatted = (
      parseFloat(toAmount as string) /
      Math.pow(10, toTokenObj.decimals as number)
    ).toFixed(6);

    const isCrossChain = fromChainId !== toChainId;

    const estimatedTime = (estimate?.executionDuration as number) || 30;

    const feeUSD = isQuote
      ? ((estimate?.gasCosts as Record<string, unknown>[]) || []).reduce(
          (sum: number, cost: Record<string, unknown>) =>
            sum + parseFloat((cost.amountUSD as string) || "0"),
          0
        )
      : ((route.gasCosts as Record<string, unknown>[]) || []).reduce(
          (sum: number, cost: Record<string, unknown>) =>
            sum + parseFloat((cost.amountUSD as string) || "0"),
          0
        ) || 0;

    return {
      fromAmountFormatted,
      toAmountFormatted,
      isCrossChain,
      estimatedTime,
      feeUSD,
    };
  }

  /**
   * Get supported chain IDs for LI.FI
   */
  getSupportedChainIds(): number[] {
    return [
      1, // Ethereum
      56, // BSC
      137, // Polygon
      42161, // Arbitrum
      10, // Optimism
      250, // Fantom
      43114, // Avalanche
      25, // Cronos
      1284, // Moonbeam
      1285, // Moonriver
      2222, // Kava
      100, // Gnosis
    ];
  }

  /**
   * Validate chain support
   */
  isChainSupported(chainId: number): boolean {
    return this.getSupportedChainIds().includes(chainId);
  }

  /**
   * Get bridge information for cross-chain swaps
   */
  getBridgeInfo(
    fromChainId: number,
    toChainId: number
  ): {
    bridgeName: string;
    estimatedTime: number;
    fee: string;
    supported: boolean;
  } {
    if (fromChainId === toChainId) {
      return {
        bridgeName: "Same Chain",
        estimatedTime: 0,
        fee: "0%",
        supported: true,
      };
    }

    // Common cross-chain bridges
    const bridgeMap: {
      [key: string]: { name: string; time: number; fee: string };
    } = {
      "1-137": { name: "Polygon Bridge", time: 15, fee: "0.1%" }, // Ethereum to Polygon
      "137-1": { name: "Polygon Bridge", time: 20, fee: "0.1%" }, // Polygon to Ethereum
      "1-42161": { name: "Arbitrum Bridge", time: 10, fee: "0.05%" }, // Ethereum to Arbitrum
      "42161-1": { name: "Arbitrum Bridge", time: 15, fee: "0.05%" }, // Arbitrum to Ethereum
      "1-10": { name: "Optimism Bridge", time: 10, fee: "0.05%" }, // Ethereum to Optimism
      "10-1": { name: "Optimism Bridge", time: 15, fee: "0.05%" }, // Optimism to Ethereum
    };

    const bridgeKey = `${fromChainId}-${toChainId}`;
    const bridgeInfo = bridgeMap[bridgeKey];

    if (bridgeInfo) {
      return {
        bridgeName: bridgeInfo.name,
        estimatedTime: bridgeInfo.time,
        fee: bridgeInfo.fee,
        supported: true,
      };
    }

    // Default cross-chain bridge
    return {
      bridgeName: "LI.FI Cross-Chain",
      estimatedTime: 30,
      fee: "0.2%",
      supported: true,
    };
  }

  /**
   * Setup event listeners for LI.FI widget
   */
  setupEventListeners(callbacks: {
    onRouteExecutionStarted?: () => void;
    onRouteExecutionCompleted?: (event: Event) => void;
    onRouteExecutionFailed?: (event: Event) => void;
    onRouteUpdate?: (event: Event) => void;
  }) {
    const handleRouteExecutionStarted = () => {
      callbacks.onRouteExecutionStarted?.();
    };

    const handleRouteExecutionCompleted = (event: Event) => {
      callbacks.onRouteExecutionCompleted?.(event);
    };

    const handleRouteExecutionFailed = (event: Event) => {
      callbacks.onRouteExecutionFailed?.(event);
    };

    const handleRouteUpdate = (event: Event) => {
      callbacks.onRouteUpdate?.(event);
    };

    // Add event listeners
    window.addEventListener(
      "lifi-widget-route-execution-started",
      handleRouteExecutionStarted
    );
    window.addEventListener(
      "lifi-widget-route-execution-completed",
      handleRouteExecutionCompleted
    );
    window.addEventListener(
      "lifi-widget-route-execution-failed",
      handleRouteExecutionFailed
    );
    window.addEventListener("lifi-widget-route-update", handleRouteUpdate);

    // Return cleanup function
    return () => {
      window.removeEventListener(
        "lifi-widget-route-execution-started",
        handleRouteExecutionStarted
      );
      window.removeEventListener(
        "lifi-widget-route-execution-completed",
        handleRouteExecutionCompleted
      );
      window.removeEventListener(
        "lifi-widget-route-execution-failed",
        handleRouteExecutionFailed
      );
      window.removeEventListener("lifi-widget-route-update", handleRouteUpdate);
    };
  }

  /**
   * Format token amount for display
   */
  formatTokenAmount(
    amount: string,
    decimals: number,
    displayDecimals: number = 6
  ): string {
    const formatted = parseFloat(amount) / Math.pow(10, decimals);
    return formatted.toFixed(displayDecimals);
  }

  /**
   * Calculate slippage percentage
   */
  calculateSlippage(
    amountIn: string,
    amountOut: string,
    expectedAmountOut: string
  ): number {
    const actualOut = parseFloat(amountOut);
    const expectedOut = parseFloat(expectedAmountOut);

    if (expectedOut === 0) return 0;

    return Math.abs((actualOut - expectedOut) / expectedOut) * 100;
  }

  /**
   * Validate swap parameters
   */
  validateSwapParams(params: {
    fromToken: string;
    toToken: string;
    fromAmount: string;
    fromChainId: number;
    toChainId: number;
    toAddress: string;
  }): { valid: boolean; error?: string } {
    if (!params.fromToken || !params.toToken) {
      return { valid: false, error: "Token addresses are required" };
    }

    if (!params.fromAmount || parseFloat(params.fromAmount) <= 0) {
      return { valid: false, error: "Valid amount is required" };
    }

    if (!params.toAddress) {
      return { valid: false, error: "Recipient address is required" };
    }

    if (!this.isChainSupported(params.fromChainId)) {
      return {
        valid: false,
        error: `Unsupported source chain: ${params.fromChainId}`,
      };
    }

    if (!this.isChainSupported(params.toChainId)) {
      return {
        valid: false,
        error: `Unsupported destination chain: ${params.toChainId}`,
      };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const lifiService = LifiService.getInstance();
export default lifiService;
