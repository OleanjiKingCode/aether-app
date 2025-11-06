import Image from "next/image";
import ChartIcon from "public/icon/Pie-Chart-Icon.svg"
import { useAccount } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletContext } from "@/context/WalletContext";
import React, { useEffect, useState } from "react";
import Divider from "../common/divider";
import Bar from "../common/skeleton/bar";
import { mobulaService } from "@/services/mobula.service";

const PortfolioAnalytics = () => {
    const { address: evmAddress, isConnected: evmConnected } = useAccount();
    const { publicKey, connected: solanaConnected } = useWallet();
    const { activeWalletType, isConnected } = useWalletContext();
    
    const [isLoading, setIsLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState({
        totalValue: 0,
        allTimeHigh: 0,
        totalInvested: 0,
        bestPerformer: 'N/A',
        worstPerformer: 'N/A',
        unrealized: 0,
        riskScore: '',
        mediumRisk: '5.0/10'
    });

    useEffect(() => {
        const fetchAnalytics = async () => {
            const walletAddress = activeWalletType === 'solana' ? publicKey?.toBase58() : evmAddress;
            
            if (!walletAddress) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                
                // Fetch portfolio data and historical data from Mobula API
                const [portfolio, history] = await Promise.all([
                    mobulaService.getWalletPortfolio(walletAddress, {
                        cache: true,
                        stale: 60,
                    }),
                    mobulaService.getWalletHistory(walletAddress, {
                        period: '1d',
                        cache: true,
                        stale: 300, // Cache for 5 minutes
                    })
                ]);

                console.log('Portfolio Analytics - Portfolio:', portfolio);
                console.log('Portfolio Analytics - History:', history);

                const validAssets = (portfolio.assets || []).filter(asset => asset.estimated_balance > 0);
                const totalValue = portfolio.total_wallet_balance || 0;
                
                // Find best and worst performers
                const bestPerformer = validAssets.reduce((best, asset) => {
                    const change = asset.price_change_24h || 0;
                    return change > (best?.price_change_24h || -Infinity) ? asset : best;
                }, validAssets[0]);

                const worstPerformer = validAssets.reduce((worst, asset) => {
                    const change = asset.price_change_24h || 0;
                    return change < (worst?.price_change_24h || Infinity) ? asset : worst;
                }, validAssets[0]);

                // Calculate unrealized P&L
                const unrealizedPnL = validAssets.reduce((sum, asset) => {
                    const change = (asset.price_change_24h || 0) / 100;
                    return sum + (asset.estimated_balance * change);
                }, 0);

                // Simple risk score based on portfolio concentration
                const topAssetAllocation = validAssets[0]?.allocation || 0;
                let riskScore = '5.0/10'; // Medium
                if (topAssetAllocation > 70) riskScore = '7.5/10'; // High
                if (topAssetAllocation < 30) riskScore = '3.0/10'; // Low

                // Get real all-time high from historical data
                const allTimeHigh = history.all_time_high || totalValue;
                console.log('All-time high:', allTimeHigh);
                
                // Calculate total invested (current value - unrealized P&L)
                const totalInvested = Math.max(0, totalValue - unrealizedPnL);
                console.log('Total invested:', totalInvested);

                setAnalyticsData({
                    totalValue,
                    allTimeHigh: allTimeHigh,
                    totalInvested: totalInvested,
                    bestPerformer: bestPerformer?.asset?.symbol || 'N/A',
                    worstPerformer: worstPerformer?.asset?.symbol || 'N/A',
                    unrealized: unrealizedPnL,
                    riskScore: '',
                    mediumRisk: riskScore
                });

                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, [evmAddress, publicKey, activeWalletType, evmConnected, solanaConnected]);

    const allocationData = analyticsData;


    return (
        <div className="p-6 border-input border-[1px] bg-card  w-full max-w-250 xl:max-w-full xl:w-125">
            <div className="flex items-center gap-1.5">
                <div className="">
                    <Image src={ChartIcon.src} alt="" height={15} width={15} />
                </div>
                <div className="font-geist-mono font-semibold text-sm sm:text-base text-foreground">
                    Portfolio Analytics
                </div>
            </div>
            <div className="flex flex-col w-full gap-5 mt-2.5">
                <div className="flex justify-between">
                    {isLoading && <Bar barClassName="w-19 h-2.5" />}
                    {!isLoading && <div className="text-xs text-muted-foreground">Total Value</div>}
                    {isLoading && <Bar barClassName="w-19 h-2.5" />}
                    {!isLoading && <div className="text-xs text-muted-foreground">${allocationData.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>}
                </div>
                <div className="flex justify-between">
                    {isLoading && <Bar barClassName="w-19 h-2.5" />}
                    {!isLoading && <div className="text-xs text-muted-foreground">All Time High</div>}
                    {isLoading && <Bar barClassName="w-19 h-2.5" />}
                    {!isLoading && <div className="text-xs text-green-600">${allocationData.allTimeHigh.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>}
                </div>
                <div className="flex justify-between">
                    {isLoading && <Bar barClassName="w-19 h-2.5" />}
                    {!isLoading && <div className="text-xs text-muted-foreground">Total Invested</div>}
                    {isLoading && <Bar barClassName="w-19 h-2.5" />}
                    {!isLoading && <div className="text-xs text-muted-foreground">${allocationData.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>}
                </div>
                <div className="flex justify-between">
                    {isLoading && <Bar barClassName="w-19 h-2.5" />}
                    {!isLoading && <div className="text-xs text-muted-foreground">Best Performer</div>}
                    {isLoading && <Bar barClassName="w-19 h-2.5" />}
                    {!isLoading && <div className="text-xs text-muted-foreground">{allocationData.bestPerformer}</div>}
                </div>
                <div className="flex justify-between">
                    {isLoading && <Bar barClassName="w-19 h-2.5" />}
                    {!isLoading && <div className="text-xs text-muted-foreground">Worst Performer</div>}
                    {isLoading && <Bar barClassName="w-19 h-2.5" />}
                    {!isLoading && <div className="text-xs text-muted-foreground">{allocationData.worstPerformer}</div>}
                </div>
                <div className="flex flex-col gap-2.5">
                    <div className="flex justify-between">
                        {isLoading && <Bar barClassName="w-19 h-2.5" />}
                        {!isLoading && <div className="text-xs text-muted-foreground">Unrealized P/L</div>}
                        {isLoading && <Bar barClassName="w-19 h-2.5" />}
                        {!isLoading && <div className={`text-xs ${allocationData.unrealized >= 0 ? 'text-green-600' : 'text-red-600'}`}>{allocationData.unrealized >= 0 ? '+' : ''}${allocationData.unrealized.toFixed(2)}</div>}
                    </div>
                    <Divider />
                    <div className="flex justify-between">
                        {isLoading && <Bar barClassName="w-19 h-2.5" />}
                        {!isLoading && <div className="text-xs text-muted-foreground">Risk Score</div>}
                        {isLoading && <Bar barClassName="w-19 h-2.5" />}
                        {!isLoading && <div className="text-xs text-muted-foreground">{allocationData.riskScore}</div>}
                    </div>
                </div>
                <div className="flex justify-between">
                    {isLoading && <Bar barClassName="w-19 h-2.5" />}
                    {!isLoading && <div className="text-xs text-muted-foreground">Medium risk portfolio</div>}
                    {isLoading && <Bar barClassName="w-19 h-2.5" />}
                    {!isLoading && <div className="text-xs text-muted-foreground">{allocationData.mediumRisk}</div>}
                </div>
            </div>
        </div>
    )
}

export default PortfolioAnalytics;