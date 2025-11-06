import React, { useEffect, useState } from "react";
import StarsIcon from "public/icon/portfolio/stars-icon.svg"
import PortfolioCard from "./portfolio-card";
import { IoTrendingUp } from "react-icons/io5";
import BaseCard from "../common/base-card";
import Image from "next/image";
import { useAccount } from "wagmi";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletContext } from "@/context/WalletContext";
import { mobulaService } from "@/services/mobula.service";
import { birdeyeService, TrendingToken } from "@/services/birdeye.service";
import { useBirdEyeData } from "@/context/BirdEyeContext";
import Link from "next/link";

const PortfolioCardSection = () => {
    const { address: evmAddress, isConnected: evmConnected } = useAccount();
    const { publicKey, connected: solanaConnected } = useWallet();
    const { activeWalletType } = useWalletContext();

    const [isLoading, setIsLoading] = useState(true);
    const [portfolioData, setPortfolioData] = useState({
        totalValue: 0,
        totalChange: 0,
        changePercent: '+0.0%',
        bestPerformer: { symbol: 'N/A', change: '0%' },
        assetCount: 0,
        chainCount: 0,
        pnl24h: 0,
    });

    const [aiInsights, setAiInsights] = useState<Array<{
        type: 'opportunity' | 'alert' | 'suggestion';
        title: string;
        description: string;
        token?: TrendingToken;
    }>>([]);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            const walletAddress = activeWalletType === 'solana' ? publicKey?.toBase58() : evmAddress;
            
            if (!walletAddress) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                
                // Fetch portfolio data from Mobula API
                const portfolio = await mobulaService.getWalletPortfolio(walletAddress, {
                    cache: true,
                    stale: 60,
                });

                console.log('Portfolio card data:', portfolio);

                // Calculate metrics
                const totalValue = portfolio.total_wallet_balance || 0;
                const validAssets = (portfolio.assets || []).filter(asset => asset.estimated_balance > 0);
                
                // Find best performer (highest 24h change)
                const bestPerformer = validAssets.reduce((best, asset) => {
                    const change = asset.price_change_24h || 0;
                    return change > (best.price_change_24h || 0) ? asset : best;
                }, validAssets[0] || { asset: { symbol: 'N/A' }, price_change_24h: 0 });

                // Count unique chains
                const uniqueChains = new Set<string>();
                validAssets.forEach(asset => {
                    if (asset.cross_chain_balances) {
                        Object.keys(asset.cross_chain_balances).forEach(chain => {
                            uniqueChains.add(chain);
                        });
                    }
                });

                // Calculate 24h P&L (sum of all price changes weighted by balance)
                const pnl24h = validAssets.reduce((sum, asset) => {
                    const change = (asset.price_change_24h || 0) / 100;
                    const pnl = asset.estimated_balance * change;
                    return sum + pnl;
                }, 0);

                const changePercent = totalValue > 0 ? ((pnl24h / totalValue) * 100).toFixed(1) : '0.0';

                setPortfolioData({
                    totalValue,
                    totalChange: pnl24h,
                    changePercent: pnl24h >= 0 ? `+${changePercent}%` : `${changePercent}%`,
                    bestPerformer: {
                        symbol: bestPerformer?.asset?.symbol || 'N/A',
                        change: bestPerformer?.price_change_24h ? `${bestPerformer.price_change_24h > 0 ? '+' : ''}${bestPerformer.price_change_24h.toFixed(1)}%` : '0%'
                    },
                    assetCount: validAssets.length,
                    chainCount: uniqueChains.size,
                    pnl24h,
                });

                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch portfolio data:', error);
                setIsLoading(false);
            }
        };

        fetchPortfolioData();
    }, [evmAddress, publicKey, activeWalletType, evmConnected, solanaConnected]);

    // Get AI Insights from shared BirdEye context (no refetching)
    const { trendingTokens: contextTokens, topGainers } = useBirdEyeData();

    useEffect(() => {
        // Use the already-fetched data from context to generate insights
        const insights: Array<{
            type: 'opportunity' | 'alert' | 'suggestion';
            title: string;
            description: string;
            token?: TrendingToken;
        }> = [];

        // Generate insights from the shared context data
        if (contextTokens.length > 0 && contextTokens[0]) {
            const token = contextTokens[0];
            insights.push({
                type: 'opportunity',
                title: 'High Liquidity Opportunity',
                description: `${token.symbol} has ${birdeyeService.formatNumber(token.liquidity)} liquidity and ${birdeyeService.formatNumber(token.volume24h)} 24h volume`,
                token,
            });
        }

        if (topGainers.length > 0 && topGainers[0]) {
            const token = topGainers[0];
            insights.push({
                type: 'alert',
                title: 'Top Gainer Alert',
                description: `${token.symbol} is up ${birdeyeService.formatPercentage(token.priceChange24h)} in 24h with ${birdeyeService.formatNumber(token.volume24h)} volume`,
                token,
            });
        }

        if (contextTokens.length > 1 && contextTokens[1]) {
            const token = contextTokens[1];
            insights.push({
                type: 'suggestion',
                title: 'Diversification Suggestion',
                description: `Consider ${token.symbol} - ${birdeyeService.formatNumber(token.liquidity)} liquidity, trending with ${token.rank ? `#${token.rank} rank` : 'high activity'}`,
                token,
            });
        }

        // Fallback to default insights if no data
        if (insights.length === 0) {
            insights.push(
                {
                    type: 'opportunity',
                    title: 'Diversification Opportunity',
                    description: 'Consider adding more DePIN tokens to balance your AI-heavy portfolio',
                },
                {
                    type: 'suggestion',
                    title: 'Staking Suggestion',
                    description: 'Stake your AETH tokens to earn 10.5% APY and governance rights',
                },
                {
                    type: 'alert',
                    title: 'Rebalancing Alert',
                    description: 'TAO allocation is up 15.2% - consider taking some profits',
                }
            );
        }

        setAiInsights(insights);
    }, [contextTokens, topGainers]);

    const data = [
        {
            title: "Total Value",
            content: `$${portfolioData.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            description: `${portfolioData.totalChange >= 0 ? '+' : ''}$${Math.abs(portfolioData.totalChange).toFixed(2)}`,
            contentClassName: "",
            extraComponent: <div className={`${portfolioData.totalChange >= 0 ? 'bg-[#00C95133] border-green-600 text-green-600' : 'bg-red-500/10 border-red-500 text-red-500'} border px-3 text-xs`}>{portfolioData.changePercent}</div>,
            descriptionIcon: <IoTrendingUp />
        },
        {
            title: "Best Performer",
            content: `$${portfolioData.bestPerformer.symbol}`,
            description: portfolioData.bestPerformer.change,
            contentClassName: "",
            extraComponent: "",
            descriptionIcon: "",
            additionalDescription: ""
        },
        {
            title: "Assets",
            content: portfolioData.assetCount.toString(),
            description: "",
            contentClassName: "",
            extraComponent: <div className="bg-[#00C95133] border border-green-600 px-3 text-xs text-green-600">Active</div>,
            descriptionIcon: <div className="text-sm text-muted-foreground">{portfolioData.chainCount} Chain{portfolioData.chainCount !== 1 ? 's' : ''}</div>
        },
        {
            title: "24h P&L",
            content: `${portfolioData.pnl24h >= 0 ? '+' : ''}$${Math.abs(portfolioData.pnl24h).toFixed(2)}`,
            description: "",
            extraComponent: <IoTrendingUp size={24} />,
            contentClassName: portfolioData.pnl24h >= 0 ? "!text-green-600" : "!text-red-600",
            descriptionIcon: <div className="text-sm text-muted-foreground">Unrealized</div>
        },
    ]

    return (
        <div className="w-full flex flex-col-reverse xl:flex-col gap-6">
            <div className="flex justify-between w-full gap-3 xl:gap-0 flex-col xl:flex-row  max-w-250 xl:max-w-full">
                {data.map((item, index) => (
                    <PortfolioCard key={index} isLoading={isLoading} title={item.title} content={item.content} description={item.description} extraComponent={item.extraComponent} contentClassName={item.contentClassName} descriptionIcon={item.descriptionIcon} additionalDescription={item.additionalDescription} />
                ))}
            </div>
            <BaseCard>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-3">
                        <Image src={StarsIcon.src} width={20} height={20} alt="" />
                        <div className="text-sm text-foreground">AI Insights</div>
                    </div>
                    <div className="flex flex-col xl:flex-row justify-between gap-6">
                        {aiInsights.map((insight, index) => {
                            const handleClick = () => {
                                if (insight.token) {
                                    // Store prefill data for swap page
                                    localStorage.setItem('swapPrefill', JSON.stringify({
                                        fromToken: {
                                            symbol: 'SOL',
                                            address: 'So11111111111111111111111111111111111111112',
                                            chainId: 1151111081099710,
                                        },
                                        toToken: {
                                            symbol: insight.token.symbol,
                                            address: insight.token.address,
                                            chainId: 1151111081099710,
                                        },
                                        useJupiter: true,
                                    }));
                                    window.location.href = '/swap';
                                }
                            };

                            const getCardStyles = (type: string) => {
                                switch (type) {
                                    case 'opportunity':
                                        return {
                                            bg: 'bg-[#BB3EFF33]',
                                            border: 'border-primary',
                                            text: 'text-primary',
                                        };
                                    case 'suggestion':
                                        return {
                                            bg: 'bg-[#FB9B0033]',
                                            border: 'border-secondary',
                                            text: 'text-secondary',
                                        };
                                    case 'alert':
                                        return {
                                            bg: 'bg-[#00B8DB33]',
                                            border: 'border-cyan-500',
                                            text: 'text-cyan-500',
                                        };
                                    default:
                                        return {
                                            bg: 'bg-[#BB3EFF33]',
                                            border: 'border-primary',
                                            text: 'text-primary',
                                        };
                                }
                            };

                            const styles = getCardStyles(insight.type);

                            return (
                                <div
                                    key={index}
                                    className={`w-full xl:w-96 flex flex-col gap-1 px-4 py-5 ${styles.bg} border ${styles.border} ${insight.token ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                                    onClick={insight.token ? handleClick : undefined}
                                >
                                    <div className={`text-sm ${styles.text}`}>{insight.title}</div>
                                    <div className="text-xs text-muted-foreground">{insight.description}</div>
                                    {insight.token && (
                                        <div className="text-xs text-primary mt-1">Click to swap →</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </BaseCard>
        </div>
    );
};

export default PortfolioCardSection;
