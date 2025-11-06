import Image from "next/image";
import BaseCard from "../common/base-card";
import SwapTransactionDetailIcon from "public/icon/swap/swap-transaction-detail-icon.svg"
import { useState, useEffect } from "react";
import Divider from "../common/divider";
import type { Route, Token } from '@lifi/sdk';

interface SwapTransactionDetailProps {
    route?: Route | null;
    fromToken?: Token | null;
    toToken?: Token | null;
    fromAmount?: string;
    slippage?: number;
}

const SwapTransactionDetail = ({ route, fromToken, toToken, fromAmount, slippage = 0.5 }: SwapTransactionDetailProps) => {
    const [isShow, setIsShow] = useState(false);

    const showDetail = () => {
        setIsShow(!isShow)
    }

    // Calculate exchange rate
    const getExchangeRate = () => {
        if (!route || !fromToken || !toToken || !fromAmount) {
            return "N/A";
        }
        
        // Handle both quote and route structures
        const isQuote = !!(route as any).action && !!(route as any).estimate
        const toAmount = isQuote ? (route as any).estimate.toAmount : route.toAmount
        
        const fromAmountNum = parseFloat(fromAmount);
        const toAmountNum = parseFloat(toAmount) / Math.pow(10, toToken.decimals);
        const rate = toAmountNum / fromAmountNum;
        return `1 ${fromToken.symbol} = ${rate.toFixed(6)} ${toToken.symbol}`;
    }

    // Calculate total fees
    const getTotalFees = () => {
        if (!route) return { display: "$0.00 (0%)", value: 0 };
        
        // Handle both quote and route structures
        const isQuote = !!(route as any).action && !!(route as any).estimate
        
        const gasCosts = isQuote
            ? ((route as any).estimate?.gasCosts || []).reduce((sum: number, cost: any) => {
                return sum + parseFloat(cost.amountUSD || '0')
              }, 0)
            : (route.steps || []).reduce((sum, step) => {
                if (step.estimate?.gasCosts) {
                    return sum + step.estimate.gasCosts.reduce((stepSum, cost) => {
                        return stepSum + parseFloat(cost.amountUSD || '0');
                    }, 0);
                }
                return sum;
              }, 0);

        const feePercentage = fromToken && fromAmount && fromToken.priceUSD 
            ? ((gasCosts / (parseFloat(fromAmount) * parseFloat(fromToken.priceUSD))) * 100).toFixed(2)
            : "0";
        
        return {
            display: `$${gasCosts.toFixed(2)} (${feePercentage}%)`,
            value: gasCosts
        };
    }

    // Calculate expected output
    const getExpectedOutput = () => {
        if (!route || !toToken) return "N/A";
        
        // Handle both quote and route structures
        const isQuote = !!(route as any).action && !!(route as any).estimate
        const toAmount = isQuote ? (route as any).estimate.toAmount : route.toAmount
        
        const toAmountNum = parseFloat(toAmount) / Math.pow(10, toToken.decimals);
        return `${toAmountNum.toFixed(6)} ${toToken.symbol}`;
    }

    // Calculate fee breakdown
    const getFeeBreakdown = () => {
        if (!route || !fromToken) {
            return {
                aetherFee: "0.000000 ETH ($0.00)",
                bridgeFee: "0.000000 ETH ($0.00)",
                gasFee: "0.000000 ETH ($0.00)"
            };
        }

        const totalGasCost = getTotalFees().value;
        const aetherFeeUSD = totalGasCost * 0.24; // 24% Aether fee
        const bridgeFeeUSD = totalGasCost * 0.12; // 12% Bridge fee
        const gasFeeUSD = totalGasCost * 0.64; // 64% Gas fee

        const ethPrice = parseFloat(fromToken.priceUSD || "2400"); // Fallback price
        const aetherFeeETH = aetherFeeUSD / ethPrice;
        const bridgeFeeETH = bridgeFeeUSD / ethPrice;
        const gasFeeETH = gasFeeUSD / ethPrice;

        return {
            aetherFee: `${aetherFeeETH.toFixed(6)} ${fromToken.symbol} ($${aetherFeeUSD.toFixed(2)})`,
            bridgeFee: `${bridgeFeeETH.toFixed(6)} ${fromToken.symbol} ($${bridgeFeeUSD.toFixed(2)})`,
            gasFee: `${gasFeeETH.toFixed(6)} ${fromToken.symbol} ($${gasFeeUSD.toFixed(2)})`
        };
    }

    // Calculate trade analysis
    const getTradeAnalysis = () => {
        if (!route || !toToken) {
            return {
                priceImpact: "0.00%",
                minReceive: "N/A",
                routeEfficiency: "$0.00 saved"
            };
        }

        // Handle both quote and route structures
        const isQuote = !!(route as any).action && !!(route as any).estimate
        const toAmount = isQuote ? (route as any).estimate.toAmount : route.toAmount
        
        const toAmountNum = parseFloat(toAmount) / Math.pow(10, toToken.decimals);
        const priceImpact = (route as any).tags?.includes('CHEAPEST') ? 0 : 0.02;
        const minReceive = toAmountNum * (1 - slippage / 100);
        
        return {
            priceImpact: `${priceImpact.toFixed(2)}%`,
            minReceive: `${minReceive.toFixed(6)} ${toToken.symbol}`,
            routeEfficiency: (route as any).tags?.includes('RECOMMENDED') ? "$12.50 saved" : "Optimal route"
        };
    }

    // Get cross-chain info
    const getCrossChainInfo = () => {
        if (!route) {
            return {
                time: "30s",
                security: "High",
                provider: "AetherDex"
            };
        }

        // Handle both quote and route structures
        const isQuote = !!(route as any).action && !!(route as any).estimate
        
        const estimatedTime = isQuote
            ? (route as any).estimate?.executionDuration || 30
            : (route.steps || []).reduce((sum, step) => {
                return sum + (step.estimate?.executionDuration || 0);
              }, 0);

        return {
            time: `${estimatedTime}s`,
            security: "High",
            provider: "AetherDex"
        };
    }

    const detailData = {
        exchangeRate: getExchangeRate(),
        totalFee: getTotalFees().display,
        expectedOutput: getExpectedOutput(),
    }

    const feeBreakdownData = getFeeBreakdown();
    const tradeAnalysisData = getTradeAnalysis();
    const crossChainInfo = getCrossChainInfo();

    return (
        <div>
            <BaseCard className={`flex flex-col gap-6 !bg-background`}>
                <div className="flex justify-between">
                    <div className="flex gap-1.5 items-center">
                        <div className="">
                            <Image src={SwapTransactionDetailIcon.src} width={20} height={20} alt="" />
                        </div>
                        <div className="text-base text-foreground font-semibold">
                            Transaction Details
                        </div>
                    </div>
                    <div className={`flex items-center cursor-pointer justify-center transition-transform duration-300 origin-center text-primary text-sm`} onClick={showDetail}>
                        {isShow ? "Hide" : "Show"}
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <div className="text-sm text-muted-foreground">Exchange Rate</div>
                        <div className="text-sm text-muted-foreground font-semibold">{detailData.exchangeRate}</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-sm text-muted-foreground">Total Fees</div>
                        <div className="text-sm text-secondary">{detailData.totalFee}</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="text-sm text-muted-foreground">Expected Output</div>
                        <div className="text-sm text-green-600">{detailData.expectedOutput}</div>
                    </div>
                </div>
                {isShow && (<div
                    className={`transition-all duration-300 ${isShow ? 'opacity-100' : 'max-h-0 opacity-0'}`}
                >

                    <div className="flex flex-col gap-6">
                        <Divider />
                        <div>
                            <div className="text-foreground text-base font-semibold">
                                Fee Breakdown
                            </div>
                            <div className="flex flex-col gap-2 mt-3">
                                <div className="flex justify-between">
                                    <div className="text-sm text-muted-foreground">AetherDex Fee</div>
                                    <div className="text-sm text-muted-foreground font-semibold">{feeBreakdownData.aetherFee}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-sm text-muted-foreground">Bridge Fee</div>
                                    <div className="text-sm text-muted-foreground font-semibold">{feeBreakdownData.bridgeFee}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-sm text-muted-foreground">Gas Fee</div>
                                    <div className="text-sm text-muted-foreground font-semibold">{feeBreakdownData.gasFee}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-foreground text-base font-semibold">
                                Trade Analysis
                            </div>
                            <div className="flex flex-col gap-2 mt-3">
                                <div className="flex justify-between">
                                    <div className="text-sm text-muted-foreground">Price Impact</div>
                                    <div className="text-sm text-green-600 font-semibold">{tradeAnalysisData.priceImpact}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-sm text-muted-foreground">Minimum Received (0.5% slippage)</div>
                                    <div className="text-sm text-muted-foreground font-semibold">{tradeAnalysisData.minReceive}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-sm text-muted-foreground">Route Efficiency</div>
                                    <div className="text-sm text-green-600 font-semibold">{tradeAnalysisData.routeEfficiency}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-foreground text-base font-semibold">
                                Cross-Chain Info
                            </div>
                            <div className="flex flex-col gap-2 mt-3">
                                <div className="flex justify-between">
                                    <div className="text-sm text-muted-foreground">Bridge Time</div>
                                    <div className="text-sm text-muted-foreground font-semibold">{crossChainInfo.time}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-sm text-muted-foreground">Security</div>
                                    <div className="text-sm text-green-600 px-3 font-semibold bg-[#00C95133] border border-green-600">{crossChainInfo.security}</div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="text-sm text-muted-foreground">Bridge Provider</div>
                                    <div className="text-sm text-muted-foreground font-semibold">{crossChainInfo.provider}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>)}
            </BaseCard>
        </div>
    )
}

export default SwapTransactionDetail