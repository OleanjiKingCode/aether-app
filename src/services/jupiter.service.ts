/**
 * Jupiter API Service - Solana DEX Aggregator
 * Documentation: https://station.jup.ag/docs/apis/swap-api
 *
 * Endpoints:
 * - Quote: https://lite-api.jup.ag/swap/v1/quote
 * - Swap: https://lite-api.jup.ag/swap/v1/swap
 */

const JUPITER_API_URL = "https://lite-api.jup.ag";

export interface JupiterQuote {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  priceImpactPct: number;
  routePlan: Record<string, unknown>[];
}

export interface JupiterSwapResult {
  swapTransaction: string;
  lastValidBlockHeight: number;
  prioritizationFeeLamports?: number;
}

class JupiterService {
  private static instance: JupiterService;

  private constructor() {}

  static getInstance(): JupiterService {
    if (!JupiterService.instance) {
      JupiterService.instance = new JupiterService();
    }
    return JupiterService.instance;
  }

  /**
   * Get a quote for swapping tokens on Solana
   */
  async getQuote(
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 50 // 0.5% default
  ): Promise<JupiterQuote | null> {
    try {
      const params = new URLSearchParams({
        inputMint,
        outputMint,
        amount: amount.toString(),
        slippageBps: slippageBps.toString(),
      });

      const response = await fetch(
        `${JUPITER_API_URL}/swap/v1/quote?${params.toString()}`
      );

      if (!response.ok) {
        console.error("Jupiter quote error:", response.status);
        return null;
      }

      const quote = await response.json();
      console.log("Jupiter quote:", quote);

      return quote;
    } catch (error) {
      console.error("Failed to get Jupiter quote:", error);
      return null;
    }
  }

  /**
   * Get swap transaction for execution
   */
  async getSwapTransaction(
    quote: JupiterQuote,
    userPublicKey: string,
    wrapUnwrapSOL: boolean = true,
    prioritizationFeeLamports: number = 0
  ): Promise<JupiterSwapResult | null> {
    try {
      const response = await fetch(`${JUPITER_API_URL}/swap/v1/swap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteResponse: quote,
          userPublicKey,
          wrapAndUnwrapSol: wrapUnwrapSOL,
          prioritizationFeeLamports,
        }),
      });

      if (!response.ok) {
        console.error("Jupiter swap error:", response.status);
        return null;
      }

      const swapResult = await response.json();
      console.log("Jupiter swap transaction:", swapResult);

      return swapResult;
    } catch (error) {
      console.error("Failed to get Jupiter swap transaction:", error);
      return null;
    }
  }

  /**
   * Format quote information for display
   */
  formatQuoteInfo(quote: JupiterQuote): {
    inputAmount: number;
    outputAmount: number;
    priceImpact: number;
    minimumReceived: number;
  } {
    const inputAmount = parseInt(quote.inAmount) / 1e9; // Assuming 9 decimals
    const outputAmount = parseInt(quote.outAmount) / 1e9;
    const priceImpact = quote.priceImpactPct;
    const minimumReceived = parseInt(quote.otherAmountThreshold) / 1e9;

    return {
      inputAmount,
      outputAmount,
      priceImpact,
      minimumReceived,
    };
  }

  /**
   * Calculate price impact percentage
   */
  getPriceImpactLevel(priceImpact: number): "low" | "medium" | "high" {
    if (priceImpact < 1) return "low";
    if (priceImpact < 5) return "medium";
    return "high";
  }
}

// Export singleton instance
export const jupiterService = JupiterService.getInstance();
export default jupiterService;
